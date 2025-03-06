import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../../Hook/UseAxioSecure";
import { useAuth } from "../../../../providers/AuthProvider";

const WorkoutModal = ({
  workout,
  onClose,
  onSave,
  muscles,
  submusclesData,
  equipments,
  difficulties,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    muscle: "",
    submuscle: "",
    equipment: "",
    difficulty: "",
    instructions: "",
    photo: "",
    video: "",
  });
  const [filteredSubmuscles, setFilteredSubmuscles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { branch } = useAuth();

  const axiosSecure = UseAxiosSecure();
  const workoutTypes = [
    "Strength",
    "Cardio",
    "Flexibility",
    "Balance",
    "Endurance",
    "HIIT",
    "Circuit Training",
    "Powerlifting",
    "Bodybuilding",
    "Plyometrics",
  ];

  const filterOptions = (options) =>
    options.filter((option) => option !== "All");

  useEffect(() => {
    if (workout) {
      setFormData({
        name: workout.name,
        type: workout.type,
        muscle: workout.muscle,
        submuscle: workout.submuscle || "",
        equipment: workout.equipment,
        difficulty: workout.difficulty,
        instructions: workout.instructions,
        photo: workout.photo,
        video: workout.video,
      });

      setFilteredSubmuscles(submusclesData[workout.muscle] || []);
    }
  }, [workout, submusclesData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "muscle") {
      setFilteredSubmuscles(submusclesData[value] || []);
      setFormData({
        ...formData,
        muscle: value,
        submuscle: "",
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    if (!formData.name.trim()) {
      Swal.fire("Validation Error", "Name is required.", "error");
      return;
    }

    if (!formData.type) {
      Swal.fire("Validation Error", "Workout type is required.", "error");
      return;
    }

    if (!formData.muscle) {
      Swal.fire("Validation Error", "Muscle group is required.", "error");
      return;
    }

    if (!formData.equipment) {
      Swal.fire("Validation Error", "Equipment type is required.", "error");
      return;
    }

    if (!formData.difficulty) {
      Swal.fire("Validation Error", "Difficulty level is required.", "error");
      return;
    }

    if (!formData.instructions.trim()) {
      Swal.fire("Validation Error", "Instructions are required.", "error");
      return;
    }

    if (formData.instructions.length < 10) {
      Swal.fire(
        "Validation Error",
        "Instructions must be at least 10 characters.",
        "error"
      );
      return;
    }
    try {
      if (workout) {
        console.log(formData);
        await axiosSecure.put(
          `/workouts/put/${workout._id}?branch=${branch}`,
          formData
        );
        Swal.fire("Success!", "Workout updated successfully!", "success");
      } else {
        await axiosSecure.post(`/workouts/post?branch=${branch}`, formData);
        Swal.fire("Success!", "Workout added successfully!", "success");
      }
      onSave();
      setLoading(false);
    } catch (error) {
      console.error("Error saving workout:", error);
      Swal.fire("Error!", "There was an error saving the workout.", "error");
      setLoading(false);
    } finally {
      setLoading(false);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:max-w-md max-h-[90vh] overflow-scroll">
        <h2 className="text-xl font-semibold mb-4">
          {workout ? "Edit Workout" : "Add New Workout"}
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            {workoutTypes.map((typeOption) => (
              <option key={typeOption} value={typeOption}>
                {typeOption}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Muscle</label>
          <select
            name="muscle"
            value={formData.muscle}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Muscle</option>
            {filterOptions(muscles).map((muscleOption) => (
              <option key={muscleOption} value={muscleOption}>
                {muscleOption}
              </option>
            ))}
          </select>
        </div>

        {formData.muscle && filteredSubmuscles.length > 0 && (
          <div className="mb-4">
            <label className="block text-gray-700">Submuscle</label>
            <select
              name="submuscle"
              value={formData.submuscle}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Submuscle</option>
              {filteredSubmuscles.map((submuscleOption) => (
                <option key={submuscleOption} value={submuscleOption}>
                  {submuscleOption}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700">Equipment</label>
          <select
            name="equipment"
            value={formData.equipment}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            {filterOptions(equipments).map((equipmentOption) => (
              <option key={equipmentOption} value={equipmentOption}>
                {equipmentOption}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Difficulty</label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            {filterOptions(difficulties).map((difficultyOption) => (
              <option key={difficultyOption} value={difficultyOption}>
                {difficultyOption}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Instructions</label>
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="3"
            minLength="10"
            maxLength="500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Photo URL</label>
          <input
            type="text"
            name="photo"
            value={formData.photo}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Video URL</label>
          <input
            type="text"
            name="video"
            value={formData.video}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={loading}
          >
            {loading && (
              <span className="loading loading-spinner loading-md"></span>
            )}
            Save
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutModal;
