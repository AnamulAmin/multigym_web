import React, { useContext, useState } from 'react';
import { TfiSearch } from "react-icons/tfi";
import { RiDeleteBin2Line, RiEdit2Line } from "react-icons/ri";
import Swal from 'sweetalert2';
import Mtitle from "./../../../../components library/Mtitle";
import UseAxiosSecure from '../../../../Hook/UseAxioSecure';
import Dpagination from '../../../../components library/Dpagination';
import { GoPlus } from 'react-icons/go';
import VisitorModal from './VisitorModal'; // Import the updated modal
import { AuthContext } from '../../../../providers/AuthProvider';

const Visitor = () => {
    const {branch} =useContext(AuthContext);
    const url = 'visitor'; // API endpoint
    const { paginatedData, paginationControls, rowsPerPageAndTotal } = Dpagination({ branch, url });
    const axiosSecure = UseAxiosSecure();

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedVisitorId, setSelectedVisitorId] = useState(null);

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
                Swal.fire('Deleted!', 'Visitor has been deleted.', 'success');
            } catch (error) {
                Swal.fire('Error!', 'Failed to delete visitor.', 'error');
            }
        }
    };

    const openModalForEdit = (visitorId) => {
        setSelectedVisitorId(visitorId);
        setModalOpen(true);
    };

    const openModalForAdd = () => {
        setSelectedVisitorId(null);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleSaveVisitor = () => {
        // Refresh data after save
        setModalOpen(false);
    };

    return (
        <div className="md:p-4 p-3">
            <Mtitle title="Visitor Logs" rightcontent={
                <div className='flex justify-between'>
                    <div className="flex justify-end md:gap-4 gap-3 md:mt-0 mt-5 items-center">
                        {/* Search bar */}
                        <div className='md:w-64 border shadow-sm py-2 px-3 bg-white rounded-xl'>
                            <div className='flex items-center gap-2'>
                                <TfiSearch className='text-2xl font-bold text-gray-500' />
                                <input type="text" className='outline-none w-full' placeholder='Enter search keyword' />
                            </div>
                        </div>
                        <button onClick={openModalForAdd} className="bg-yellow-500 min-w-max py-2 px-2 font-semibold text-white md:py-2 md:px-4 rounded-lg hover:bg-yellow-600 transition duration-300">
                            Add Visitor
                        </button>
                    </div>
                </div>
            } ></Mtitle>

            <div className='md:text-base text-sm text-gray-500'>
            {rowsPerPageAndTotal}
            </div>

            <div className="overflow-x-auto border shadow-sm rounded-xl p-4 mt-5 bg-white">
                <table className="table w-full">
                    <thead className="bg-yellow-500">
                        <tr className="text-sm font-medium text-white text-left">
                            <td className="p-3 rounded-l-xl">Picture</td>
                            <td className="p-3">Name</td>
                            <td className="p-3">Mobile</td>
                            <td className="p-3">Email</td>
                            <td className="p-3">Visit Date</td>
                            <td className="p-3 rounded-r-xl">Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((visitor) => (
                            <tr key={visitor._id} className="hover:bg-slate-100 hover:rounded-xl transition-all duration-200">
                                <td className="px-4 py-3">
                                    <img src={visitor.visitorPicture} alt={visitor.visitorName} className="w-10 h-10 rounded-full" />
                                </td>
                                <td className="px-4 py-3">{visitor.visitorName}</td>
                                <td className="px-4 py-3">{visitor.visitorMobile}</td>
                                <td className="px-4 py-3">{visitor.visitorEmail}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    {new Date(visitor.visit_date).toLocaleString('en-GB', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true,
                                    })}
                                </td>
                                <td className=" text-base flex gap-4">
                                    <button onClick={() => openModalForEdit(visitor._id)} className="text-blue-500 hover:text-blue-700 transition-colors">
                                        <RiEdit2Line />
                                    </button>
                                    <button onClick={() => handleRemove(visitor._id)} className="text-red-500 hover:text-red-700 transition-colors">
                                        <RiDeleteBin2Line />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {paginationControls}
            </div>

            {/* Visitor Modal */}
            <VisitorModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                visitorId={selectedVisitorId}
                onSave={handleSaveVisitor}
                branch={branch}
            />
        </div>
    );
};

export default Visitor;
