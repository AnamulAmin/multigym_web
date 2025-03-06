import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { BiMessageRoundedDots } from "react-icons/bi";
function GymStaffTableRow({ data, setIsShow, setIsShowNote, setUserId }) {
  return (
    <tr role="row" className="odd">
      <td className="">
        <div className="w-full grid grid-cols-1 lg:grid-cols-4 justify-between gap-3">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <img
              className="h-full w-full object-cover object-center"
              src={data?.photourl}
              alt={`Photo of ${data?.full_name}`}
            />
          </div>
          <div className="text-left space-y-2">
            <h3 className="text-lg font-bold">{data?.full_name}</h3>
            <h5 className="text-md font-medium">
              {data.gender} ({data?.blood_group})
            </h5>
            <button
              className="text-blue-500 flex items-center gap-2 cursor-pointer"
              onClick={() => {
                setIsShow(true);
                console.log("user id data?._id", data?._id);
                setUserId(data?._id);
              }}
            >
              <FaRegEdit />
              <span className="hover:underline">Edit Member</span>
            </button>
          </div>
          <div className="text-right space-y-2">
            <h4 className="text-md font-semibold">Contact Number</h4>
            <h5>{data?.contact_no}</h5>
          </div>
          <div className="text-right space-y-2">
            <h4 className="text-md font-semibold">Role</h4>
            <h5>{data?.role}</h5>
          </div>
          {/* <div className="text-right space-y-2">
            <h4 className="text-md font-semibold">Registered</h4>
            <h5>{data?.admission_date}</h5>
          </div> */}
          {/* <div className="text-right space-y-2">
            <h4 className="text-md font-semibold">Status</h4>
            <h5>
              <span className="px-3 py-1 bg-green-600 text-white text-[0.8rem] rounded">
                {data?.status}
              </span>
            </h5>
          </div> */}
        </div>
      </td>
    </tr>
  );
}

export default GymStaffTableRow;
