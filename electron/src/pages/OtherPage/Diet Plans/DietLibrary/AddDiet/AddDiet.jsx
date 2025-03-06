import { useEffect, useState } from "react";
import UseAxiosSecure from "../../../../../Hook/UseAxioSecure";
import toast from "react-hot-toast";
import { useAuth } from "../../../../../providers/AuthProvider";
import { z } from "zod";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AddDietInput from "./AddDietInput/AddDietInput";
import AddDietTextArea from "./AddDietInput/AddDietTextArea";

const zodSchema = z.object({
  diet_name: z.string().refine((val) => val.trim() !== "", {
    message: "Diet Name must be provided or left empty",
  }),
  weight: z
    .string()
    .nonempty({ message: "Weight must be provided or Enter none" }),
  height: z.string().refine((val) => val.trim() !== "", {
    message: "Height must be provided or Enter none",
  }),
  ideal_weight: z.string().refine((val) => val.trim() !== "", {
    message: "Ideal Weight must be provided or Enter none",
  }),
  extra_weight: z.string().refine((val) => val.trim() !== "", {
    message: "Extra Weight must be provided or Enter none",
  }),
  bp: z.string().refine((val) => val.trim() !== "", {
    message: "Blood Pressure (B.P.) must be provided or Enter none",
  }),
  age: z.string().refine((val) => val.trim() !== "", {
    message: "Age  must be provided or Enter none",
  }),
  calorie: z.string().refine((val) => val.trim() !== "", {
    message: "Calorie count must be provided or Enter none",
  }),
  water: z.string().refine((val) => val.trim() !== "", {
    message: "Water intake must be provided or Enter none",
  }),
  sugar: z.string().refine((val) => val.trim() !== "", {
    message: "Sugar intake must be provided or Enter none",
  }),
  oil: z.string().refine((val) => val.trim() !== "", {
    message: "Oil intake must be provided or Enter none",
  }),
  food_to_avoid: z.string().refine((val) => val.trim() !== "", {
    message: "food to avoid intake must be provided or Enter none",
  }),
  points_to_note: z.string().refine((val) => val.trim() !== "", {
    message: "points to note intake must be provided or Enter none",
  }),
  fruits: z.string().refine((val) => val.trim() !== "", {
    message: "fruits to avoid intake must be provided or Enter none",
  }),
  weekly: z.string().refine((val) => val.trim() !== "", {
    message: "weekly intake must be provided or Enter none",
  }),
  vegetables: z.string().refine((val) => val.trim() !== "", {
    message: "vegetables to avoid intake must be provided or Enter none",
  }),
  suggestion: z.string().refine((val) => val.trim() !== "", {
    message: "Suggestion must be provided or Enter none",
  }),
  morning_roti: z.string().refine((val) => val.trim() !== "", {
    message: "Roti must be provided or left empty",
  }),
  morning_egg: z.string().refine((val) => val.trim() !== "", {
    message: "Egg must be provided or left empty",
  }),
  morning_vegetable: z.string().refine((val) => val.trim() !== "", {
    message: "Vegetable must be provided or left empty",
  }),
  morning_fruit: z.string().refine((val) => val.trim() !== "", {
    message: "Fruit must be provided or left empty",
  }),
  morning_extra: z.string().refine((val) => val.trim() !== "", {
    message: "Extra must be provided or left empty",
  }),
  mid_morning_lunch_rice: z.string().refine((val) => val.trim() !== "", {
    message: "Lunch (Rice) must be provided or left empty",
  }),
  mid_morning_fish_meat: z.string().refine((val) => val.trim() !== "", {
    message: "Fish/Meat must be provided or left empty",
  }),
  mid_morning_pulse: z.string().refine((val) => val.trim() !== "", {
    message: "Pulse must be provided or left empty",
  }),
  mid_morning_shack: z.string().refine((val) => val.trim() !== "", {
    message: "Shack must be provided or left empty",
  }),
  mid_morning_vegetable: z.string().refine((val) => val.trim() !== "", {
    message: "Vegetable must be provided or left empty",
  }),
  mid_morning_salad: z.string().refine((val) => val.trim() !== "", {
    message: "Salad must be provided or left empty",
  }),
  mid_morning_extra: z.string().refine((val) => val.trim() !== "", {
    message: "Extra must be provided or left empty",
  }),

  evening_rice: z.string().refine((val) => val.trim() !== "", {
    message: "Dinner Rice must be provided or left empty",
  }),
  evening_roti: z.string().refine((val) => val.trim() !== "", {
    message: "Dinner Roti must be provided or left empty",
  }),
  evening_fish_meat: z.string().refine((val) => val.trim() !== "", {
    message: "Fish/Meat must be provided or left empty",
  }),
  evening_pulse: z.string().refine((val) => val.trim() !== "", {
    message: "Pulse must be provided or left empty",
  }),
  evening_shack: z.string().refine((val) => val.trim() !== "", {
    message: "Shack must be provided or left empty",
  }),
  evening_vegetable: z.string().refine((val) => val.trim() !== "", {
    message: "Vegetable must be provided or left empty",
  }),
  evening_salad: z.string().refine((val) => val.trim() !== "", {
    message: "Salad must be provided or left empty",
  }),
  evening_extra: z.string().refine((val) => val.trim() !== "", {
    message: "Extra must be provided or left empty",
  }),
  sleep: z.string().refine((val) => val.trim() !== "", {
    message: "sleep must be provided or left empty",
  }),
});

