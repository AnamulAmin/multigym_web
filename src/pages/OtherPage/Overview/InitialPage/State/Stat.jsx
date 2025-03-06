import React, { useContext, useEffect, useState } from "react";
import UseAxiosSecure from "../../../../../Hook/UseAxioSecure";
import { SlOptionsVertical } from "react-icons/sl";
import { IoEllipsisVerticalOutline } from "react-icons/io5";
import { BiFemale, BiMale, BiMaleFemale } from "react-icons/bi";
import { AuthContext } from "../../../../../providers/AuthProvider";

function Stat() {
  const [data, setData] = useState(null);

  const axiosSecure = UseAxiosSecure();
  const {branch} = useContext(AuthContext)
  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosSecure.get(`users/get-stats/${branch}`);
      setData(response?.data[0]);
    };
    fetchData();
  }, [axiosSecure]);

  return (
    <div className="w-full px-2 md:px-0 grid gap-2 grid-cols-1 md:gap-4 md:grid-cols-1  lg:grid-cols-3">
      {/* Total Members Card */}
      <div className="border rounded-lg">
        <div className="text-gray-800 pl-4 mt-4 font-semibold text-lg">Total Members</div>
        <div className="px-5 py-2">
          <div className="flex justify-center gap-3 text-gray-600 mt-2">
            <div>
              <span className="text-base flex gap-2"><BiMaleFemale className="text-xl text-green-500" />
                <div><span className="font-semibold">Total</span> : {data?.totalMembers?.totalCount}</div>
              </span>
            </div>
            <div>
              <span className="text-base flex  gap-2"><BiMale className="text-xl text-blue-500" />
                <div><span className="font-semibold">Male</span> : {data?.totalMembers?.maleCount}</div>
              </span>
            </div>
            <div>
              <span className="text-base flex gap-2"><BiFemale className="text-xl text-violet-500" />
                <div><span className="font-semibold">Female</span> : {data?.totalMembers?.femaleCount}</div>
              </span>
            </div>
          </div>
        </div>
        <div className="mt-2 h-2 rounded-b-lg bg-gradient-to-r from-green-400 to-blue-500"></div>
      </div>

      {/* Total Staff Card */}
      <div className="border rounded-lg">
        <div className="text-gray-800 pl-4 mt-4 font-semibold text-lg">Total Staff</div>
        <div className="px-5 py-2">
          <div className="flex justify-center gap-3 text-gray-600 mt-2">
            <div>
              <span className="text-base flex gap-2"><BiMaleFemale className="text-xl text-green-500" />
                <div><span className="font-semibold">Total</span> : {data?.totalStaffs?.totalCount}</div>
              </span>
            </div>
            <div>
              <span className="text-base flex  gap-2"><BiMale className="text-xl text-blue-500" />
                <div><span className="font-semibold">Male</span> : {data?.totalStaffs?.maleCount}</div>
              </span>
            </div>
            <div>
              <span className="text-base flex gap-2"><BiFemale className="text-xl text-violet-500" />
                <div><span className="font-semibold">Female</span> : {data?.totalStaffs?.femaleCount}</div>
              </span>
            </div>
          </div>
        </div>
        <div className="mt-2 h-2 rounded-b-lg bg-gradient-to-r from-green-400 to-blue-500"></div>
      </div>

      {/* Active Members Card */}
      <div className="border rounded-lg">
        <div className="text-gray-800 pl-4 mt-4 font-semibold text-lg">Active Members</div>
        <div className="px-5 py-2">
          <div className="flex justify-center gap-3 text-gray-600 mt-2">
            <div>
              <span className="text-base flex gap-2"><BiMaleFemale className="text-xl text-green-500" />
                <div><span className="font-semibold">Total</span> : {data?.activeMembers?.activeUsersCount}</div>
              </span>
            </div>
            <div>
              <span className="text-base flex  gap-2"><BiMale className="text-xl text-blue-500" />
                <div><span className="font-semibold">Male</span> : {data?.activeMembers?.maleCount}</div>
              </span>
            </div>
            <div>
              <span className="text-base flex gap-2"><BiFemale className="text-xl text-violet-500" />
                <div><span className="font-semibold">Female</span> : {data?.activeMembers?.femaleCount}</div>
              </span>
            </div>
          </div>
        </div>
        <div className="mt-2 h-2 rounded-b-lg bg-gradient-to-r from-green-400 to-blue-500"></div>
      </div>
    </div>




  );
}

export default Stat;
