import React, { useContext, useState } from 'react';
import { TfiSearch } from "react-icons/tfi";
import { GoDotFill } from "react-icons/go";
import { RiCloseLine, RiDeleteBin2Line } from "react-icons/ri";
import Swal from 'sweetalert2';
import UseAxiosSecure from '../../../Hook/UseAxioSecure';
import Dpagination from '../../../components library/Dpagination';
import Mtitle from "/src/components library/Mtitle";
import { AuthContext } from '../../../providers/AuthProvider';

const SmsCampaign = () => {
    const {branch} = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMobileNumbers, setSelectedMobileNumbers] = useState([]);
    const url = 'smscampaigns';
    const axiosSecure = UseAxiosSecure();

    const { paginatedData, paginationControls, rowsPerPageAndTotal } = Dpagination({ branch, url });

    const handleRemove = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.delete(`/${url}/${id}`);
                Swal.fire(
                    'Deleted!',
                    'Your SMS campaign has been deleted.',
                    'success'
                );
            } catch (error) {
                console.error('Error deleting SMS campaign:', error);
                Swal.fire(
                    'Error!',
                    'There was an error deleting the SMS campaign.',
                    'error'
                );
            }
        }
    };

    const handleOpenModal = (mobileNumbers) => {
        setSelectedMobileNumbers(mobileNumbers.split(','));
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMobileNumbers([]);
    };

    return (
        <div className="p-4">
            <div className=''>
                <Mtitle title="SMS Campaigns" rightcontent={
                    <div className='flex justify-between mt-3 md:mt-0 items-center'>
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
            </div>
            <div className='md:text-base text-sm'>
                {rowsPerPageAndTotal}
            </div>

            <div className="overflow-x-auto md:text-sm text-xs border shadow-sm rounded-xl p-4 mt-5">
                <table className="table w-full">
                    <thead className='bg-yellow-500'>
                        <tr className="text-sm font-medium text-white text-left">
                            <td className="p-3 rounded-l-xl">Campaign Name</td>
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
      <td colSpan="6" className="text-center py-4 text-gray-500">
        No campaigns found
      </td>
    </tr>
  ) : (
    paginatedData.map((campaign) => (
      <tr key={campaign._id} className="hover:bg-slate-100 hover:rounded-xl">
        <td className="px-4 py-3">{campaign.campaignName}</td>
        <td
          className="px-4 py-3 cursor-pointer text-blue-500 underline"
          onClick={() => handleOpenModal(campaign.mobile)}
        >
          {campaign.mobile.split(",").length} numbers
        </td>
        <td className="px-4 py-3">{campaign.message}</td>
        <td className="px-4 py-3">
          <div>
            <span className="block">
              {new Date(campaign.send_on).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className="block text-sm text-gray-500">
              {new Date(campaign.send_on).toLocaleString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </div>
        </td>
        <td className="px-4 text-left py-3">
          <div className="flex justify-start items-center gap-1">
            <GoDotFill
              className={`text-xs ${
                campaign.status === "Unauthorized"
                  ? "text-[#f70000e0]"
                  : "text-green-500"
              }`}
            />
            <span className="first-letter:uppercase">{campaign.status}</span>
          </div>
        </td>
        <td className="px-4 py-3">
          <button
            onClick={() => handleRemove(campaign._id)}
            className="text-red-500 hover:text-red-700"
          >
            <RiDeleteBin2Line size={20} />
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>
                </table>
                {paginationControls}
            </div>


            {/* Custom Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                    <div className="bg-white rounded-2xl p-4 py-5 w-[90%] md:w-1/3 shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-center">Mobile Numbers</h2>
                        <div className="max-h-40 overflow-y-auto bg-gray-50 p-3 rounded-lg">
                            {selectedMobileNumbers.map((number, index) => (
                                <p key={index} className="text-sm text-gray-700 mb-2 last:mb-0">{number}</p>
                            ))}
                        </div>
                        <div className='flex justify-end'>
                            <button
                                onClick={handleCloseModal}
                                className="mt-6 max-w-min px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default SmsCampaign;
