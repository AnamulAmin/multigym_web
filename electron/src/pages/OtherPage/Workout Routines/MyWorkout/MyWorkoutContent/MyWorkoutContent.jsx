import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useState } from "react";
import MyWorkoutPDF from "./MyWorkoutPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";

function MyWorkoutContent({ workoutRoutine }) {
  const [loader, setLoader] = useState(false);

  const downloadPDF = () => {
    const capture = document.querySelector("#diet-plan-content");
    setLoader(true);

    // Use html2canvas to capture the content of the div
    html2canvas(capture, {
      useCORS: true, // Handles cross-origin images
      allowTaint: true, // Allows drawing tainted canvases
      backgroundColor: "#fff", // Ensures background isn't transparent
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png"); // Get image data from canvas
        const pdf = new jsPDF("p", "mm", "a4"); // Create a new jsPDF document
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width; // Scale height proportionally

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight); // Add the image to the PDF
        setLoader(false); // Stop the loader
        pdf.save("diet-plan.pdf"); // Save the PDF with a specified filename
      })
      .catch((error) => {
        console.error("Error generating PDF", error); // Catch and log errors
        setLoader(false); // Ensure loader stops even if there's an error
      });
  };

  console.log(
    "diet",
    Object.keys(workoutRoutine).map((key) => {
      console.log("key", key);
      if (key === "_id" || key === "__v") {
        return "";
      } else {
        return key;
      }
    })
  );

  return (
    <>
      {/* The content to capture and generate into a PDF */}
      <div className="md:space-y-6 space-y-2 md:mt-5">
          {workoutRoutine && workoutRoutine.workouts ? (
            workoutRoutine.workouts.map((dayData, dayIndex) => (
              <div key={dayIndex} className="border shadow-sm rounded-xl p-4 md:p-6 bg-white">
                {/* Day Title */}
                <h2 className="text-lg font-bold text-center text-yellow-500 pb-3 md:mb-6">
                  {dayData.dayName}
                </h2>

                {/* Exercise Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                  {dayData.exercises.map((exercise, exerciseIndex) => (
                    <div
                      key={exerciseIndex}
                      className="border rounded-lg shadow-sm overflow-hidden bg-gray-50 transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-lg"
                    >
                      {/* Image */}
                      <img
                        src={`/images/${exercise.workout.picture}`}
                        alt={exercise.workout.name}
                        className="w-full h-48 object-cover transition-opacity duration-300 ease-in-out hover:opacity-90"
                      />

                      {/* Content */}
                      <div className="p-4 space-y-2">
                        <h3 className="text-md font-semibold text-gray-800">
                          {exercise.workout.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {exercise.workout.instructions}
                        </p>

                        {/* Sets and Reps */}
                        <div className="flex justify-between text-sm font-medium text-gray-500">
                          <span>Sets: {exercise.sets}</span>
                          <span>Reps: {exercise.reps.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center">
              <p className="text-xl font-semibold my-20">No routine Assigned</p>
            </div>
          )}
        </div>
    </>
  );
}

export default MyWorkoutContent;
