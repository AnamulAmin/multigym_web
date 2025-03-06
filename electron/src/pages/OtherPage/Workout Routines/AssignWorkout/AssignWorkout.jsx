import { useEffect, useState } from "react";
import UseAxiosSecure from "../../../../Hook/UseAxioSecure";
import NoDataImage from "../../../../components/partial/NoDataImage/NoDataImage";
import Modal from "../../../../components/partial/Modal/Modal";
import ViewDetailAssignUser from "./ViewDetailAssignUser/ViewDetailAssignUser";
import Mtitle from "/src/components library/Mtitle";
import WorkoutHabitRow from "./WorkoutHabitRow/WorkoutHabitRow";
import WorkoutSearch from "../../../../components/partial/WorkoutSearch/WorkoutSearch";
import { useAuth } from "../../../../providers/AuthProvider";

const AssignWorkout = () => {
  const axiosSecure = UseAxiosSecure();
  const [assignDietPlanData, setAssignDietPlanData] = useState([]);
  const [isShowDietPlanSearch, setIsShowDietPlanSearch] = useState(false);
  const [userId, setUserId] = useState("");
  const [foodHabitId, setFoodHabitId] = useState("");
  const [isShowViewDetailAssignUser, setIsShowViewDetailAssignUser] =
    useState(false);
    const { branch } = useAuth();

  useEffect(() => {
    const submitData = async () => {
      try {
        const res = await axiosSecure.get(`/workout-routines/get-all-workout-habit?branch=${branch}`);
        setAssignDietPlanData(res?.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    submitData();
  }, [axiosSecure, isShowDietPlanSearch]);

  return (
    <div className="p-4">
      <Mtitle title="Assign Workout Rutine" />

      <div className="overflow-x-auto mt-4">
        <table className="table table-auto w-full">
          <thead>
            <tr className="text-sm font-semibold text-white bg-gray-700">
              <th className="p-3 rounded-tl-lg">Profile</th>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Card No</th>
              <th className="p-3">Registered</th>
              <th className="p-3 rounded-tr-lg text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {assignDietPlanData.length > 0 ? (
              assignDietPlanData.map((item, index) => (
                <WorkoutHabitRow
                  key={index}
                  data={item}
                  setIsShowDietPlanSearch={setIsShowDietPlanSearch}
                  setUserId={setUserId}
                  setFoodHabitId={setFoodHabitId}
                  setIsShowDetailModal={setIsShowViewDetailAssignUser}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-6">
                  <NoDataImage />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isShowModal={isShowDietPlanSearch}
        setIsShowModal={setIsShowDietPlanSearch}
      >
        <WorkoutSearch
          setIsShow={setIsShowDietPlanSearch}
          isShow={isShowDietPlanSearch}
          userId={userId}
          setUserId={setUserId}
        />
      </Modal>

      <Modal
        isShowModal={isShowViewDetailAssignUser}
        setIsShowModal={setIsShowViewDetailAssignUser}
      >
        <ViewDetailAssignUser
          setIsShow={setIsShowViewDetailAssignUser}
          isShow={isShowViewDetailAssignUser}
          foodHabitId={foodHabitId}
        />
      </Modal>
    </div>
  );
};

export default AssignWorkout;
