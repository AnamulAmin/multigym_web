import React, { useState, useEffect, useContext } from 'react';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { GoPlus } from 'react-icons/go';
import { TfiSearch } from 'react-icons/tfi';
import Swal from 'sweetalert2';
import UseAxiosSecure from '../../../Hook/UseAxioSecure';
import SmsTemplateModal from './Modal/SmsTemplateModal';
import Mpagination from '../../../components library/Mpagination';
import Mtitle from "/src/components library/Mtitle";
import { AuthContext } from '../../../providers/AuthProvider';

const Smstemplates = () => {
    const axiosSecure = UseAxiosSecure();
    const [searchTerm, setSearchTerm] = useState('');
    const [templates, setTemplates] = useState([]);
    const [filteredTemplates, setFilteredTemplates] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentTemplateId, setCurrentTemplateId] = useState(null);
    const [loading, setLoading] = useState(false);
    const {branch} = useContext(AuthContext);

    useEffect(() => {
        fetchTemplates();
    }, [branch]);

    const fetchTemplates = () => {
        setLoading(true);
        axiosSecure.get(`/smstemplates/?branch=${branch}`)
            .then(response => {
                setTemplates(response.data);
                setFilteredTemplates(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        const filtered = templates.filter(template =>
            template.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
            template.msg.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredTemplates(filtered);
    };

    const handleAddNew = () => {
        setCurrentTemplateId(null);
        setModalOpen(true);
    };

    const handleEdit = (id) => {
        setCurrentTemplateId(id);
        setModalOpen(true);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/smstemplates/${id}`)
                    .then(() => {
                        const updatedTemplates = templates.filter(template => template._id !== id);
                        setTemplates(updatedTemplates);
                        setFilteredTemplates(updatedTemplates);
                        Swal.fire('Deleted!', 'The template has been deleted.', 'success');
                    })
                    .catch(error => console.error('Error deleting template:', error));
            }
        });
    };
    const { paginatedData, paginationControls, rowsPerPageAndTotal } = Mpagination({ totalData: filteredTemplates });
    return (
        <div className='px-4'>
            <Mtitle title="SMS Templates" rightcontent={
                <div className='flex gap-3 md:mt-0 mt-3 justify-between'>
                    <div className="flex justify-end md:gap-4 items-center">
                        {/* Search bar */}
                        <div className='md:w-64 border shadow-sm py-2 px-3 bg-white rounded-xl'>
                            <div className='flex items-center gap-2'>
                                <TfiSearch className='text-2xl font-bold text-gray-500' />
                                <input type="text" className='outline-none w-full' placeholder="Search here"
                                    value={searchTerm}
                                    onChange={handleSearch} />
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleAddNew}
                        className="flex items-center bg-yellow-500 text-white md:py-2 min-w-max px-2 gap-2 md:px-4 rounded-xl shadow hover:bg-yellow-600 transition duration-300"
                    >
                        <span className='font-semibold'>New</span>
                        <GoPlus className="text-xl mr-1" />
                    </button>
                </div>
                // <div className="flex justify-between items-center mb-4">
                //     <div className="flex items-center gap-4">
                //         <div className="w-full">
                //             <TfiSearch className=" text-gray-500" />
                //             <input
                //                 type="text"
                //                 className="w-full py-2 pl-10 pr-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                //                 placeholder="Search here"
                //                 value={searchTerm}
                //                 onChange={handleSearch}
                //             />
                //         </div>
                //         <button
                //             onClick={handleAddNew}
                //             className="flex items-center bg-yellow-500 text-white py-2 px-4 rounded-xl shadow hover:bg-yellow-600 transition duration-300"
                //         >
                //             <GoPlus className="text-xl mr-1" />
                //             Add New
                //         </button>
                //     </div>
                // </div>
            } ></Mtitle>

            <div className='text-sm md:text-base'>
                {rowsPerPageAndTotal}
            </div>
            <div className="mt-5 overflow-x-auto border shadow-sm rounded-xl p-4">
                {loading ? (
                    <div className="text-center py-4">Loading...</div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-base text-gray-700">
                                <td className="p-3 rounded-full">Name</td>
                                <td className="p-3 rounded-full">Message</td>
                                <td className="p-3 rounded-full">Actions</td>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-center py-4">No SMS templates found.</td>
                                </tr>
                            ) : (
                                paginatedData.map((template) => (
                                    <tr key={template._id} className="hover:bg-slate-100 rounded-xl  transition duration-200 ease-in-out">
                                        <td className="px-4 py-3 text-xs md:text-sm font-medium">{template.name}</td>
                                        <td className="px-4 py-3 text-xs md:text-sm">{template.msg}</td>
                                        <td className="px-4 py-6  flex justify-center items-end">
                                            <button onClick={() => handleEdit(template._id)} className="text-blue-500 hover:text-blue-700 text-xl mr-2">
                                                <FiEdit />
                                            </button>
                                            <button onClick={() => handleDelete(template._id)} className="text-red-500 hover:text-red-700 text-xl ml-2">
                                                <FiTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
                {paginationControls}
            </div>
            <SmsTemplateModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                templateId={currentTemplateId}
                onSave={fetchTemplates}
                branch={branch}
            />
        </div>
    );
};

export default Smstemplates;
