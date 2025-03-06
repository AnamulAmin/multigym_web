import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import UseAxiosSecure from "../../../../Hook/UseAxioSecure";
import Mpagination from "../../../../components library/Mpagination";
import { useAuth } from "../../../../providers/AuthProvider";

const WorkoutPlannerModal = ({
  routineName,
  difficulty,
  numberOfDays,
  onClose,
  onSave,
  branchName,
}) => {
  const [dayNames, setDayNames] = useState(
    Array.from({ length: numberOfDays }, (_, i) => `Day ${i + 1}`)
  );

  const [currentDay, setCurrentDay] = useState(1);
  const [workouts, setWorkouts] = useState([]);
  const [muscleGroups, setMuscleGroups] = useState("All");
  const [submuscleGroups, setSubMuscleGroups] = useState("All");
  const [selectedWorkouts, setSelectedWorkouts] = useState(
    Array(numberOfDays).fill([]) // Array to track selected workouts for each day
  );
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [routineSummary, setRoutineSummary] = useState([]);
  const [setsReps, setSetsReps] = useState({}); // New state to store sets and reps for each workout
  const { branch } = useAuth();
  const [loading, setLoading] = useState(false);

  const axiosSecure = UseAxiosSecure();
  const muscleGroupslist = {
    All: [],
    Stretching: [
      "Lower Stretching",
      "Upper Stretching ",
      "Middle  Stretching ",
    ],
    Chest: ["Upper Chest", "Middle Chest", "Lower Chest", "Inner Chest"],
    Back: ["Rhomboids", "Upper Lats", "Middle Lats", "Lower Lats"],
    Legs: ["Quads", "Glutes", "Hamstrings", "Calves"],
    Cardio: [
      "High-Intensity Cardio",
      "Moderate-Intensity Cardio",
      "Low-Intensity Cardio",
      "HIIT Cardio",
    ],
    Abs: ["Upper Abs", "Lower Abs", "Obliques Abs", "Whole Abs"],
    Forearms: ["Flexion", "Extension", "Brachioradialis"],
    Shoulders: [
      "Trapezius",
      "Rear Shoulders",
      "Side Shoulders",
      "Front Shoulders",
    ],
    Biceps: ["Long Head", "Short Head", "Brachialis"],
    Triceps: ["Long Triceps", "Medial Tricep", "Lateral Tricep"],
    Other: [],
  };

  const handleDayNameChange = (e) => {
    const updatedDayNames = [...dayNames];
    updatedDayNames[currentDay - 1] = e.target.value;
    setDayNames(updatedDayNames);
  };

  const handleNext = () => {
    if (currentDay < numberOfDays) {
      setCurrentDay(currentDay + 1);
    }
  };

  const handlePrevious = () => {
    if (currentDay > 1) {
      setCurrentDay(currentDay - 1);
    }
  };

  const handleSave = () => {
    const routine = selectedWorkouts.map((workouts, index) => ({
      dayName: dayNames[index],
      workouts: workouts,
    }));

    setRoutineSummary(routine);

    const initialSetsReps = {};
    routine.forEach((day) => {
      day.workouts.forEach((workout) => {
        initialSetsReps[workout._id] = [{ reps: 0 }];
      });
    });
    setSetsReps(initialSetsReps);

    setShowSummaryModal(true);
  };

  const handleMuscleChange = (e) => {
    setMuscleGroups(e.target.value);
    setSubMuscleGroups("All");
  };

  const handleSubMuscleChange = (e) => {
    setSubMuscleGroups(e.target.value);
  };

  const handleWorkoutSelect = (workout) => {
    const updatedSelectedWorkouts = [...selectedWorkouts];
    const currentDayWorkouts = updatedSelectedWorkouts[currentDay - 1] || [];

    if (currentDayWorkouts.some((w) => w._id === workout._id)) {
      updatedSelectedWorkouts[currentDay - 1] = currentDayWorkouts.filter(
        (w) => w._id !== workout._id
      );
    } else {
      updatedSelectedWorkouts[currentDay - 1] = [
        ...currentDayWorkouts,
        workout,
      ];
    }
    setSelectedWorkouts(updatedSelectedWorkouts);
  };

  const handleSetsRepsChange = (workoutId, setIndex, value) => {
    setSetsReps((prev) => ({
      ...prev,
      [workoutId]: prev[workoutId].map((set, index) =>
        index === setIndex ? { reps: value } : set
      ),
    }));
  };

  const addSet = (workoutId) => {
    setSetsReps((prev) => ({
      ...prev,
      [workoutId]: [...prev[workoutId], { reps: 0 }],
    }));
  };

  const removeSet = (workoutId, setIndex) => {
    setSetsReps((prev) => ({
      ...prev,
      [workoutId]: prev[workoutId].filter((_, index) => index !== setIndex),
    }));
  };

  // const saveFinalRoutine = () => {

  //   const routine = routineSummary.map((day, index) => ({
  //     dayName: dayNames[index],
  //     day: index + 1,
  //     exercises: day.workouts.map((workout) => ({
  //       workout: {
  //         _id: workout._id,
  //         name: workout.name
  //       },
  //       sets: setsReps[workout._id]?.length || 0,
  //       reps: setsReps[workout._id]?.map(set => set.reps)
  //     })),
  //   }));

  //   console.log(routine);

  //   onSave(routine);

  //   onClose();
  // };
  const saveFinalRoutine = async () => {
    setLoading(true);
    const workouts = routineSummary.map((day, index) => ({
      dayName: dayNames[index],
      day: index + 1,
      exercises: day.workouts.map((workout) => ({
        workout: {
          _id: workout._id,
          name: workout.name,
        },
        sets: setsReps[workout._id]?.length || 0,
        reps: setsReps[workout._id]?.map((set) => set.reps),
      })),
    }));

    // console.log(routine); // To verify the structure before posting

    try {
      // POST request to your backend to save the routine
      const response = await axiosSecure.post(
        `/workout-routines/create?branch=${branch}`,
        {
          routineName,
          branchName, // Including branch name here
          days: numberOfDays,
          workouts,
          difficulty,
        }
      );

      console.log("Routine saved:", response.data);
      alert("Workout routine successfully saved!");
      onSave(routine);
      setShowSummaryModal(false);
      setLoading(false);
      onClose();
    } catch (error) {
      setShowSummaryModal(false);
      onClose();
      console.error("Error saving routine:", error);
      // alert("There was an error saving the routine.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await axiosSecure.get(
          `/workouts/filter/${muscleGroups}/${submuscleGroups}/All?branch=${branch}`
        );
        setWorkouts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchWorkouts();
  }, [muscleGroups, submuscleGroups]);

  const { paginatedData, paginationControls } = Mpagination({
    totalData: workouts,
  });

  const selectedWorkoutCount = selectedWorkouts[currentDay - 1]?.length || 0;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-3xl max-h-[95%] overflow-scroll overflow-x-hidden h-auto p-6 rounded-lg shadow-lg relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          <AiOutlineClose size={24} />
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center">
          {routineName} - Day {currentDay} of {numberOfDays}
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Day Name</label>
          <input
            type="text"
            value={dayNames[currentDay - 1]}
            onChange={handleDayNameChange}
            className=" p-3 outline-none border rounded-xl w-full"
          />
        </div>

        <div className="flex gap-3 justify-between">
          <div className="w-full">
            <label className="block text-sm mb-2 text-gray-700">
              Muscle Group
            </label>
            <select
              value={muscleGroups}
              onChange={handleMuscleChange}
              className=" p-3 outline-none border rounded-xl w-full"
            >
              {Object.keys(muscleGroupslist).map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full">
            <label className="block text-sm mb-2 text-gray-700">
              Submuscle Group
            </label>
            <select
              value={submuscleGroups}
              onChange={handleSubMuscleChange}
              className="select  p-3 outline-none border rounded-xl w-full"
              disabled={
                muscleGroups === "All" ||
                muscleGroupslist[muscleGroups].length === 0
              }
            >
              {muscleGroups === "All"
                ? null
                : muscleGroupslist[muscleGroups].map((subgroup) => (
                    <option key={subgroup} value={subgroup}>
                      {subgroup}
                    </option>
                  ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <h1>Total Workouts: {workouts.length}</h1>
        </div>

        <div>
          <h2 className="mt-2 mb-4 text-center font-semibold">
            Workouts Selected for {dayNames[currentDay - 1]}:{" "}
            {selectedWorkoutCount}
          </h2>
        </div>

        <div>
          <table className="table-auto w-full">
            {/* <thead>
              <tr>
                <td className="px-4 py-2">Picture</td>
                <td className="px-4 py-2">Workout Name</td>
                <td className="px-4 py-2">Select</td>
              </tr>
            </thead> */}
            <tbody>
              {paginatedData.map((workout) => (
                <tr className="border-y" key={workout._id}>
                  <td className="px-4 py-2">
                    <img
                      src={workout.photo}
                      alt={workout.name}
                      className="w-16 h-16"
                    />
                  </td>
                  <td className="px-4 py-2">{workout.name}</td>
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={(selectedWorkouts[currentDay - 1] || []).some(
                        (w) => w._id === workout._id
                      )}
                      onChange={() => handleWorkoutSelect(workout)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>{paginationControls}</div>
        </div>

        <div className="flex justify-between mt-4">
          <button
            className={`bg-blue-500 text-white px-4 py-2 rounded ${
              currentDay === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handlePrevious}
            disabled={currentDay === 1}
          >
            Previous
          </button>
          <button
            className={`bg-blue-500 text-white px-4 py-2 rounded ${
              currentDay === numberOfDays ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleNext}
            disabled={currentDay === numberOfDays}
          >
            Next
          </button>
        </div>
        {console.log(
          "Current Day:",
          currentDay,
          "Number of Days:",
          numberOfDays
        )}
        <div className="mt-4">
          <button
            className="btn btn-success text-white w-full"
            onClick={handleSave}
          >
            Save Routine
          </button>
        </div>

        {/* <div className="flex justify-between mt-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleSave}
          >
            Save
          </button>
        </div> */}

        {/* Summary Modal */}
        {showSummaryModal && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white max-h-[90%] overflow-x-hidden overflow-scroll  w-full max-w-md p-6 rounded-lg shadow-lg relative">
              <h2 className="text-2xl font-semibold mb-4">Routine Summary</h2>
              {routineSummary.map((day, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-bold">{day.dayName}</h3>
                  <ul>
                    {day.workouts.length === 0 ? (
                      <li>No workouts selected</li>
                    ) : (
                      day.workouts.map((workout) => (
                        <li key={workout._id}>
                          {workout.name}
                          <ul>
                            {setsReps[workout._id]?.map((set, setIndex) => (
                              <li key={setIndex}>
                                Set {setIndex + 1}:{" "}
                                <input
                                  type="number"
                                  min="1"
                                  value={set.reps}
                                  onChange={(e) =>
                                    handleSetsRepsChange(
                                      workout._id,
                                      setIndex,
                                      parseInt(e.target.value)
                                    )
                                  }
                                  className="input input-bordered w-16"
                                />{" "}
                                Reps{" "}
                                {setsReps[workout._id]?.length > 1 && (
                                  <button
                                    className="text-red-500"
                                    onClick={() =>
                                      removeSet(workout._id, setIndex)
                                    }
                                  >
                                    Remove Set
                                  </button>
                                )}
                              </li>
                            ))}
                          </ul>
                          <button
                            className="text-blue-500 mt-2"
                            onClick={() => addSet(workout._id)}
                          >
                            Add Set
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              ))}
              <button
                className="bg-green-500 btn rounded-xl font-semibold text-white px-4 py-2  hover:bg-green-600 mt-4"
                onClick={saveFinalRoutine}
                disabled={loading}
              >
                {loading && (
                  <span className="loading loading-spinner loading-md"></span>
                )}
                Save Final Routine
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPlannerModal;
