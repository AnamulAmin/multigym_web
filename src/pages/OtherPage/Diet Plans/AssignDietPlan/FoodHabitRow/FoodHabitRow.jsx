import React from "react";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { LuPencilLine } from "react-icons/lu";
import { MdOutlineManageAccounts } from "react-icons/md";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../../../Hook/UseAxioSecure";
import { GrView } from "react-icons/gr";

function FoodHabitRow({
  data,
  setIsShowDietPlanSearch,
  setUserId,
  setFoodHabitId,
  setIsShowDetailModal,
}) {
  const axiosSecure = UseAxiosSecure();

  // const handleDelete = async (id) => {
  //   try {
  //     Swal.fire({
  //       title: "Do you want to save the changes?",

  //       showCancelButton: true,
  //       confirmButtonText: "Delete",
  //     }).then(async (result) => {
  //       /* Read more about isConfirmed, isDenied below */
  //       if (result.isConfirmed) {
  //         const res = await axiosSecure.delete(`/users/delete/${id}`);
  //         console.log("res 16561", res);
  //         toast.success("Member Deleted Successfully");
  //       } else if (result.isDenied) {
  //         Swal.fire("Changes are not saved", "", "info");
  //       }
  //     });
  //   } catch (error) {
  //     toast.error("Member Deleted Failed");
  //     console.error("res 16561", error);
  //   }
  // };
  return (
    <tr className="">
      <td className="w-full  lg:w-auto ">
        <div className="">
          <div className="w-20 relative h-20 overflow-hidden">
            <img
              className="h-full   rounded-full w-full object-cover object-center"
              src={data?.user?.photourl}
              alt={`Photo of ${data?.user?.full_name}`}
            />
            <div className="flex p-1  absolute rounded-md hover:border hover:border-gray-300 border-transparent border bg-gray-700 bottom-1 text-white transition duration-300 hover:text-black hover:bg-white right-0 items-center border-bottom-1">
              <span
                className=" flex items-center gap-2 cursor-pointer"
                // onClick={() => setIsShowNote(true)}
              >
                <LuPencilLine className=" text-sm" />
              </span>
            </div>
          </div>
        </div>
      </td>

      <td className="text-left space-y-1">
        <h3 className="text-lg font-semibold">{data?.user?.full_name}</h3>
        <h5 className="text-md">
          ({data?.user?.member_id || "N/A"}) - {data?.user?.gender || "N/A"} (
          {data?.user?.blood_group || "N/A"})
        </h5>
      </td>

      <td className="">
        <h5>{data?.user?.contact_no || "N/A"}</h5>
      </td>

      <td className="">
      <h5>
          {data?.user?.card_no || "N/A"}{" "} - 
          <span> {data?.user?.member_id || "N/A"}</span>
          {/* <span>{data?.user?.date_of_birth || "N/A"}</span> */}
      </h5>
      </td>

      <td className="">
        <h5>{data?.user?.admission_date || "N/A"}</h5>
        <h5>{data?.user?.expiredate || "N/A"}</h5>
      </td>

      <td className=" flex pt-8 justify-end text-left gap-3  items-center">
        <button
          className="cursor-pointer text-2xl p-2 rounded-lg transition duration-300 hover:bg-slate-700 hover:text-white "
          onClick={() => {
            setFoodHabitId(data._id);
            setIsShowDetailModal(true);
          }}
        >
          <GrView className="" />
        </button>
        <button
          className="cursor-pointer text-xl p-2 py-1 rounded-lg transition duration-300 bg-slate-700 hover:text-black text-white hover:bg-yellow-500 "
          onClick={() => {
            setIsShowDietPlanSearch(true);
            setUserId(data?.user?._id);
          }}
        >
          Send
        </button>
      </td>
    </tr>
  );
}

export default FoodHabitRow;