function AddDiet({
  isShowModal,
  setIsShowModal,
  diet_id,
  formIndex,
  setFormIndex,
}) {
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(user?.full_name || "");
  const { branch } = useAuth();
  const [height, setHeight] = useState("");
  const [heightUnit, setHeightUnit] = useState("in");
  const [weight, setWeight] = useState(0);
  const [weightUnit, setWeightUnit] = useState("kg");
  const [age, setAge] = useState("");
  const [bp, setBP] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [gender, setGender] = useState("male");
  const [loading, setLoading] = useState(false);

  const axiosSecure = UseAxiosSecure();
  const formTypes = [
    "diet-name",
    "General Suggestion",
    "Morning",
    "Mid-Morning",
    "Evening Snacks",
    "Before Sleep",
  ];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(zodSchema),
  });

  console.log(errors, "errors");

  const onSubmit = async (data) => {
    console.log("data", data);
    setLoading(true);

    let sleepData = {};
    let dinnerData = {};
    let lunchData = {};
    let breakfastData = {};
    let healthMetricsData = {};
    let dietName = {};

    Object.keys(data).forEach((key) => {
      if (key === "sleep") {
        sleepData = data.sleep;
      } else if (key.includes("morning_") && !key.includes("mid_morning_")) {
        const replace_key = key.replace("morning_", "");
        breakfastData[replace_key] = data[key];
      } else if (key.includes("mid_morning_")) {
        const replace_key = key.replace("mid_morning_", "");
        lunchData[replace_key] = data[key];
      } else if (key.includes("evening_")) {
        const replace_key = key.replace("evening_", "");

        dinnerData[replace_key] = data[key];
      } else if (key === "diet_name") {
        dietName = data[key];
      } else {
        healthMetricsData[key] = data[key];
      }
    });

    const submitData = {
      sleepData,
      dinnerData,
      lunchData,
      breakfastData,
      healthMetricsData,
      branch: branch,
      dietName,
      doctor: doctor,
    };

    console.log(submitData, "submitData");

    try {
      let response;
      if (diet_id) {
        response = await axiosSecure.put(
          `/diet-plan/put/${diet_id}`,
          submitData
        );
      } else {
        response = await axiosSecure.post(`/diet-plan/post`, submitData);
      }
      console.log("response", response);
      if (response?.status === 200 || response.status === 201) {
        toast.success("Diet plan Created successfully!");
        setIsShowModal(false);
        console.log("data", data);
        setFormIndex(0);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Request failed!");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("diet_id", diet_id);
    if (diet_id && isShowModal) {
      const fetchUserData = async () => {
        try {
          const response = await axiosSecure.get(
            `/diet-plan/get-id/${diet_id}?branch=${branch}`
          );

          if (response?.status === 200) {
            const data = response.data;

            const doctor = data?.doctor;
            setDoctor(doctor);
            setValue("diet_name", data.dietName);
            const dinner = data?.dinner;
            const breakfast = data?.breakfast;
            const lunch = data?.lunch;
            const sleep = data?.sleep;
            const health_metrics = data?.health_metrics;

            if (dinner) {
              Object.keys(dinner).forEach((key) => {
                setValue("evening_" + key, dinner[key]);
              });
            }
            if (breakfast) {
              Object.keys(breakfast).forEach((key) => {
                setValue("morning_" + key, breakfast[key]);
              });
            }
            if (lunch) {
              Object.keys(lunch).forEach((key) => {
                setValue("mid_morning_" + key, lunch[key]);
              });
            }
            if (health_metrics) {
              Object.keys(health_metrics).forEach((key) => {
                setValue(key, health_metrics[key]);
              });
            }
            if (sleep) {
              Object.keys(sleep).forEach((key) => {
                setValue(key, sleep[key]);
              });
            }
          }
        } catch (error) {
          console.log(error);
          toast.error("Failed to load user data");
        }
      };
      fetchUserData();
    } else {
      reset();
      setDoctor("");
      setPageNumber(1);
    }
  }, [diet_id, axiosSecure, isShowModal, branch]);

  // useEffect(() => {
  //   console.log(height, weight, "height, weight");
  //   function calculateIdealWeight() {
  //     // const height = parseFloat(getValues('height'));
  //     // const weight = parseFloat(getValues('weight'));

  //     if (height && weight) {
  //       const heightInInches = parseFloat(height);
  //   const ageFactor = age >= 51 ? 2 : age >= 31 ? 1 : 0;

  //   // Ideal Weight Calculation
  //   const calculatedIdealWeight = 50 + 2.3 * (heightInInches - 60) - ageFactor;

  //   // Extra Weight Calculation
  //   const calculatedExtraWeight = parseFloat(weight) - calculatedIdealWeight;

  //   // Calorie requirement with age factor
  //   const calculatedCalorie = parseFloat(weight) * (15 - ageFactor);

  //   // Water intake calculation
  //   const calculatedWater = parseFloat(weight) * 0.5 / 33.814;

  //   // BP Status Check with age-adjusted ranges
  //   const [systolic, diastolic] = bp.split('/').map(num => parseInt(num, 10));
  //   let calculatedBPStatus = '';
  //   if (systolic && diastolic) {
  //     if (age <= 39 && (systolic > 120 || diastolic > 80)) {
  //       calculatedBPStatus = 'High';
  //     } else if (age >= 40 && age <= 59 && (systolic > 130 || diastolic > 85)) {
  //       calculatedBPStatus = 'High';
  //     } else if (age >= 60 && (systolic > 140 || diastolic > 90)) {
  //       calculatedBPStatus = 'High';
  //     } else {
  //       calculatedBPStatus = 'Normal';
  //     }
  //   }

  //   // Update state with calculated values
  //   setValue('ideal_weight', calculatedIdealWeight.toFixed(2));
  //   setValue('extra_weight', calculatedExtraWeight > 0 ? calculatedExtraWeight.toFixed(2) : '0');
  //   setValue('calorie', calculatedCalorie.toFixed(2));
  //   setValue('water', calculatedWater.toFixed(2));
  //   setValue('bp_status', calculatedBPStatus);
  //     }
  //   }

  //   calculateIdealWeight();

  // }, [isShowModal, user, getValues, setValue, height, weight, age, bp]);

  useEffect(() => {
    console.log(height, weight, "height, weight");
    // function calculateIdealWeight({
    //   height,
    //   heightUnit = "cm",
    //   gender,
    //   weight = null,
    //   weightUnit = "kg",
    //   age = null,
    //   bp = null,
    // }) {
    //   // Convert height to centimeters if input is in inches
    //   const heightInCm = height;
    //   // const heightInCm = heightUnit === "in" ? height * 2.54 : height;

    //   // Convert weight to kilograms if input is in pounds
    //   const weightInKg = weight;
    //   // const weightInKg = weightUnit === "lbs" ? weight * 0.453592 : weight;

    //   // Base height and weight for calculations
    //   const baseHeightCm = 152.4; // 5 feet or 60 inches
    //   const baseHeightIn = baseHeightCm / 2.54; // Base height in inches
    //   const baseWeightMale = 50; // in kg
    //   const baseWeightFemale = 45.5; // in kg
    //   const additionalWeightPerCm = 0.9; // in kg
    //   const additionalWeightPerIn = additionalWeightPerCm / 2.54; // Additional weight per inch

    //   // Calculate ideal weight

    //   console.log(gender, "gender");
    //   let idealWeight;
    //   if (gender === "male") {
    //     idealWeight = 50 + (2.3 * height - 60);
    //   } else if (gender === "female") {
    //     idealWeight = 45.5 + (2.3 * height - 60);
    //   }

    //   // Handle extra weight if weight is provided
    //   const extraWeight = weightInKg !== null ? weightInKg - idealWeight : null;

    //   // Convert ideal weight to pounds
    //   const idealWeightInLbs = idealWeight * 2.20462;
    //   const extraWeightInLbs =
    //     extraWeight !== null ? extraWeight * 2.20462 : null;

    //   return {
    //     baseHeight: `${baseHeightCm} cm (${baseHeightIn.toFixed(2)} in)`,
    //     baseWeightMale: `${baseWeightMale} kg (${(
    //       baseWeightMale * 2.20462
    //     ).toFixed(2)} lbs)`,
    //     baseWeightFemale: `${baseWeightFemale} kg (${(
    //       baseWeightFemale * 2.20462
    //     ).toFixed(2)} lbs)`,
    //     additionalWeightPerCm: `${additionalWeightPerCm} kg per cm (${additionalWeightPerIn.toFixed(
    //       2
    //     )} lbs per in)`,
    //     // idealWeight: `${idealWeight.toFixed(2)} kg (${idealWeightInLbs.toFixed(
    //     //   2
    //     // )} lbs)`,
    //     // extraWeight: extraWeight
    //     //   ? `${extraWeight.toFixed(2)} kg (${extraWeightInLbs.toFixed(2)} lbs)`
    //     //   : "N/A",

    //     idealWeight,
    //     idealWeightInLbs,
    //     extraWeight,
    //     extraWeightInLbs,
    //   };
    // }

    function calculateExtraWeight(
      height,
      weight,
      gender,
      unitHeight = "cm",
      unitWeight = "kg"
    ) {
      // Convert height to cm if in inches
      const heightInCm = unitHeight === "in" ? height * 2.54 : height;

      // Convert weight to kg if in lbs
      const weightInKg = unitWeight === "lbs" ? weight * 0.453592 : weight;

      // Base weight and height
      const baseHeightCm = 152.4; // 5 feet or 60 inches
      const baseHeightIn = baseHeightCm / 2.54; // Base height in inches
      const baseWeightMale = 50; // in kg
      const baseWeightFemale = 45.5; // in kg
      const additionalWeightPerCm = 0.9; // in kg

      // Default base weight for custom genders
      const defaultBaseWeight = (baseWeightMale + baseWeightFemale) / 2; // Average base weight

      // Calculate ideal weight
      let idealWeight;
      if (gender === "male") {
        idealWeight =
          baseWeightMale + (heightInCm - baseHeightCm) * additionalWeightPerCm;
      } else if (gender === "female") {
        idealWeight =
          baseWeightFemale +
          (heightInCm - baseHeightCm) * additionalWeightPerCm;
      } else {
        // Default calculation for other genders
        idealWeight =
          defaultBaseWeight +
          (heightInCm - baseHeightCm) * additionalWeightPerCm;
      }

      // Calculate extra weight
      const extraWeight = weightInKg - idealWeight;

      console.log("extraWeight", extraWeight);
      console.log("idealWeight", idealWeight);

      return {
        idealWeight: idealWeight, // in kg, rounded to 2 decimal places
        extraWeight: extraWeight, // in kg, rounded to 2 decimal places
      };
    }

    function calculateIdealWeight(heightInFeet, gender) {
      // Parse height input (e.g., "5'10")
      let feet = 0;
      let inches = 0;

      if (heightInFeet.includes("'")) {
        feet = parseInt(heightInFeet.split("'")[0], 10); // Convert feet to number
        inches = parseInt(heightInFeet.split("'")[1] || "0", 10); // Convert inches to number, default to 0
      } else {
        feet = heightInFeet; // Convert feet to number
        // inches = parseInt(heightInFeet.split("'")[1] || "0", 10); // Convert inches to number, default to 0
      }

      // Convert height to inches
      const heightInInches = feet * 12 + inches;

      // Base weight by gender
      let baseWeight = gender === "male" ? 50 : 45.5;

      // Additional weight for height above 60 inches
      let additionalWeight = 2.3 * (heightInInches - 60);

      return baseWeight + additionalWeight;
    }

    // const { idealWeight, extraWeight, idealWeightInLbs, extraWeightInLbs } =
    //   calculateIdealWeight({ height, weight, gender, heightUnit, weightUnit });

    if (height) {
      const idealWeight = calculateIdealWeight(height, gender);

      setValue("ideal_weight", idealWeight.toFixed(2));
      // setValue(
      //   "ideal_weight",
      //   weightUnit === "lbs" ? idealWeightInLbs : idealWeight
      // );
      const extraWeight = weight - idealWeight;
      setValue("extra_weight", extraWeight.toFixed(2));
    }

    // setValue(
    //   "extra_weight",
    //   weightUnit === "lbs" ? extraWeightInLbs : extraWeight
    // );
    // setValue("extra_weight", extraWeight.toFixed(2));

    function calculateWaterIntake(weight, unit = "kg", exerciseMinutes = 0) {
      // Convert weight to kilograms if it's in lbs
      let weightInKg = unit === "lbs" ? weight * 0.453592 : weight;

      // Calculate baseline water intake
      const baselineWaterIntake = weightInKg * 0.033;

      // Calculate additional water intake for exercise
      const additionalWaterIntake = (exerciseMinutes / 30) * 0.35;

      // Total water intake
      const totalWaterIntake = baselineWaterIntake + additionalWaterIntake;

      return {
        weight: weightInKg,
        baselineWaterIntake: baselineWaterIntake,
        additionalWaterIntake: additionalWaterIntake,
        totalWaterIntake: totalWaterIntake,
      };
    }

    const totalWaterIntake = calculateWaterIntake(
      weight,
      "kg",
      60
    ).totalWaterIntake;

    setValue("water", totalWaterIntake);

    function calculateCalorieCount({ weight, height, age, gender }) {
      let feet = 0;
      let inches = 0;

      // Check if the height is in the "feet'inches" format
      if (typeof height === "string" && height.includes("'")) {
        feet = parseInt(height.split("'")[0], 10); // Extract feet
        inches = parseInt(height.split("'")[1] || "0", 10); // Extract inches, default to 0 if empty
      } else {
        feet = parseFloat(height); // If height is a number or decimal, directly assign to feet
      }

      // Convert height to centimeters
      const heightInCm = feet * 30.48 + inches * 2.54;

      // Calculate BMR using Mifflin-St Jeor formula
      let bmr;
      if (gender === "male") {
        bmr = 10 * weight + 6.25 * heightInCm - 5 * age + 5;
      } else {
        bmr = 10 * weight + 6.25 * heightInCm - 5 * age - 161;
      }

      // Return the calculated BMR
      return {
        bmr: bmr, // Return BMR rounded to two decimal places
        heightInCm: heightInCm, // Optional: Return the height in cm for debugging or display
      };
    }

    const calorieRequirement = calculateCalorieCount({
      weight,
      height,
      age,
      gender,
    }).bmr;

    console.log("calorieRequirement", calorieRequirement);

    setValue("calorie", calorieRequirement.toFixed(2));
  }, [
    isShowModal,
    user,
    getValues,
    setValue,
    height,
    weight,
    age,
    bp,
    gender,
    heightUnit,
    weightUnit,
  ]);
  return (
    <div className=" p-6 bg-white shadow-lg w-[80%] rounded-lg transition-all duration-300">
      <div className="text-center mb-12">
        <h1 className="text-2xl mt-3 font-semibold mb-1">Diet Plan</h1>
        <p className="text-gray-500 text-sm mt-2">
          Personalized diet plan for optimal health
        </p>
      </div>

      <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
        {pageNumber === 1 && (
          <div>
            <div className="mb-4 relative">
              <label className="block text-gray-700 font-semibold py-2  w-52 text-lg">
                Diet Name:
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-200 focus:outline-none focus:border-gray-300"
                {...register("diet_name", { required: true })}
              ></input>
              <p className="absolute bottom-0 right-4 text-red-500">
                {errors?.diet_name?.message && (
                  <span className="text-red-500">
                    {errors?.diet_name?.message}
                  </span>
                )}
              </p>
            </div>

            <h3 className="font-semibold text-gray-600 py-4 pl-8 text-2xl bg-gray-300 flex items-center justify-between">
              Suggestion :
              <select
                className="select select-bordered w-full max-w-xs transition duration-150 ease-in-out hover:border-gray-400 focus:outline-none focus:border-blue-500 "
                onChange={(e) => setGender(e.target.value)}
                value={gender}
              >
                <option value={"male"}>Male</option>
                <option value={"female"}>Female</option>
              </select>
            </h3>

            <AddDietInput
              title="Weight"
              register={register}
              error={errors}
              name={"weight"}
              isRequired={true}
              label={"Weight"}
              type="number"
              onChange={{ onChange: (e) => setWeight(Number(e.target.value)) }}
              unit={weightUnit}
              unitChange={setWeightUnit}
              isUnit={true}
              options={["kg", "lbs"]}
            />

            <AddDietInput
              title="Height"
              register={register}
              error={errors}
              name={"height"}
              isRequired={true}
              type="text"
              label={"Height"}
              onChange={{ onChange: (e) => setHeight(e.target.value) }}
              unit={"feet"}
              // unitChange={setHeightUnit}
              // isUnit={true}
              // options={["cm", "in"]}
            />
            <AddDietInput
              title="B.P."
              register={register}
              error={errors}
              name={"bp"}
              isRequired={true}
              label={"Blood Pressure (B.P.)"}
              type="number"
              unit="mmHg"
              onChange={{ onChange: (e) => setBP(Number(e.target.value)) }}
              placeholder="e.g., 120/80"
            />
            <AddDietInput
              title="Age"
              register={register}
              error={errors}
              name={"age"}
              isRequired={true}
              label={"Age"}
              type="number"
              onChange={{ onChange: (e) => setAge(parseInt(e.target.value)) }}
              unit="years"
            />
            <AddDietInput
              title="Ideal Weight"
              register={register}
              error={errors}
              name={"ideal_weight"}
              isRequired={true}
              label={"Ideal Weight"}
              type="number"
              unit={"kg"}
            />
            <AddDietInput
              title="Extra Weight"
              register={register}
              error={errors}
              name={"extra_weight"}
              isRequired={true}
              label={"Extra Weight"}
              type="number"
              unit={"kg"}
            />
            <AddDietInput
              title="Calorie"
              register={register}
              error={errors}
              name={"calorie"}
              isRequired={true}
              label={"Calorie count"}
              type="number"
              unit="kcal"
            />
            <AddDietInput
              title="Water"
              register={register}
              error={errors}
              name={"water"}
              isRequired={true}
              label={"Water intake in liters"}
              type="number"
              unit="hours"
            />
            <AddDietInput
              title="Sugar"
              register={register}
              error={errors}
              name={"sugar"}
              isRequired={true}
              label={"Sugar intake"}
            />
            <AddDietInput
              title="Oil"
              register={register}
              error={errors}
              name={"oil"}
              isRequired={true}
              label={"Oil intake"}
            />

            <h3 className="  font-semibold text-gray-600 py-4 pl-8 text-2xl bg-gray-300">
              {" "}
              Morning :
            </h3>

            <AddDietInput
              title={"Roti"}
              register={register}
              error={errors}
              name={"morning_roti"}
              isRequired={true}
              label={"Roti"}
            />
            <AddDietInput
              title={"Egg"}
              register={register}
              error={errors}
              name={"morning_egg"}
              isRequired={true}
              label={"Egg"}
            />
            <AddDietInput
              title={"Vegetable"}
              register={register}
              error={errors}
              name={"morning_vegetable"}
              isRequired={true}
              label={"Vegetable"}
            />
            <AddDietInput
              title={"Fruit"}
              register={register}
              error={errors}
              name={"morning_fruit"}
              isRequired={true}
              label={"Fruit"}
            />
            <AddDietTextArea
              register={register}
              error={errors}
              name={"morning_extra"}
              isRequired={true}
              label={"Extra"}
            />

            <h3 className=" font-semibold text-gray-600 py-4 pl-8 text-2xl bg-gray-300">
              Mid-Morning :{" "}
            </h3>

            <AddDietInput
              title={"Lunch (Rice)"}
              register={register}
              error={errors}
              name={"mid_morning_lunch_rice"}
              isRequired={true}
              label={"Lunch (Rice)"}
            />
            <AddDietInput
              title={"Fish/Meat"}
              register={register}
              error={errors}
              name={"mid_morning_fish_meat"}
              isRequired={true}
              label={"Fish/Meat"}
            />
            <AddDietInput
              title={"Pulse"}
              register={register}
              error={errors}
              name={"mid_morning_pulse"}
              isRequired={true}
              label={"Pulse"}
            />
            <AddDietInput
              title={"Shack"}
              register={register}
              error={errors}
              name={"mid_morning_shack"}
              isRequired={true}
              label={"Shack"}
            />
            <AddDietInput
              title={"Vegetable"}
              register={register}
              error={errors}
              name={"mid_morning_vegetable"}
              isRequired={true}
              label={"Vegetable"}
            />
            <AddDietInput
              title={"Salad"}
              register={register}
              error={errors}
              name={"mid_morning_salad"}
              isRequired={true}
              label={"Salad"}
            />

            <AddDietTextArea
              register={register}
              error={errors}
              name={"mid_morning_extra"}
              isRequired={true}
              label={"Extra"}
            />

            <h3 className=" font-semibold text-gray-600 py-4 pl-8 text-2xl bg-gray-300">
              Evening Snacks :{" "}
            </h3>

            <AddDietInput
              title={"Rice"}
              register={register}
              error={errors}
              name={"evening_rice"}
              isRequired={true}
              label={"Rice"}
            />
            <AddDietInput
              title={"Roti"}
              register={register}
              error={errors}
              name={"evening_roti"}
              isRequired={true}
              label={"Roti"}
            />
            <AddDietInput
              title={"Fish/Meat"}
              register={register}
              error={errors}
              name={"evening_fish_meat"}
              isRequired={true}
              label={"Fish/Meat"}
            />
            <AddDietInput
              title={"Pulse"}
              register={register}
              error={errors}
              name={"evening_pulse"}
              isRequired={true}
              label={"Pulse"}
            />
            <AddDietInput
              title={"Shack"}
              register={register}
              error={errors}
              name={"evening_shack"}
              isRequired={true}
              label={"Shack"}
            />
            <AddDietInput
              title={"Vegetable"}
              register={register}
              error={errors}
              name={"evening_vegetable"}
              isRequired={true}
              label={"Vegetable"}
            />
            <AddDietInput
              title={"Salad"}
              register={register}
              error={errors}
              name={"evening_salad"}
              isRequired={true}
              label={"Salad"}
            />

            <AddDietTextArea
              register={register}
              error={errors}
              name={"evening_extra"}
              isRequired={true}
              label={"Extra"}
            />

            <h3 className=" font-semibold text-gray-600 py-4 pl-8 text-2xl bg-gray-300">
              Before Sleep :{" "}
            </h3>

            <AddDietInput
              title={"Sleep"}
              register={register}
              error={errors}
              name={"sleep"}
              isRequired={true}
              label={"Sleep"}
              // value={sleepData}
              // onChange={(e) => {
              //   setSleepData(e.target.value);
              //   console.log("e.target.value", e.target.value);
              // }}
            />
          </div>
        )}

        {pageNumber === 2 && (
          <div>
            <AddDietTextArea
              register={register}
              error={errors}
              name={"food_to_avoid"}
              isRequired={true}
              label={"Food to avoid: "}
            />
            <AddDietTextArea
              register={register}
              error={errors}
              name={"fruits"}
              isRequired={true}
              label={"Fruits: "}
            />
            <AddDietTextArea
              register={register}
              error={errors}
              name={"vegetables"}
              isRequired={true}
              label={"Vegetables: "}
            />
            <AddDietTextArea
              register={register}
              error={errors}
              name={"weekly"}
              isRequired={true}
              label={"Weekly: "}
            />
            <AddDietTextArea
              register={register}
              error={errors}
              name={"suggestion"}
              isRequired={true}
              label={"Suggestion: "}
            />

            <div className="flex relative">
              <label className="block text-gray-700 font-semibold py-4 pl-4 w-52 text-lg bg-gray-300">
                Points to Note :
              </label>
              <textarea
                className="w-full p-2 border min-h-[150px] border-gray-200 focus:outline-none focus:border-gray-300"
                {...register("points_to_note", { required: true })}
              ></textarea>
              <p className="absolute bottom-0 right-4 text-red-500">
                {errors?.points_to_note?.message && (
                  <span className="text-red-500">
                    {errors?.points_to_note?.message}
                  </span>
                )}
              </p>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-12 hover:bg-neutral-800 font-semibold rounded mt-5  transition duration-300 flex items-center ml-auto "
              disabled={loading}
            >
              {loading && (
                <span className="loading loading-spinner loading-md"></span>
              )}
              Submit
            </button>
          </div>
        )}

        <div className="mt-8 flex justify-between items-center w-full col-span-3">
          <button
            className="py-2 px-6 bg-black text-white disabled:bg-gray-400"
            disabled={pageNumber === 1}
            onClick={() => setPageNumber(1)}
          >
            Previous
          </button>
          <button
            className="py-2 px-6 bg-black text-white disabled:bg-gray-400"
            disabled={pageNumber === 2}
            onClick={() => setPageNumber(2)}
          >
            Next
          </button>
        </div>
      </form>

      {/* <div className="mt-8">
        {formTypes[formIndex] === "diet-name" && (
          <SetDietName
            setFormIndex={setFormIndex}
            formIndex={formIndex}
            formTypes={formTypes}
            isShowModal={isShowModal}
            dietName={dietName}
          />
        )}
        {formTypes[formIndex] === "General Suggestion" && (
          <GeneralSuggestion
            setFormIndex={setFormIndex}
            formIndex={formIndex}
            formTypes={formTypes}
            isShowModal={isShowModal}
          />
        )}
        {formTypes[formIndex] === "Morning" && (
          <MorningPlan
            setFormIndex={setFormIndex}
            formIndex={formIndex}
            formTypes={formTypes}
            isShowModal={isShowModal}
          />
        )}
        {formTypes[formIndex] === "Mid-Morning" && (
          <MidMorning
            setFormIndex={setFormIndex}
            formIndex={formIndex}
            formTypes={formTypes}
            isShowModal={isShowModal}
          />
        )}
        {formTypes[formIndex] === "Evening Snacks" && (
          <EveningSnacks
            setFormIndex={setFormIndex}
            formIndex={formIndex}
            formTypes={formTypes}
            isShowModal={isShowModal}
          />
        )}
        {formTypes[formIndex] === "Before Sleep" && (
          <BeforeSleep
            setFormIndex={setFormIndex}
            formIndex={formIndex}
            formTypes={formTypes}
            isShowModal={isShowModal}
            setIsShowModal={setIsShowModal}
            diet_id={diet_id}
          />
        )}
      </div> */}
    </div>
  );
}

export default AddDiet;
