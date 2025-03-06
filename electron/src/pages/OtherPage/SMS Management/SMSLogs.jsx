import React, { useContext, useState } from 'react';
import { TfiSearch } from "react-icons/tfi";
import { GoDotFill } from "react-icons/go";
import { RiDeleteBin2Line } from "react-icons/ri";
import Swal from 'sweetalert2';
import UseAxiosSecure from '../../../Hook/UseAxioSecure';
import Dpagination from '../../../components library/Dpagination';
import Mtitle from "/src/components library/Mtitle";
import { AuthContext } from '../../../providers/AuthProvider';

const SMSLogs = () => {
    const {branch} = useContext(AuthContext);
    const url = 'smslogs'

    // Render Dpagination and pass the branch
    const { paginatedData, paginationControls, rowsPerPageAndTotal } = Dpagination({ branch, url });
    const axiosSecure = UseAxiosSecure();

    const handleRemove = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#fda93c11',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.delete(`/${url}/${id}`);
                Swal.fire(
                    'Deleted!',
                    'Your SMS log has been deleted.',
                    'success'
                );
            } catch (error) {
                console.error('Error deleting SMS log:', error);
                Swal.fire(
                    'Error!',
                    'There was an error deleting the SMS log.',
                    'error'
                );
            }
        }
    };

    return (
        <div className="p-4">
            <Mtitle title="SMS Logs" rightcontent={
                <div className='flex justify-between md:mt-0 mt-3'>
                    <div className="flex justify-end gap-4 items-center">
                        {/* Search bar */}
                        <div className='w-64 border shadow-sm py-2 px-3 bg-white rounded-xl'>
                            <div className='flex items-center gap-2'>
                                <TfiSearch className='text-2xl font-bold text-gray-500' />
                                <input type="text" className='outline-none w-full' placeholder='Enter search keyword' />
                            </div>
                        </div>
                    </div>
                </div>
            } ></Mtitle>


            <div className='text-sm'>
                {rowsPerPageAndTotal}
            </div>

            <div className="overflow-x-auto border shadow-sm rounded-xl p-4 mt-5 bg-white">
                <table className="text-xs md:text-sm table w-full">
                    <thead className="bg-yellow-500">
                        <tr className="text-sm font-medium text-white text-left">
                            <td className="p-3 rounded-l-xl">Name</td>
                            <td className="p-3">Mobile</td>
                            <td className="p-3">Message</td>
                            <td className="p-3">Send On</td>
                            <td className="p-3">Status</td>
                            <td className="p-3 rounded-r-xl">Action</td>
                        </tr>
                    </thead>
                    <tbody>
  {paginatedData.length === 0 ? (
    <tr>
      <td colSpan="7" className="text-center py-4 text-gray-500">
        No SMS log found
      </td>
    </tr>
  ) : (
    paginatedData.map((log) => (
      <tr
        key={log._id}
        className="hover:bg-slate-100 hover:rounded-xl transition-all duration-200"
      >
        <td className="px-4 py-3">{log.name}</td>
        <td className="px-4 py-3">{log.mobile}</td>
        <td className="px-4 py-3 hidden md:block">{log.message}</td>
        <td className="px-4 py-3 md:hidden">Pc view only</td>
        <td className="px-4 py-3 whitespace-nowrap">
          {new Date(log.send_on).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </td>
        <td className="px-4 text-left py-3">
          <div className="flex items-center gap-2">
            <GoDotFill
              className={`text-xs ${
                log.status === "Failed"
                  ? "text-[#f70000e0]"
                  : log.status === "Queued"
                  ? "text-yellow-500"
                  : log.status === "Unauthorized"
                  ? "text-yellow-400"
                  : "text-green-500"
              }`}
            />
            <span className="capitalize">{log.status}</span>
          </div>
        </td>
        <td className=" text-base">
          <button
            onClick={() => handleRemove(log._id)}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <RiDeleteBin2Line />
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>

                </table>
                {paginationControls}
            </div>

        </div>
    );
};

export default SMSLogs;
