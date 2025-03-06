import React, { useState, useEffect, useContext } from 'react';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { TfiSearch } from 'react-icons/tfi';
import Swal from 'sweetalert2';
import UseAxiosSecure from '../../../Hook/UseAxioSecure';
import Mpagination from '../../../components library/Mpagination';
import { GoPlus } from 'react-icons/go';
import GroupModal from './Modal/GroupModal';
import Mtitle from "/src/components library/Mtitle";
import { AuthContext } from '../../../providers/AuthProvider';
const SmsGroup = () => {
    const axiosSecure = UseAxiosSecure();
    const {branch} = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [groups, setGroups] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = () => {
        setLoading(true);
        axiosSecure.get(`/smsgroups//${branch}/get-all`)
            .then(response => {
                setGroups(response.data);
                setFilteredGroups(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        const filtered = groups.filter(group =>
            group.groupName.toLowerCase().includes(e.target.value.toLowerCase()) ||
            group.branch.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredGroups(filtered);
    };

    const handleAddNew = () => {
        setEditData(null);
        setModalOpen(true);
    };

    const handleEdit = (id) => {
        const group = groups.find(group => group._id === id);
        setEditData(group);
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
                axiosSecure.delete(`/smsgroups/delete/${id}`)
                    .then(() => {
                        const updatedGroups = groups.filter(group => group._id !== id);
                        setGroups(updatedGroups);
                        setFilteredGroups(updatedGroups);
                        Swal.fire('Deleted!', 'The group has been deleted.', 'success');
                    })
                    .catch(error => {
                        console.error('Error deleting group:', error);
                        Swal.fire('Error!', 'There was an error deleting the group.', 'error');
                    });
            }
        });
    };

    const handleModalSubmit = (formData) => {
        if (editData) {
            axiosSecure.put(`/smsgroups/put/${editData._id}`, formData)
                .then(() => {
                    fetchGroups();
                    setModalOpen(false);
                    Swal.fire({
                        icon: 'success',
                        title: 'Group Edited',
                        text: 'The group has been edited successfully!',
                    });
                })
                .catch(error => {
                    console.error('Error editing group:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'There was an error editing the group.',
                    });
                });
        } else {
            axiosSecure.post('/smsgroups/post', formData)
                .then(() => {
                    fetchGroups();
                    setModalOpen(false);
                    Swal.fire({
                        icon: 'success',
                        title: 'Group Added',
                        text: 'The group has been added successfully!',
                    });
                })
                .catch(error => {
                    console.error('Error adding group:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'There was an error adding the group.',
                    });
                });
        }
    };

    const { paginatedData, paginationControls, rowsPerPageAndTotal } = Mpagination({ totalData: filteredGroups });

    return (
        <div className='px-3'>

            <GroupModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleModalSubmit}
                initialData={editData}
                branch={branch}
            />
            <Mtitle title="SMS Groups" rightcontent={
                <div className='flex mt-3 md:mt-0 gap-3 justify-between'>
                    <div className="flex justify-end gap-4 items-center">
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
                        className="flex items-center bg-yellow-500 text-white py-2 px-4 rounded-xl shadow hover:bg-yellow-600 transition duration-300"
                    >
                        <GoPlus className="text-xl mr-1" />
                        <span className='font-semibold'>New</span>
                    </button>
                </div>

            } ></Mtitle>

            <div className='text-gray-500 text-sm md:text-base'>
                {rowsPerPageAndTotal}
            </div>
            <div className="mt-5 overflow-x-auto border shadow-sm rounded-xl p-4">
                {loading ? (
                    <div className="text-center py-4">Loading...</div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className=" text-gray-500">
                                <td className="p-3  rounded-full">Name</td>
                           
                                <td className="p-3  rounded-full">Type</td>
                                <td className="p-3  rounded-full">Status</td>
                                <td className="p-3  rounded-full">Actions</td>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">No groups found.</td>
                                </tr>
                            ) : (
                                paginatedData.map((group) => (
<tr key={group._id} className="hover:bg-slate-100 rounded-xl text-sm md:text-base transition duration-200 ease-in-out">
    <td className="px-4 py-3 flex items-center">
        <span
            className={`w-3 h-3 rounded-full mr-2 ${
                group.status === "active" ? "bg-green-500" : "bg-red-500"
            }`}
        ></span>
        {group.groupName}
    </td>
   
    <td className="px-4 py-3">{group.type}</td>
    <td
    className={`px-4 font-bold py-3 ${
        group.status === "active" ? "text-green-500" : "text-red-500"
    }`}
>
    {group.status === "active" ? "Active" : "Inactive"}
</td>
    <td className="px-4 py-7 flex items-center">
        <button
            onClick={() => handleEdit(group._id)}
            className="text-blue-500 hover:text-blue-700 text-xl mr-2"
        >
            <FiEdit />
        </button>
        <button
            onClick={() => handleDelete(group._id)}
            className="text-red-500 hover:text-red-700 text-xl ml-2"
        >
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
        </div>
    );
};

export default SmsGroup;
