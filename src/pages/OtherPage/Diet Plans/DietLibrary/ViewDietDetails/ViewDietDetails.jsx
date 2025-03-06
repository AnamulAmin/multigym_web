import React, { useEffect, useState } from "react";
import axios from "axios";
import UseAxiosSecure from "../../../../../Hook/UseAxioSecure";
import { useAuth } from "../../../../../providers/AuthProvider";
import MyDietPlanContent from "../../MyDietPlan/MyDietPlanContent/MyDietPlanContent";

const ViewDietDetails = ({ diet_id, isShow, setIsShow }) => {
  const [diet, setDiet] = useState(null);
  const axiosSecure = UseAxiosSecure();
  const {branch} = useAuth();

  console.log("diet_id", diet_id);

  useEffect(() => {
    const fetchViewDietDetails = async () => {
      try {
        const response = await axiosSecure.get(`/diet-plan/get-id/${diet_id}?branch=${branch}`);
        setDiet(response.data);
      } catch (error) {
        console.error("Error fetching diet details:", error);
      }
    };

    fetchViewDietDetails();
  }, [diet_id, axiosSecure]);

  if (!diet) return <div>Loading...</div>;

  return (
    <MyDietPlanContent diet={diet} isShowModal={isShow} setIsShowModal={setIsShow} />
    // <div className="w-[60%] mx-auto p-6 bg-white shadow-md rounded-lg my-10">
    //   <h1 className="text-5xl font-bold mb-6 capitalize">{diet?.dietName}</h1>

    //   {/* Branch */}
    //   <p className="text-xl mb-4">
    //     <span className="font-semibold">Branch:</span> {diet?.branch}
    //   </p>

    //   {/* Health Metrics */}
    //   {diet.health_metrics && (
    //     <>
    //       <h2 className="text-2xl font-semibold mt-8">Health Metrics</h2>
    //       <div className="grid grid-cols-2 gap-4 mt-4">
    //         <p>
    //           <span className="font-semibold">Weight:</span>{" "}
    //           {diet?.health_metrics.weight}
    //         </p>
    //         <p>
    //           <span className="font-semibold">Height:</span>{" "}
    //           {diet?.health_metrics.height}
    //         </p>
    //         <p>
    //           <span className="font-semibold">Ideal Weight:</span>{" "}
    //           {diet?.health_metrics.ideal_weight}
    //         </p>
    //         <p>
    //           <span className="font-semibold">Extra Weight:</span>{" "}
    //           {diet?.health_metrics.extra_weight}
    //         </p>
    //         <p>
    //           <span className="font-semibold">BP:</span>{" "}
    //           {diet?.health_metrics.bp}
    //         </p>
    //         <p>
    //           <span className="font-semibold">Calorie:</span>{" "}
    //           {diet?.health_metrics.calorie}
    //         </p>
    //         <p>
    //           <span className="font-semibold">Water:</span>{" "}
    //           {diet?.health_metrics.water}
    //         </p>
    //         <p>
    //           <span className="font-semibold">Sugar:</span>{" "}
    //           {diet?.health_metrics.sugar}
    //         </p>
    //         <p>
    //           <span className="font-semibold">Oil:</span>{" "}
    //           {diet?.health_metrics.oil}
    //         </p>
    //         <p className="col-span-full">
    //           <span className="font-semibold">Suggestion:</span>{" "}
    //           {diet?.health_metrics.suggestion}
    //         </p>
    //       </div>
    //     </>
    //   )}

    //   {/* Breakfast */}
    //   {diet.breakfast && (
    //     <>
    //       <h2 className="text-2xl font-semibold mt-8">Breakfast</h2>
    //       <div className="grid grid-cols-2 gap-4 mt-4">
    //         <p>
    //           <span className="font-semibold">Roti:</span>{" "}
    //           {diet?.breakfast.roti}
    //         </p>
    //         <p>
    //           <span className="font-semibold">Egg:</span> {diet?.breakfast.egg}
    //         </p>
    //         <p>
    //           <span className="font-semibold">Vegetable:</span>{" "}
    //           {diet?.breakfast.vegetable}
    //         </p>
    //         <p>
    //           <span className="font-semibold">Fruit:</span>{" "}
    //           {diet?.breakfast.fruit}
    //         </p>
    //       </div>
    //     </>
    //   )}

    //   {/* Lunch */}
    //   {diet.lunch && (
    //     <>
    //       <h2 className="text-2xl font-semibold mt-8">Lunch</h2>
    //       <div className="grid grid-cols-2 gap-4 mt-4">
    //         <p>
    //           <span className="font-semibold">Rice:</span>{" "}
    //           {diet?.lunch.lunch_rice}
    //         </p>
    //         <p>
    //           <span className="font-semibold">Fish/Meat:</span>{" "}
    //           {diet?.lunch.fish_meat}
    //         </p>
    //         <p>
    //           <span className="font-semibold">Pulse:</span> {diet?.lunch.pulse}
    //         </p>
    //         <p>
    //           <span className="font-semibold">Shack:</span> {diet?.lunch.shack}
    //         </p>
    //         <p>
    //           <span className="font-semibold">Vegetable:</span>{" "}
    //           {diet?.lunch.vegetable}
    //         </p>
    //         <p>
    //           <span className="font-semibold">Salad:</span> {diet?.lunch.salad}
    //         </p>
    //       </div>
    //     </>
    //   )}

    //   {/* Dinner */}
    //   {diet.dinner && (
    //     <>
    //       <h2 className="text-2xl font-semibold mt-8">Dinner</h2>
    //       <div className="grid grid-cols-2 gap-4 mt-4">
    //         <p>
    //           <span className="font-semibold">Rice/Roti:</span>{" "}
    //           {diet?.dinner.dinner_rice_roti}
    //         </p>
    //         <p>
    //           <span className="font-semibold">Fish/Meat:</span>{" "}
    //           {diet?.dinner.fish_meat}
    //         </p>
    //         <p>
    //           <span className="font-semibold">Pulse:</span> {diet?.dinner.pulse}
    //         </p>
    //         <p>
    //           <span className="font-semibold">Shack:</span> {diet?.dinner.shack}
    //         </p>
    //         <p>
    //           <span className="font-semibold">Vegetable:</span>{" "}
    //           {diet?.dinner.vegetable}
    //         </p>
    //         <p>
    //           <span className="font-semibold">Salad:</span> {diet?.dinner.salad}
    //         </p>
    //       </div>
    //     </>
    //   )}

    //   {/* Before Sleep */}
    //   {diet.sleep && (
    //     <>
    //       <h2 className="text-2xl font-semibold mt-8">Before Sleep</h2>
    //       <div className="mt-4">
    //         <p>
    //           <span className="font-semibold">Sleep:</span> {diet?.sleep.sleep}
    //         </p>
    //       </div>
    //     </>
    //   )}
    // </div>
  );
};

export default ViewDietDetails;
