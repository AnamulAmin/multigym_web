import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import UseAxiosSecure from "../../../../Hook/UseAxioSecure";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import RequestDietPlanForm from "./RequestDietPlanForm/RequestDietPlanForm";
import MyDietPlanContent from "../MyDietPlan/MyDietPlanContent/MyDietPlanContent";
import { useAuth } from "../../../../providers/AuthProvider";


const RequestDietPlan = () => {
  const storedUser = localStorage.getItem("user");
  const [inputFields, setInputFields] = useState([]);
  const [radioFields, setRadioFields] = useState([]);
  const [isHasPreviousFoodHabit, setIsHasPreviousFoodHabit] = useState(false);
  const [isActiveFoodHabit, setIsActiveFoodHabit] = useState(false);
  const [diet, setDiet] = useState(null);
  const [isShowForm, setIsShowForm] = useState(false);
  const {branch} = useAuth();
  const [foodHabitUserAnswer, setFoodHabitUserAnswer] = useState({});
  const user = useMemo(() => {
    return storedUser === "undefined" || storedUser === null
      ? {}
      : JSON.parse(storedUser);
  }, [storedUser]);

  const axiosSecure = UseAxiosSecure();

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
          `/diet-plan/food-habit-question/get?branch=${branch}`
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
          `/diet-plan/get-food-habit/${user?.food_habit_id}`,
          schema
        );
        
        if (res2?.status === 200) {
          const data = res2?.data?.foodHabitUserAnswer;
          const foodHabit = res2?.data?.data;

          setFoodHabitUserAnswer(data);



          // Set values for all fields
          Object.keys(schema).forEach((fieldName) => {
            setValue(fieldName, data[fieldName] || "");

            console.log(data[fieldName], "data[fieldName]", fieldName, "fieldName");
          });

          setIsActiveFoodHabit(foodHabit?.isActive);

          if (Object.keys(data).length > 0) {
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
  }, [axiosSecure, user, setValue]);

  useEffect(() => {
    const fetchViewDietDetails = async () => {
      try {
        const questionResponse = await axiosSecure.get(
          `/diet-plan/food-habit-question/get`
        );
        const data = questionResponse?.data;

        const schema = {};
        for (let key in data) {
          schema[data[key].name] = "";
        }

        const response = await axiosSecure.post(
          `/diet-plan/get-food-habit/${user?.food_habit_id}?branch=${branch}`,
          data
        );

        
        const dietId = response?.data?.data?.set_diet_id;
        if (!dietId) {
          toast.error("No diet plan found");
          return;
        }
        const dietResponse = await axiosSecure.get(
          `/diet-plan/get-user-diet/${dietId}?branch=${branch}`
        );

        console.log("dietResponse", dietResponse);

        const copyDiet = { ...dietResponse.data };
        delete copyDiet?.health_metrics?._id;
        delete copyDiet?.health_metrics?.__v;
        delete copyDiet?.breakfast?._id;
        delete copyDiet?.breakfast?.__v;
        delete copyDiet?.lunch?._id;
        delete copyDiet?.lunch?.__v;
        delete copyDiet?.dinner?._id;
        delete copyDiet?.dinner?.__v;

        console.log(copyDiet, "copy Diet?")

        setDiet(copyDiet);
      } catch (error) {
        console.error("Error fetching diet details:", error);
      }
    };

    if (user?.food_habit_id) fetchViewDietDetails();
  }, [axiosSecure, user]);

  const onSubmit = async (data) => {
    data.userId = user?._id;
    data.isActive = false;
    data.branch = user?.branch || "shia";

    console.log(data, "data");

    try {
      const response = await axiosSecure.post(
        `/diet-plan/create-food-habit?branch=${branch}`,
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
        console.log("response diet plan", response);
      }
    } catch (error) {
      console.log(error);
      toast.error("Request failed!");
    }
  };


  return (
    <>
      {isHasPreviousFoodHabit && (
        <header className="bg-white shadow-md rounded-lg flex items-center justify-end p-4 ">
          <button
            onClick={() => setIsShowForm(!isShowForm)}
            className="text-white w-full h-12 grid place-items-center rounded-md bg-neutral   hover:bg-yellow-500 hover:text-black  text-xl font-semibold transition-all duration-200 ease-in-out"
          >
            {!isShowForm ? "Send Again Your Food Habit" : "Cancel"}
          </button>
        </header>
      )}
      {isShowForm && (
        <RequestDietPlanForm
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          inputFields={inputFields}
          radioFields={radioFields}
          register={register}
          errors={errors}
          watch={watch}
          setValue={setValue}
          foodHabitUserAnswer={foodHabitUserAnswer}
          setFoodHabitUserAnswer={setFoodHabitUserAnswer}
        />
      )}

      {isHasPreviousFoodHabit && diet && !isShowForm && !isActiveFoodHabit && (
        <MyDietPlanContent diet={diet} />
      )}

      {isHasPreviousFoodHabit && isActiveFoodHabit && (
        <h2 className="text-2xl font-semibold mt-8 text-center ">
          Your personalized diet plan is almost ready! We’re working hard to
          tailor a plan that fits your lifestyle and health goals. Very soon,
          you’ll have access to a detailed and easy-to-follow guide designed
          just for you. Stay tuned, and get ready to take the next step towards
          a healthier you!
        </h2>
      )}
    </>
  );
};

export default RequestDietPlan;
