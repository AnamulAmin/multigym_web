import React, { useState, useEffect, useContext } from "react";
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import UseAxiosSecure from '../../../Hook/UseAxioSecure';
import Swal from 'sweetalert2';
import { TfiSearch } from "react-icons/tfi";
import { GoPlus } from "react-icons/go";
import Mpagination from "../../../components library/Mpagination";
import MtableLoading from "../../../components library/MtableLoading";
import Mtitle from "/src/components library/Mtitle";
import { AuthContext } from "../../../providers/AuthProvider";


const SenderID = () => {
  const axiosSecure = UseAxiosSecure();
  const {branch} = useContext(AuthContext);
  const [senderIDs, setSenderIDs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSenderID, setNewSenderID] = useState('');
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSenderIDs, setFilteredSenderIDs] = useState([]);

  useEffect(() => {
    fetchSenderIDs();
  }, []);

  const fetchSenderIDs = async () => {
    try {
      const response = await axiosSecure.get(`/senderids/${branch}/get-all`);
      setSenderIDs(response.data);
      setFilteredSenderIDs(response.data);
    } catch (error) {
      console.error('There was an error fetching the sender IDs!', error);
    }
  };

  const handleAddSenderID = async () => {
    if (editId) {
      // Update the sender ID
      try {
        await axiosSecure.put(`/senderids/put/${editId}`, { ID: newSenderID });
        fetchSenderIDs();
      } catch (error) {
        console.error('There was an error updating the sender ID!', error);
      }
      setEditId(null);
    } else {
      try {
        await axiosSecure.post('/senderids/post', { ID: newSenderID, branch });
        fetchSenderIDs();
      } catch (error) {
        console.error('There was an error adding the sender ID!', error);
      }
    }
    setNewSenderID('');
    setIsModalOpen(false);
  };

  const handleEdit = (id) => {
    const senderID = senderIDs.find(sid => sid._id === id);
    setEditId(id);
    setNewSenderID(senderID?.ID || '');
    setIsModalOpen(true);
  };

  const handleRemove = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/senderids/delete/${id}`)
          .then(() => {
            fetchSenderIDs();
            Swal.fire(
              'Deleted!',
              'The sender ID has been deleted.',
              'success'
            );
          })
          .catch(error => {
            console.error('There was an error deleting the sender ID!', error);
            Swal.fire(
              'Error!',
              'There was an error deleting the sender ID.',
              'error'
            );
          });
      }
    });
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    const filtered = senderIDs.filter(senderID =>
      senderID.ID.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSenderIDs(filtered);
  };

  const { paginatedData, paginationControls, rowsPerPageAndTotal } = Mpagination({ totalData: filteredSenderIDs });

  return (
    <div className="p-4 min-h-screen">
      <Mtitle title="Sender IDs" rightcontent={
        <div className='flex md:mt-0 mt-3 justify-between'>
          <div className="flex justify-end gap-4 items-center mb-4">
            {/* Search bar */}
            <div className='md:w-64 border shadow-sm py-2 px-3 bg-white rounded-xl'>
              <div className='flex items-center gap-2'>
                <TfiSearch className='text-2xl font-bold text-gray-500' />
                <input
                  type="text"
                  className='outline-none w-full'
                  placeholder='Search here'
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            {/* Add new button */}
            <div className="flex gap-2 cursor-pointer items-center bg-yellow-500 text-white py-2 px-4 rounded-xl shadow hover:bg-yellow-600 transition duration-300">
              <button
                onClick={() => setIsModalOpen(true)}
                className="font-semibold"
              >
                New
              </button>
              <GoPlus className="text-xl text-white" />
            </div>
          </div>
        </div>
      } ></Mtitle>

      <div className="text-sm md:text-base">
        {rowsPerPageAndTotal}
      </div>

      <section className="overflow-x-auto border shadow-sm rounded-xl p-4 pb- mt-5">
        <table className="table w-full">
          <thead className='bg-yellow-500'>
            <tr className="text-sm font-medium text-white text-left">
              <td className="p-3 rounded-l-xl">Sender IDs</td>
              <td className="p-3 rounded-r-xl text-right px-8">Action</td>
            </tr>
          </thead>
          <tbody>
  {paginatedData.length === 0 ? (
    <tr>
      <td colSpan="5" className="text-center py-4">
      
      </td>
    </tr>
  ) : (
    paginatedData.map((item, index) => (
      <tr key={index} className="hover:bg-slate-100 hover:rounded-xl">
        <td className="px-4 py-5">{item.ID}</td>
        <td className="py-5 px-6 text-lg flex justify-end space-x-4">
          <button
            onClick={() => handleEdit(item._id)}
            className="text-blue-500 hover:text-yellow-700 transition duration-150"
          >
            <FiEdit />
          </button>
          <button
            onClick={() => handleRemove(item._id)}
            className="text-red-500 hover:text-red-700 transition duration-150"
          >
            <FiTrash2 />
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>
        </table>
        <MtableLoading data={senderIDs}></MtableLoading>
        {paginationControls}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">{editId !== null ? 'Edit' : 'Add'} Sender ID</h2>
            <input
              type="text"
              value={newSenderID}
              onChange={(e) => setNewSenderID(e.target.value)}
              className="focus:border-yellow-400 appearance-none text-gray-700 text-base border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline mb-5"
              placeholder="Sender ID"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setNewSenderID('');
                  setEditId(null);
                }}
                className="bg-gray-500 text-white py-2 px-4 font-semibold hover:bg-gray-600 rounded-xl transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSenderID}
                className="bg-yellow-500 text-white py-2 px-4 font-semibold flex  items-center gap-1 hover:bg-yellow-700 rounded-xl transition duration-300"
              >
                {editId !== null ? 'Save' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SenderID;
