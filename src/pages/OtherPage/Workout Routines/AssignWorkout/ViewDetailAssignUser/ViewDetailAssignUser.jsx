import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../../../Hook/UseAxioSecure";
import noUuser from "../../../../../assets/user.png";
import GlobalLoading from "../../../../../components library/GlobalLoading";
import { useAuth } from "../../../../../providers/AuthProvider";

const ViewDetailAssignUser = ({ foodHabitId }) => {
  console.log("foodHabitId", foodHabitId);
  const [requestUser, setRequestUser] = useState(null);
  const [foodHabit, setFoodHabit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const {branch} = useAuth();

  const axiosSecure = UseAxiosSecure();

  useEffect(() => {
    // Fetch requestUser and food habit details
    const fetchDetails = async () => {
      try {
        setIsLoading(true);

        const questionResponse = await axiosSecure.get(
          `/workout-routines/workout-habit-question/get?branch=${branch}`
        );
        const data = questionResponse?.data;

        const schema = {};
        for (let key in data) {
          schema[data[key].name] = "";
        }

        const response = await axiosSecure.post(
          `/workout-routines/get-workout-habit/${foodHabitId}?branch=${branch}`,
          schema
        );
        setIsLoading(false);
        setRequestUser(response?.data?.user);

        const foodHabitUserAnswer = response?.data?.workoutUserAnswerModelReport;
        delete foodHabitUserAnswer?._id;
        delete foodHabitUserAnswer?.__v;

        const emptyFoodHabitUserAnswerArray = [];

        Object.keys(foodHabitUserAnswer).forEach((fieldName) => {
          const emptyObj = {};

          emptyObj.name = fieldName;
          emptyObj.value = foodHabitUserAnswer[fieldName];

          emptyFoodHabitUserAnswerArray.push(emptyObj);
        });

        setFoodHabit(emptyFoodHabitUserAnswerArray);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching details:", error);
      }
    };

    fetchDetails();
  }, [foodHabitId, axiosSecure]);

  if (isLoading) return <GlobalLoading />;

  return (
    <div className="md:w-full w-[90%] max-w-4xl mx-auto p-4 md:p-6 bg-white shadow-md rounded-lg my-10">
      <div className="flex flex-col md:flex-row items-center mb-6">
        <img
          src={requestUser?.photourl || noUuser}
          alt={requestUser?.full_name}
          className="w-24 h-24 rounded-full object-cover mb-4 md:mb-0"
        />
        <div className="text-center md:text-left md:ml-4">
          <h1 className="text-2xl md:text-3xl font-bold">
            {requestUser?.full_name || "N/A"}
          </h1>
          <p className="text-gray-600">{requestUser?.email || "N/A"}</p>
          <p className="text-gray-600">{requestUser?.contact_no || "N/A"}</p>
        </div>
      </div>

      <h2 className="text-xl md:text-2xl font-semibold mt-6">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <p><span className="font-semibold">Member ID:</span> {requestUser?.member_id || "N/A"}</p>
          <p><span className="font-semibold">Nickname:</span> {requestUser?.nickname || "N/A"}</p>
          <p><span className="font-semibold">Date of Birth:</span> {requestUser?.date_of_birth || "N/A"}</p>
          <p><span className="font-semibold">NID Number:</span> {requestUser?.nid_number || "N/A"}</p>
          <p><span className="font-semibold">Address:</span> {requestUser?.address || "N/A"}</p>
        </div>
        <div>
          <p><span className="font-semibold">Gender:</span> {requestUser?.gender || "N/A"}</p>
          <p><span className="font-semibold">Religion:</span> {requestUser?.religion || "N/A"}</p>
          <p><span className="font-semibold">Blood Group:</span> {requestUser?.blood_group || "N/A"}</p>
          <p><span className="font-semibold">Height:</span> {requestUser?.height || "N/A"}</p>
          <p><span className="font-semibold">Weight:</span> {requestUser?.weight || "N/A"}</p>
        </div>
      </div>

      <h2 className="text-xl md:text-2xl font-semibold mt-6">Professional Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <p><span className="font-semibold">Profession:</span> {requestUser?.profession || "N/A"}</p>
          <p><span className="font-semibold">Branch:</span> {requestUser?.branch || "N/A"}</p>
          <p><span className="font-semibold">Expire Date:</span> {requestUser?.expiredate || "N/A"}</p>
        </div>
        <div>
          <p><span className="font-semibold">Role:</span> {requestUser?.role || "N/A"}</p>
          <p><span className="font-semibold">Admission Date:</span> {requestUser?.admission_date || "N/A"}</p>
          <p><span className="font-semibold">Card No:</span> {requestUser?.card_no || "N/A"}</p>
        </div>
      </div>

      <h2 className="text-xl md:text-2xl font-semibold mt-6">Emergency Contact</h2>
      <div className="mt-4">
        <p><span className="font-semibold">Name:</span> {requestUser?.emergency_contact_name || "N/A"}</p>
        <p><span className="font-semibold">Contact Number:</span> {requestUser?.emergency_contact_number || "N/A"}</p>
      </div>

      <h2 className="text-xl md:text-2xl font-semibold mt-6">Answers</h2>
      <div className="grid grid-cols-1  gap-4 mt-4">
        {foodHabit?.map((item, index) => (
          <div
            key={index}
            className={`${
              item?.value?.length > 26 ? "col-span-2" : ""
            } mt-3`}
          >
            <p className="flex flex-wrap gap-2 capitalize">
              <span className="font-bold">{item?.name.replaceAll("_", " ")}:</span> {item.value || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewDetailAssignUser;
