import React, { useEffect, useState } from "react";
import DashboardTitle from "../../../../components/partial/DashboardTitle/Title";
import { GoPlus } from "react-icons/go";
import { TfiSearch } from "react-icons/tfi";
import DietLibraryHeader from "./DietLibraryHeader/DietLibraryHeader";
import AddDiet from "./AddDiet/AddDiet";
import Modal from "../../../../components/partial/Modal/Modal";
import DietRow from "./DietRow/DietRow";
import UseAxiosSecure from "../../../../Hook/UseAxioSecure";
import Table from "../../../../components/partial/Table/Table";
import NoDataImage from "../../../../components/partial/NoDataImage/NoDataImage";
import UserSearch from "../../../../components/partial/UserSearchInput/UserSearchInput";
import ViewDietDetails from "./ViewDietDetails/ViewDietDetails";
import { useAuth } from "../../../../providers/AuthProvider";

const DietLibrary = () => {
  const [search, setSearch] = useState("");
  const [showAddDietForm, setShowAddDietForm] = useState(false);
  const [dietData, setDietData] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isShowUserSearch, setIsShowUserSearch] = useState(false);
  const [diet_id, setDietId] = useState("");
  const [isShowViewDietDetails, setIsShowViewDietDetails] = useState(false);
  const [formIndex, setFormIndex] = useState(0);
  const {user} = useAuth();

  const axiosSecure = UseAxiosSecure();
  useEffect(() => {
    if (!showAddDietForm) {
      sessionStorage.removeItem("beforeSleep");
      sessionStorage.removeItem("MidMorning");
      sessionStorage.removeItem("EveningSnacks");
      sessionStorage.removeItem("MorningPlan");
      sessionStorage.removeItem("GeneralSuggestion");
    }
  }, [showAddDietForm]);

  useEffect(() => {
    const submitData = async () => {
      const filter = {};

      try {
        const res = await axiosSecure.get(`/diet-plan/get-all?branch=${user?.branch}`);

        console.log("res 16561", res);

        setDietData(res?.data);
      } catch (error) {
        console.error("res 16561", error);
      }
    };

    submitData();
  }, [axiosSecure, showAddDietForm, isDeleted]);

  return (
    <>
      <div className="px-9 ">
        <DietLibraryHeader
          search={search}
          setSearch={setSearch}
          showAddDietForm={showAddDietForm}
          setShowAddDietForm={setShowAddDietForm}
          setDietId={setDietId}
        />

        <div className="md:border p-2 md:p-5 rounded-xl shadow-sm">
          <table className="table w-full">
            <thead className="">
              <tr className="text-base text-gray-500 font-normal text-left">
                <td className="p-3">Name</td>
                {/* <td className="p-3">Action</td> */}
                <td className="p-3 rounded-tr-xl pr-10 text-right">Action</td>
              </tr>
            </thead>
            <tbody>
              {dietData && dietData?.length > 0 ? (
                dietData.map((item, index) => (
                  <DietRow
                    key={index}
                    item={item}
                    setIsDeleted={setIsDeleted}
                    setIsShowUserSearch={setIsShowUserSearch}
                    setDietId={setDietId}
                    setIsShowViewDietModal={setIsShowViewDietDetails}
                    setShowAddDietForm={setShowAddDietForm}
                  />
                ))
              ) : (
                <NoDataImage />
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        isShowModal={showAddDietForm}
        setIsShowModal={setShowAddDietForm}
        formIndex={formIndex}
        setFormIndex={setFormIndex}
      >
        <AddDiet
          isShowModal={showAddDietForm}
          setIsShowModal={setShowAddDietForm}
          diet_id={diet_id}
          formIndex={formIndex}
          setFormIndex={setFormIndex}
        />
      </Modal>
      <Modal
        isShowModal={isShowUserSearch}
        setIsShowModal={setIsShowUserSearch}
      >
        <div className="bg-white md:p-6 p-4 rounded-lg shadow-lg max-h-[95vh] overflow-y-auto w-full md:min-w-[800px] max-w-[95vw]">
          <h2 className="text-2xl font-semibold mb-4">Send Diet plan to a member</h2>
          <UserSearch
            setIsShow={setIsShowUserSearch}
            isShow={isShowUserSearch}
            diet_id={diet_id}
            setDietId={setDietId}
          />
          {/* <div className="flex mt-4">
      <button
        onClick={() => { setIsShowUserSearch(false); }}
        className="bg-gray-500 text-white py-2 px-4 rounded-xl shadow hover:bg-gray-600 transition duration-300"
      >
        Close
      </button>
    </div> */}
        </div>
      </Modal>

      <Modal
        isShowModal={isShowViewDietDetails}
        setIsShowModal={setIsShowViewDietDetails}
      >
        <ViewDietDetails
          setIsShow={setIsShowViewDietDetails}
          isShow={isShowViewDietDetails}
          diet_id={diet_id}
          setDietId={setDietId}
        />
      </Modal>
    </>
  );
};

export default DietLibrary;
