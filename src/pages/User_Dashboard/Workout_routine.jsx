import  { useContext, useEffect, useState } from "react";
import Mtitle from "/src/components library/Mtitle";
import { AuthContext, useAuth } from "../../providers/AuthProvider";
import UseAxiosSecure from "../../Hook/UseAxioSecure";
import { PDFDownloadLink } from "@react-pdf/renderer";
import WorkoutPDF from "../../components/Pdf/WorkoutPDF ";
import { LuDownload } from "react-icons/lu";
import MyWorkoutForm from "../OtherPage/Workout Routines/MyWorkout/MyWorkoutForm/MyWorkoutForm";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Modal from "../../components/partial/Modal/Modal";


const Workout_routine = () => {
  const [workoutRoutine, setWorkoutRoutine] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [loading , setLoading] = useState(false);
  const [inputFields, setInputFields] = useState([]);
  const [radioFields, setRadioFields] = useState([]);
  const [isHasPreviousFoodHabit, setIsHasPreviousFoodHabit] = useState(false);
  const [isActiveFoodHabit, setIsActiveFoodHabit] = useState(false);
  const [isShowForm, setIsShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false); // Form submitted state
  const [formData, setFormData] = useState({
    mainGoal: "",
    sessionDuration: "",
    trainingFrequency: "",
    workoutGoal: "",
    gymExperience: "",
    workoutTime: "",
    cardioIncluded: "",
    cardioDuration: "",
    plankTime: "",
    bodyType: "",
    injuries: ""
  }); // Form state

  const { user } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();
  const [userId, setUserId] = useState(null);
  const {branch} = useAuth();


  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchPaymentMethodData = async () => {
      try {
        const response = await axiosSecure.get(
          `/workout-routines/workout-habit-question/get?branch=${branch}`
        );
        const data = response?.data;



        const schema = {};
        let input_fields = [];
        let radio_fields = [];
        for (let key in data) {
          if (
            data[key].field_type === "text" ||
            data[key].field_type === "number" ||
            data[key].field_type === "textarea" ||
            data[key].field_type === "date" ||
            data[key].field_type === "option" 
          ) {
            input_fields.push(data[key]);
          } else if (data[key].field_type === "radio") {
            radio_fields.push(data[key]);
          }
          schema[data[key].name] = "";
        }
        setInputFields(input_fields);
        setRadioFields(radio_fields);

        // Fetch user food habit data
        const res2 = await axiosSecure.post(
          `/workout-routines/get-workout-habit/${user?.workout_habit_id}?branch=${branch}`,
          schema
        );

        console.log("reslkjdflkajs  34232323", res2)
        
        if (res2?.status === 200) {
          const answerReport = res2?.data?.workoutUserAnswerModelReport;
          const foodHabit = res2?.data?.data;
          const workoutRoutine = foodHabit?.workout_routine_id;
          console.log("workoutRoutine", workoutRoutine);

          setWorkoutRoutine(workoutRoutine);

          console.log("foodHabit", foodHabit, answerReport, res2?.data?.workoutUserAnswerModelReport);

          // Set values for all fields
          Object.keys(schema).forEach((fieldName) => {
            setValue(fieldName, answerReport[fieldName] || "");
            console.log(answerReport[fieldName], "data[fieldName]")
          });

          setIsActiveFoodHabit(foodHabit?.isActive);

          console.log(foodHabit?.isActive)

          if (Object.keys(answerReport).length > 0) {
            setIsHasPreviousFoodHabit(true);
          } else {
            setIsHasPreviousFoodHabit(false);
            setIsShowForm(true);
          }
        } else {
          setIsShowForm(true);
          setIsHasPreviousFoodHabit(false);
        }
      } catch (error) {
        setIsShowForm(true);
        setIsHasPreviousFoodHabit(false);
        setIsHasPreviousFoodHabit(false);
        console.error("Error fetching payment method data:", error);
      }
    };

    fetchPaymentMethodData();
  }, [axiosSecure, user, setValue, isModalOpen]);

  // getting user id from email
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        // const response = await axiosSecure.get(`/users/user_by_email/www.tanzil.hossain@gmail.com`);  Test this by email
        const response = await axiosSecure.get(`/users/user_by_email/${user.email}?branch=${branch}`);
        setUserId(response.data._id);
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserId();
  }, [isModalOpen]);

  // // fetching workout routines by user ID
  // useEffect(() => {
  //   const fetchWorkoutRoutines = async () => {
  //     try {
  //       if (userId) {
  //         const response = await axiosSecure.get(`workout-routines/user/${userId}`); 
  //         // const response = await axiosSecure.get(`workout-routines/user/66f833a2c441d59cd0ce9b59`);
  //         setWorkoutRoutine(response.data[0]);
  //         console.log(response.data[0]);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching workout routines:', error);
  //     }
  //   };

  //   fetchWorkoutRoutines();
  // }, [userId, isModalOpen]);


  // Handlers for buttons
  const handleDownloadPdf = () => {
    <PDFDownloadLink
      document={<WorkoutPDF routine={workoutRoutine} />}
      fileName="workout-routine.pdf"
    >
      {({ blob, url, loading, error }) =>
        loading ? 'Loading document...' : 'Download PDF'
      }
    </PDFDownloadLink>
  };

  const handleRequestWorkout = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const onSubmit = async (data) => {
    setLoading(true);
    data.userId = user?._id;
    data.isActive = false;
    data.branch = user?.branch || "shia";

    try {
      const response = await axiosSecure.post(
        `/workout-routines/create-workout-habit`,
        data
      );
      if (response?.status === 200 || response.status === 201) {
        toast.success("Diet plan sent successfully!");
        // setUser(response?.data.user);

        Swal.fire({
          title: "Success!",
          text: "Your information has been submitted successfully. Please wait for the diet plan to be sent",
          icon: "success",
          confirmButtonText: "Ok",
        });

        localStorage.setItem("user", JSON.stringify(response?.data?.user));
        setIsShowForm(false);
        setIsModalOpen(false);
        setLoading(false);
        // console.log("response diet plan", response);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Request failed!");
    } finally {
      setLoading(false);
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Add your submission logic here
  //   alert("Workout request submitted!");
  //   setSubmitted(true); // Mark form as submitted
  // };
  return (
    <div className="p-4">
      <Mtitle
        title="Workout Routine"
        rightcontent={
          <div className="flex flex-row-reverse gap-4 mt-4">
            {(workoutRoutine && workoutRoutine.workouts) &&
              <>
                <PDFDownloadLink
                  document={<WorkoutPDF workoutRoutine={workoutRoutine} />}
                  fileName="Workout routine.pdf"
                >
                  {({ blob, url, loading, error }) =>
                    loading ? (<p className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                      Download Routine PDF
                    </p>) : (
                      <button className="bg-blue-500 flex flex-row btn text-white px-4 md:text-sm text-sm py-0 md:px-4 md:py-2 rounded-xl font-semibold hover:bg-blue-600 transition-colors">
                        Download <LuDownload className="md:text-lg text-base md:ml-1" />
                      </button>
                    )
                  }
                </PDFDownloadLink>
              </>}
            <button
              onClick={handleRequestWorkout}
              className="bg-green-500 text-white btn rounded-xl  md:px-4 md:py-2 font-semibold hover:bg-green-600 transition-colors">
              Request Workout
            </button>
          </div>

        }
      />


      <div className="">
        {/* <table className="table w-full">
          <thead className="bg-yellow-500">
            <tr className="text-sm font-medium text-white text-left">
              <td className="p-3 rounded-l-xl">Exercise</td>
              <td className="p-3">Picture</td>
              <td className="p-3">Instructions</td>
              <td className="p-3">Sets</td>
              <td className="p-3 rounded-r-xl">Reps</td>
            </tr>
          </thead>
          <tbody>
            {workoutRoutine && workoutRoutine.workouts ?
              <>
                {workoutRoutine.workouts.map((dayData, index) => (
                  <React.Fragment key={index}>
                    <tr className="bg-gray-100">
                      <td colSpan="5" className="font-bold p-3 text-center">
                        {dayData.dayName}
                      </td>
                    </tr>
                    {dayData.exercises.map((exercise, idx) => (
                      <tr key={idx} className="hover:bg-slate-100 hover:rounded-xl transition-all duration-200">
                        <td className="px-4 py-3">{exercise.workout.name}</td>
                        <td className="px-4 py-3">
                          <img
                            src={`/images/${exercise.workout.picture}`}
                            alt={exercise.workout.name}
                            style={{ width: "100px" }}
                          />
                        </td>
                        <td className="px-4 py-3">{exercise.workout.instructions}</td>
                        <td className="px-4 py-3">{exercise.sets}</td>
                        <td className="px-4 py-3">{exercise.reps.join(', ')}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </>
              :
              <>
                <div className="flex justify-center">
                  <p className="text-xl font-semibold my-20">No routine Assigned</p>
                </div>
              </>}
          </tbody>
        </table> */}

        <div className="md:space-y-6 space-y-2 md:mt-5 bg-white p-3 shadow-lg rounded-md">
        <h3 className="text-xl font-bold border-b py-3">{workoutRoutine?.routineName}</h3>
          {workoutRoutine && workoutRoutine.workouts ? (
            workoutRoutine.workouts.map((dayData, dayIndex) => (
              <div key={dayIndex} className="border shadow-sm rounded-xl p-4 md:p-6 ">
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
                        src={exercise.workout.photo}
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

      </div>

      {isModalOpen && (
        // <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        //   <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        //     <h2 className="text-lg font-bold mb-4">Request Workout</h2>

        //     <div className="container mx-auto p-5">
        //       {!submitted ? (
        //         <form onSubmit={handleSubmit} className="space-y-4">
        //           {/* Main Goal */}
        //           <div>
        //             <h3 className="text-xl font-semibold mb-2">1. What is your main goal for training?</h3>
        //             <select name="mainGoal" value={formData.mainGoal} onChange={handleChange} className="select select-bordered w-full max-w-xs">
        //               <option value="">Select...</option>
        //               <option value="Lose weight">Lose weight</option>
        //               <option value="Gain muscle & body strength">Gain muscle & body strength</option>
        //               <option value="Get lean & defined">Get lean & defined</option>
        //               <option value="Improve endurance">Improve endurance</option>
        //               <option value="Feel healthier">Feel healthier</option>
        //               <option value="Increase flexibility">Increase flexibility</option>
        //             </select>
        //           </div>

        //           {/* Session Duration */}
        //           <div>
        //             <h3 className="text-xl font-semibold mb-2">2. How long do you want to train in each session?</h3>
        //             <select name="sessionDuration" value={formData.sessionDuration} onChange={handleChange} className="select select-bordered w-full max-w-xs">
        //               <option value="">Select...</option>
        //               <option value="Short (up to 30 minutes)">Short (up to 30 minutes)</option>
        //               <option value="Medium (30-60 minutes)">Medium (30-60 minutes)</option>
        //               <option value="Long (60+ minutes)">Long (60+ minutes)</option>
        //               <option value="Long Long (120 minutes)">Long Long (120 minutes)</option>
        //             </select>
        //           </div>

        //           {/* Training Frequency */}
        //           <div>
        //             <h3 className="text-xl font-semibold mb-2">3. How often do you want to train per week?</h3>
        //             <select name="trainingFrequency" value={formData.trainingFrequency} onChange={handleChange} className="select select-bordered w-full max-w-xs">
        //               <option value="">Select...</option>
        //               <option value="1 day">1 day</option>
        //               <option value="2 days">2 days</option>
        //               <option value="3 days">3 days</option>
        //               <option value="4 days">4 days</option>
        //               <option value="5 days">5 days</option>
        //             </select>
        //           </div>

        //           {/* Workout Goal */}
        //           <div>
        //             <h3 className="text-xl font-semibold mb-2">4. What is your primary workout goal?</h3>
        //             <select name="workoutGoal" value={formData.workoutGoal} onChange={handleChange} className="select select-bordered w-full max-w-xs">
        //               <option value="">Select...</option>
        //               <option value="Maximum strength (4-10 reps)">Maximum strength (4-10 reps)</option>
        //               <option value="Muscle gain (6-15 reps)">Muscle gain (6-15 reps)</option>
        //               <option value="Strength endurance (12-20 reps)">Strength endurance (12-20 reps)</option>
        //             </select>
        //           </div>

        //           {/* Additional form fields as per your provided form... */}

        //           <div className="pt-4">
        //             <button type="submit" className="btn btn-primary w-full max-w-xs">Request Workout</button>
        //           </div>
        //         </form>
        //       ) : (
        //         <div className="text-center">
        //           <FaCheckCircle className="text-5xl text-green-500 mx-auto" />
        //           <h3 className="text-2xl font-semibold mt-4">You have already submitted the request, please wait!</h3>
        //         </div>
        //       )}
        //     </div>

        //     <div className="flex justify-end mt-4">
        //       <button
        //         onClick={handleCloseModal}
        //         className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors">
        //         Close
        //       </button>
        //     </div>
        //   </div>
        // </div>

        <Modal isShowModal={isModalOpen} setIsShowModal={setIsModalOpen} >
          
          <MyWorkoutForm
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            loading={loading}
            inputFields={inputFields}
            radioFields={radioFields}
            register={register}
            errors={errors}
            watch={watch}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            setValue={setValue}
          />
        </Modal>

      )}
    </div>
  );
};




export default Workout_routine;
