import React from "react";

const UserOverview = () => {
  // Simple demo data for user overview
  const users = [
    {
      name: "Muntasir Rafid ",
      workoutRoutine: "Strength training",
      dietPlan: "High-protein diet",
      progress: 75, // Progress percentage
    },
    {
      name: "Alok Kapalie",
      workoutRoutine: "CrossFit",
      dietPlan: "Balanced diet",
      progress: 45,
    },
    {
      name: "Nahid Islam",
      workoutRoutine: "Yoga",
      dietPlan: "Vegetarian diet",
      progress: 90,
    },
    {
      name: "Ayub Hossain",
      workoutRoutine: "Pilates",
      dietPlan: "Low-carb diet",
      progress: 30,
    },
    {
      name: "Imiaz Hossain",
      workoutRoutine: "HIIT",
      dietPlan: "Keto diet",
      progress: 60,
    },
  ];

  // Function to determine color based on progress
  const getColor = (progress) => {
    if (progress >= 80) {
      return "text-green-500"; // High progress
    } else if (progress >= 50) {
      return "text-yellow-500"; // Medium progress
    } else {
      return "text-red-500"; // Low progress
    }
  };

  return (
    <section
      className="w-full px-4 border-t max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
      style={{ scrollbarWidth: "thin" }}
    >
      {users.map((user, index) => (
        <div
          key={index}
          className={`py-3 flex justify-between items-center ${
            index !== users.length - 1 ? "border-b" : ""
          }`}
        >
          <div className="text-sm">
            <p className="font-medium">{user.name}</p>
            <p className="text-gray-500">Workout: {user.workoutRoutine}</p>
            <p className="text-gray-500">Diet: {user.dietPlan}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">Progress</p>
            <p className={`font-semibold ${getColor(user.progress)}`}>
              {user.progress}%
            </p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default UserOverview;
