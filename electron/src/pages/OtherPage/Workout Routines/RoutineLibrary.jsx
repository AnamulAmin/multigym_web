import React, { useContext, useEffect, useState } from "react";
import DashboardTitle from "../../../components/partial/DashboardTitle/Title";
import Mtitle from "/src/components library/Mtitle";
import axios from "axios";
import UseAxiosSecure from "../../../Hook/UseAxioSecure";
import { IoSend } from "react-icons/io5";
import { RiCloseLargeFill } from "react-icons/ri";
import { FaDumbbell, FaWeightHanging } from "react-icons/fa";
import { GiWeightLiftingUp } from "react-icons/gi";

import { RiDeleteBin7Line } from "react-icons/ri";
import { FiEdit3 } from "react-icons/fi";
import { TbListDetails } from "react-icons/tb";
import Mpagination from "../../../components library/Mpagination";
import { TfiSearch } from "react-icons/tfi";
import UserSearch from "../Locker Management/UserSearch";
import { AuthContext } from "../../../providers/AuthProvider";

const RoutineLibrary = () => {
  const [routines, setRoutines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const axiosSecure = UseAxiosSecure();
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [routineId, setRoutineId] = useState(null);

  const openEditModal = (routine) => {
    setSelectedRoutine(routine);
    setIsEditModalOpen(true);
  };

  const openViewModal = (routine) => {
    setSelectedRoutine(routine);
    setIsViewModalOpen(true);
  };

  const closeModals = () => {
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setSelectedRoutine(null);
  };

  // const branch = "Shia";
  const { branch } = useContext(AuthContext);
  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const response = await axiosSecure.get(
          `/workout-routines/branch/all?branchName=${branch}`
        );
        setRoutines(response.data);
      } catch (error) {
        console.error("Error fetching routines:", error);
      }
    };
    fetchRoutines();
  }, [axiosSecure]);

  const handleDelete = async (id) => {
    try {
      await axiosSecure.delete(`/workout-routines/delete/${id}`);
      setRoutines((prevRoutines) =>
        prevRoutines.filter((routine) => routine._id !== id)
      );
      alert("Routine deleted successfully.");
    } catch (error) {
      console.error("Error deleting routine:", error);
      alert("There was an error deleting the routine.");
    }
  };

  const handleEditSubmit = async (updatedRoutine) => {
    try {
      await axiosSecure.put(
        `/workout-routines/update/${updatedRoutine._id}`,
        updatedRoutine
      );
      setRoutines((prevRoutines) =>
        prevRoutines.map((routine) =>
          routine._id === updatedRoutine._id ? updatedRoutine : routine
        )
      );
      closeModals();
      alert("Routine updated successfully.");
    } catch (error) {
      console.error("Error updating routine:", error);
      alert("There was an error updating the routine.");
    }
  };

  // Filtering routines based on search term
  const filteredRoutines = routines.filter((routine) =>
    routine.routineName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { paginatedData, paginationControls, rowsPerPageAndTotal } =
    Mpagination({ totalData: filteredRoutines });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleSend = (id) => {
    setRoutineId(id);
    setIsModalOpen(true);
  };

  const handleUserSelect = async (userId) => {
    try {
      const response = await axiosSecure.patch(
        `/workout-routines/${userId}/add-users`,
        {
          routineId: routineId,
          branch,
        }
      );

      if (response.status === 200) {
        console.log("Users successfully added to the routine:", response.data);
        // Optionally clear selected users or perform other UI updates
      }
    } catch (error) {
      console.error("Error adding users to routine:", error);
    }
  };

  return (
    <div>
      <Mtitle
        title="Routine Library"
        rightcontent={
          <section className="flex mt-3 md:mt-0 justify-between">
            <div className="flex justify-end gap-4 items-center md:mb-4">
              {/* Search bar */}
              <div className="w-64 border shadow-sm py-2 px-3 bg-white rounded-xl">
                <div className="flex items-center gap-2">
                  <TfiSearch className="text-2xl font-bold text-gray-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="outline-none w-full"
                    placeholder="Search routine"
                  />
                </div>
              </div>
            </div>
          </section>
        }
      />

      <div className="p-4 md:pt-4 pt-0">
        <div className="mb-4 text-sm md:text-base text-gray-500">
          {rowsPerPageAndTotal}
        </div>
        {/* <h2 className="text-2xl font-semibold mb-4">Workout Routines</h2> */}
        <div className="overflow-x-auto border rounded-xl">
          <table className="min-w-full text-sm md:text-base   border-gray-200">
            <thead>
              <tr>
                <td className="px-4 py-3 text-left">Routine Name</td>
                <td className="px-4 py-3 text-left">Difficulty</td>
                <td className="px-4 py-3 text-left">Days</td>
                <td className="px-4 py-3 text-left">Branch</td>
                <td className="px-4 py-3 text-left">Actions</td>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((routine) => (
                <tr
                  key={routine._id}
                  className="border-t hover:bg-gray-100 border-gray-200"
                >
                  <td className="px-4  py-4">{routine.routineName}</td>
                  <td className="px-4 py-4 capitalize">{routine.difficulty}</td>
                  <td className="px-4 py-4">{routine.days}</td>
                  <td className="px-4 py-4">{routine.branchName}</td>

                  <td className="px-4 py-4 flex gap-3">
                    <button onClick={() => openViewModal(routine)} className="">
                      <TbListDetails className="text-lg my-3 md:my-0 md:text-xl" />
                    </button>
                    <button onClick={() => openEditModal(routine)} className="">
                      <FiEdit3 className="text-lg my-3 md:my-0 md:text-xl text-blue-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(routine._id)}
                      className=""
                    >
                      <RiDeleteBin7Line className="text-lg my-3 md:my-0 md:text-xl text-red-500" />
                    </button>
                    <button
                      onClick={() => handleSend(routine._id)}
                      className=""
                    >
                      <IoSend className="text-lg my-3 md:my-0 md:text-lg text-blue-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {paginationControls}

        {/* Modals */}
        {isViewModalOpen && selectedRoutine && (
          <ViewModal routine={selectedRoutine} closeModal={closeModals} />
        )}
        {isEditModalOpen && selectedRoutine && (
          <EditModal
            routine={selectedRoutine}
            setRoutine={setSelectedRoutine}
            handleEditSubmit={handleEditSubmit}
            closeModal={closeModals}
          />
        )}
      </div>

      {/* Users for sending */}
      {/* {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg  min-w-[800px]">
            <h2 className="text-2xl font-semibold mb-4">Assign Routine to Member</h2>
            <UserSearch
              setIsShow={setIsModalOpen}
              setUserId={handleUserSelect}
            />
            <div className="flex max-w-min gap-3 cursor-pointer  items-center bg-gray-500 text-white py-2 px-4 rounded-xl shadow hover:bg-gray-600 hover:border border hover:border-gray-300 hover:shadow-none transition duration-300">
              <button
                onClick={() => { setIsModalOpen(false); }}
              >
                Close
              </button>

            </div>


          </div>
        </div>
      )} */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white md:p-6 p-4 rounded-lg shadow-lg max-h-[95vh] md:max-h-[90vh] overflow-y-auto md:min-w-[800px]">
            <h2 className="text-2xl font-semibold mb-4">
              Assign Routine to Member
            </h2>
            <UserSearch
              setIsShow={setIsModalOpen}
              setUserId={handleUserSelect}
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                }}
                className="bg-gray-500 text-white py-2 px-4 rounded-xl shadow hover:bg-gray-600 transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ViewModal = ({ routine, closeModal }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="relative">
        <div className="bg-white rounded-lg shadow-lg md:p-8 p-5 pt-8 md:min-w-[400px] max-h-[90vh] overflow-y-auto">
          {/* Top White Bar */}
          <div className="absolute h-14 z-10 w-[98%] bg-white left-0 top-0 rounded-lg"></div>

          {/* Modal Header */}
          <div className="absolute top-5 flex justify-between items-center w-full pr-16  z-30">
            <h3 className="md:text-xl font-semibold">
              {routine.routineName} Workouts
            </h3>
            <div onClick={closeModal} className=" rounded p-[2px]">
              <RiCloseLargeFill className="cursor-pointer" />
            </div>
          </div>

          {/* Workout Grid */}
          <WorkoutGrid routine={routine}></WorkoutGrid>
        </div>
      </div>
    </div>
  );
};

const EditModal = ({ routine, setRoutine, handleEditSubmit, closeModal }) => {
  const [formData, setFormData] = useState({ ...routine });
  const [btnLoading, setBtnLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleWorkoutChange = (index, field, value) => {
    const updatedWorkouts = [...formData.workouts];
    updatedWorkouts[index] = { ...updatedWorkouts[index], [field]: value };
    setFormData((prevData) => ({ ...prevData, workouts: updatedWorkouts }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setBtnLoading(true);
    handleEditSubmit(formData);
    setBtnLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg w-[90%] md:min-w-[400px] h-[80vh] flex flex-col"
      >
        {/* Fixed Title */}
        <div className="p-4 px-5 border-b">
          <h3 className="text-xl font-semibold">
            Edit Routine: {routine.routineName}
          </h3>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 px-5 pt-4 overflow-y-auto flex-grow">
          <div className="">
            {/* Routine Name */}
            <label className="block font-medium mb-1">Routine Name</label>
            <input
              type="text"
              name="routineName"
              value={formData.routineName}
              onChange={handleChange}
              className="border  p-2 w-full mb-4 rounded-xl outline-none focus:border-gray-300"
              placeholder="Routine Name"
              required
            />

            {/* Difficulty */}
            <label className="block font-medium mb-1">Difficulty</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="border rounded-xl outline-none focus:border-gray-300 p-2 w-full mb-4"
              required
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advance">Advance</option>
            </select>

            {/* Days */}
            <label className="block font-medium mb-1">Days</label>
            <input
              type="number"
              name="days"
              value={formData.days}
              onChange={handleChange}
              className="border rounded-xl outline-none focus:border-gray-300 p-2 w-full mb-4"
              placeholder="Days"
              required
              min="1"
              max="6"
            />

            {/* Branch Name */}
            <label className="block font-medium mb-1">Branch Name</label>
            <input
              type="text"
              name="branchName"
              value={formData.branchName}
              onChange={handleChange}
              className="border rounded-xl outline-none focus:border-gray-300 p-2 w-full mb-4"
              placeholder="Branch Name"
              required
            />

            {/* Description */}
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              className="border rounded-xl resize-none outline-none focus:border-gray-300 p-2 w-full mb-4"
              placeholder="Routine Description"
            />
          </div>

          {/* Workouts - Day wise */}
          <h4 className="text-lg font-semibold mb-2">Edit Workouts</h4>
          {formData.workouts &&
            formData.workouts.map((workout, index) => (
              <div key={index} className="mb-4 p-4 border rounded-xl">
                <h5 className="font-semibold mb-2">{`Day ${workout.day} - ${workout.dayName}`}</h5>

                {/* Day Name */}
                <label className="block font-medium mb-1">Day Name</label>
                <input
                  type="text"
                  value={workout.dayName}
                  onChange={(e) =>
                    handleWorkoutChange(index, "dayName", e.target.value)
                  }
                  className="border rounded-xl outline-none focus:border-gray-300 p-2 w-full mb-2"
                  placeholder="Day Name"
                />

                {/* Exercises */}
                {workout.exercises.map((exercise, idx) => (
                  <div key={idx} className="ml-4 mt-2">
                    <h6 className="font-medium mb-1">
                      Exercise {idx + 1} : {exercise.workout.name}
                    </h6>

                    {/* Exercise Name */}
                    {/* <label className="block font-medium mb-1">Exercise Name {exercise.workout.name}</label> */}
                    {/* <input
                      type="text"
                      value={exercise.workout.name}
                      onChange={(e) => {
                        const updatedExercises = [...workout.exercises];
                        updatedExercises[idx] = { ...exercise, workout: e.target.value };
                        handleWorkoutChange(index, "exercises", updatedExercises);
                      }}
                      className="border rounded p-2 w-full mb-2"
                      placeholder="Workout Name"
                    /> */}

                    {/* Sets */}
                    <label className="block font-medium mb-1">Sets</label>
                    <input
                      type="number"
                      value={exercise.sets}
                      onChange={(e) => {
                        const updatedExercises = [...workout.exercises];
                        updatedExercises[idx] = {
                          ...exercise,
                          sets: e.target.value,
                        };
                        handleWorkoutChange(
                          index,
                          "exercises",
                          updatedExercises
                        );
                      }}
                      className="border rounded-xl outline-none focus:border-gray-300 p-2 w-full mb-2"
                      placeholder="Sets"
                      min="1"
                    />

                    {/* Reps */}
                    <label className="block font-medium mb-1">Reps</label>
                    <input
                      type="text"
                      value={exercise.reps.join(", ")}
                      onChange={(e) => {
                        const updatedExercises = [...workout.exercises];
                        updatedExercises[idx] = {
                          ...exercise,
                          reps: e.target.value.split(",").map(Number),
                        };
                        handleWorkoutChange(
                          index,
                          "exercises",
                          updatedExercises
                        );
                      }}
                      className="border rounded-xl outline-none focus:border-gray-300 p-2 w-full mb-2"
                      placeholder="Reps (comma separated)"
                    />
                  </div>
                ))}
              </div>
            ))}
        </div>

        {/* Fixed Buttons */}
        <div className="px-6 py-4 flex justify-end">
          <button
            type="button"
            onClick={closeModal}
            className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-xl font-semibold text-white mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600  text-white px-4 py-2 rounded-xl font-semibold"
            disabled={btnLoading}
          >
            {btnLoading && (
              <span
                className="spinner-border spinner-border-sm mr-2"
                role="status"
                aria-hidden="true"
              ></span>
            )}
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

const WorkoutGrid = ({ routine }) => {
  const [gridCols, setGridCols] = useState("grid-cols-1");

  const colors = [
    { bg: "bg-yellow-50", border: "border-yellow-200" },
    { bg: "bg-pink-50", border: "border-pink-200" },
    { bg: "bg-blue-50", border: "border-blue-200" },
    { bg: "bg-green-50", border: "border-green-200" },
    { bg: "bg-purple-50", border: "border-purple-200" },
  ];

  useEffect(() => {
    const workoutCount = routine.workouts.length;
    if (workoutCount > 2) {
      setGridCols("grid-cols-3");
    } else if (workoutCount === 2) {
      setGridCols("grid-cols-2");
    } else {
      setGridCols("grid-cols-1");
    }
  }, [routine.workouts]);

  return (
    <div className={`grid grid-cols-1 md:${gridCols} gap-6 mt-7`}>
      {routine.workouts.map((workout, index) => {
        const color = colors[index % colors.length];
        return (
          <div
            key={index}
            className={`border ${color.border} rounded-xl md:p-6 p-4 shadow ${color.bg} hover:bg-opacity-90 transition duration-300 ease-in-out transform hover:-translate-y-1`}
          >
            <h4 className="font-semibold md:text-xl flex items-center gap-2 mb-4">
              <GiWeightLiftingUp className="text-gray-600" />{" "}
              {`Day ${workout.day} - ${workout.dayName}`}
            </h4>
            <div className="space-y-4">
              {workout.exercises.map((exercise, idx) => (
                <div
                  key={idx}
                  className="border rounded-lg border-gray-200 p-3  shadow-sm bg-white  transition"
                >
                  <p className="font-medium text-sm md:text-lg flex items-center gap-2 mb-1">
                    <FaDumbbell className="text-pink-500" />{" "}
                    {`Workout: ${exercise.workout.name}`}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-2 mb-2">
                    <FaWeightHanging className="text-blue-500" />{" "}
                    {`Equipment: ${exercise.workout.equipment}`}
                  </p>
                  <div className="flex gap-6">
                    <p className="text-sm flex items-center gap-1 text-green-600">
                      <span className="font-semibold">Sets:</span>{" "}
                      {exercise.sets}
                    </p>
                    <p className="text-sm flex items-center gap-1 text-purple-600">
                      <span className="font-semibold">Reps:</span>{" "}
                      {exercise.reps.join(", ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RoutineLibrary;
