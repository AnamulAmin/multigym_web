import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import Modal from "./../Setup/Modal";
import { GoPlus } from "react-icons/go";
import { TfiSearch } from "react-icons/tfi";
import { IoCloseOutline } from "react-icons/io5";
import { GoDotFill } from "react-icons/go";
import { RiDeleteBin2Line } from "react-icons/ri";
import { FiEdit3 } from "react-icons/fi";
import UseAxiosSecure from "../../../Hook/UseAxioSecure";
import Mpagination from "../../../components library/Mpagination";
import MtableLoading from "../../../components library/MtableLoading";
import Mtitle from "/src/components library/Mtitle";
import { AuthContext } from "../../../providers/AuthProvider";
import { Oval } from "react-loader-spinner";

const AddLocker = ({ isFilter = true }) => {
  // const branch = "gym-branch";
  const { branch } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();
  const [lockers, setLockers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editLockerId, setEditLockerId] = useState(null);

  const [formData, setFormData] = useState({
    lockerName: "",
    group: "",
    gender: "",
    member_id: "",
    status: "available",
    branch: branch,
  });

  useEffect(() => {
    axiosSecure
      .get(`/locker/${branch}/get-all/`)
      .then((response) => {
        setLockers(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the lockers!", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  function closeModal() {
    setIsOpen(false);
    setIsEditing(false);
    setFormData({
      lockerName: "",
      group: "",
      gender: "",
      member_id: "",
      status: "available",
      branch: branch,
    });
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    if (!formData.lockerName || !formData.group || !formData.gender) {
      Swal.fire({
        title: "Error!",
        text: "Please fill in all required fields!",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    setIsLoading(true);
    const axiosMethod = isEditing ? axiosSecure.put : axiosSecure.post;
    const url = isEditing ? `/locker/put/${editLockerId}` : "/locker/post";

    const { _id, ...payload } = formData;

    axiosMethod(url, payload)
      .then((response) => {
        if (isEditing) {
          setLockers(
            lockers.map((locker) =>
              locker._id === editLockerId ? response.data : locker
            )
          );
        } else {
          setLockers([...lockers, response.data]);
        }
        closeModal();
        Swal.fire({
          title: "Success!",
          text: `Locker ${isEditing ? "updated" : "added"} successfully!`,
          icon: "success",
          confirmButtonText: "OK",
        });
      })
      .catch((error) => {
        console.error(
          `There was an error ${isEditing ? "updating" : "adding"} the locker!`,
          error
        );
        Swal.fire({
          title: "Error!",
          text: "There was an error processing your request.",
          icon: "error",
          confirmButtonText: "OK",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleEdit = (id) => {
    axiosSecure
      .get(`/locker/get-id/${id}`)
      .then((response) => {
        setFormData(response.data);
        setIsEditing(true);
        setEditLockerId(id);
        openModal();
      })
      .catch((error) => {
        console.error("There was an error fetching the locker data!", error);
      });
  };

  const handleRemove = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#fda93c11",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/locker/delete/${id}`);
        const res = await axiosSecure.get(`/locker/${branch}/get-all/`);
        setLockers(res.data);
        Swal.fire("Deleted!", "Your locker has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting locker :", error);
        Swal.fire("Error!", "There was an error deleting the locker.", "error");
      }
    }
  };

  const { paginatedData, paginationControls, rowsPerPageAndTotal } =
    Mpagination({ totalData: lockers });

  return (
    <div className="p-4">
      {isFilter && (
        <Mtitle
          title="Lockers"
          rightcontent={
            <div className="flex justify-between">
              <div className="flex justify-end gap-4 items-center">
                <div className="w-64 border shadow-sm py-2 px-3 bg-white rounded-xl">
                  <div className="flex items-center gap-2">
                    <TfiSearch className="text-2xl font-bold text-gray-500" />
                    <input
                      type="text"
                      className="outline-none  w-full "
                      placeholder="Search locker"
                    />
                  </div>
                </div>
                <div className="flex gap-2 cursor-pointer items-center bg-yellow-500 text-white py-2 px-4 rounded-xl shadow hover:bg-yellow-600 transition duration-300">
                  <button onClick={openModal} className="font-semibold">
                    Add New
                  </button>
                  <GoPlus className="text-xl text-white" />
                </div>
              </div>
            </div>
          }
        />
      )}

      {rowsPerPageAndTotal}

      <div className="overflow-x-auto border shadow-sm rounded-xl p-4 mt-5">
        <table className="table w-full">
          <thead className="bg-yellow-500">
            <tr className="text-sm font-medium text-white text-left">
              <td className="p-3 rounded-l-xl">Locker Name</td>
              <td className="p-3">Group</td>
              <td className="p-3">Gender</td>
              <td className="p-3">Status</td>
              <td className="p-3">Action</td>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((locker, index) => (
              <tr key={index} className="hover:bg-slate-100 hover:rounded-xl">
                <td className="px-4 py-3">{locker.lockerName}</td>
                <td className="px-4 py-3">{locker.group}</td>
                <td className="px-4 py-3">{locker.gender}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <GoDotFill
                      className={`text-xs ${
                        locker.status === "available"
                          ? "text-green-500"
                          : "text-[#f70000e0]"
                      }`}
                    />
                    <span className="first-letter:uppercase">
                      {locker.status}
                    </span>
                  </div>
                </td>
                <td className="flex gap-3 text-base">
                  <button
                    onClick={() => handleEdit(locker._id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FiEdit3 />
                  </button>
                  <button
                    onClick={() => handleRemove(locker._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <RiDeleteBin2Line />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <MtableLoading data={lockers}></MtableLoading>
        {paginationControls}
      </div>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-medium leading-6 text-gray-900">
            {isEditing ? "Edit Locker" : "Add New Locker"}
          </h3>
          <div className="flex justify-end">
            <button onClick={closeModal} className="transition duration-300">
              <IoCloseOutline className="text-xl text-gray-400" />
            </button>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Fill in the details for the {isEditing ? "editing" : "new"} locker.
          </p>
          <form className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Locker Name
              </label>
              <input
                type="text"
                name="lockerName"
                value={formData.lockerName}
                onChange={handleChange}
                className="focus:border-yellow-500 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full py-3 px-3"
              />
            </div>
            <div className="w-full">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Group
              </label>
              <select
                name="group"
                value={formData.group}
                onChange={handleChange}
                className="focus:border-yellow-500 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full py-3 px-3"
              >
                <option value="">Select Group</option>
                <option value="Premium">Premium</option>
                <option value="Standard">Standard</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
            <div className="w-full">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="focus:border-yellow-500 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full py-3 px-3"
              >
                <option value="">Select Gender</option>
                <option value="Gents">Gents</option>
                <option value="Female">Female</option>
                <option value="Common">Common</option>
              </select>
            </div>
            <div className="flex gap-4">
              <div className="w-full">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Member ID (if assigned)
                </label>
                <input
                  type="text"
                  name="member_id"
                  value={formData.member_id}
                  onChange={handleChange}
                  className="focus:border-yellow-500 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full py-3 px-3"
                />
              </div>
              <div className="w-full">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="focus:border-yellow-500 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full py-3 px-3"
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="reserved">Reserved</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="bg-yellow-500 text-white py-2 px-4 font-semibold hover:bg-yellow-600 rounded-xl transition duration-300"
                onClick={() => handleSubmit(formData)}
                disabled={isLoading}
              >
                {isLoading && (
                  <Oval
                    visible={true}
                    height="15"
                    width="15"
                    color="#000"
                    ariaLabel="oval-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                )}
                Save
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default AddLocker;
