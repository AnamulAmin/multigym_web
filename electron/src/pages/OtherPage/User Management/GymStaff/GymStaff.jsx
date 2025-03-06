import { useContext, useEffect, useState } from "react";
import Modal from "../../../../components/partial/Modal/Modal";
import UseAxiosSecure from "../../../../Hook/UseAxioSecure";
import EditStaff from "./EditStaff/EditStaff";
import Mpagination from "../../../../components library/Mpagination";
import Swal from "sweetalert2";
import { FaIdBadge, FaUser, FaKey, FaPhone, FaUserShield } from "react-icons/fa";
import { MdSettings } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import MtableLoading from "../../../../components library/MtableLoading";
import { TfiSearch } from "react-icons/tfi";
import FormGroup from "../../../../components/partial/Headers/FilterHeader/FormGroup/FormGroup";
import { MdOutlineSms } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit3 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { CiCreditCard2 } from "react-icons/ci";
import AddStaff from "./AddStuff/AddStaff";
import { AuthContext } from "../../../../providers/AuthProvider";
import GenerateCredentials from "../../../../Hook/GenerateCredentials";

const GymStaff = () => {
  const [isShowAddStuff, setIsShowAddStaff] = useState(false);
  const [isShowEditStuff, setIsShowEditStaff] = useState(false);
  const [members, setMembers] = useState([]);
  const [userId, setUserId] = useState("");
  const [search, setSearch] = useState("");
  const [isDeleteMember, setIsDeleteMember] = useState(false);
  const [isGridView, setIsGridView] = useState(false); // New state to track view mode

  const axiosSecure = UseAxiosSecure();
  const { branch,user } = useContext(AuthContext);
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axiosSecure.get(
          `/users/get-staffs?branch=${branch}&search=${search}`
        );
        setMembers(res?.data);
      } catch (error) {
        console.error("Error fetching staff data:", error);
      }
    }
    fetchData();
  }, [axiosSecure, search, isShowEditStuff, isShowAddStuff, isDeleteMember]);

  const debounceFunction = (e) => {
    const inputValue = e.target.value;
    clearTimeout(debounceFunction.timeout);
    debounceFunction.timeout = setTimeout(() => {
      setSearch(inputValue);
    }, 300);
  };

  const handleMemberDelete = async (id) => {
    try {
      Swal.fire({
        title: "Are you sure you want to delete this staff?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await axiosSecure.delete(`/users/delete/${id}`);
            if (res.status === 200 || res.status === 201) { 
              Swal.fire("Deleted!", res.data.message, "success");
              setIsDeleteMember((prev) => !prev); 
            } else {
              Swal.fire("Error!", "Failed to delete the member.", "error");
            }
          } catch (error) {
            Swal.fire("Error!", "There was an error deleting the member.", "error");
            console.error("Deletion Error:", error);
          }
        }
      });
    } catch (error) {
      Swal.fire("Error!", "Failed to delete the member.", "error");
      console.error("Error during member deletion", error);
    }
  };

  const { paginatedData, paginationControls, rowsPerPageAndTotal } =
    Mpagination({ totalData: members });

  return (
    <div className="p-4">
      <div className="flex md:flex-row flex-col justify-between">
        <h2 className="text-2xl font-semibold md:text-left text-center mb-3 md:mb-0">Gym Staff</h2>
        <div className="flex justify-end gap-4 items-center mb-4">
          <div className="w-64 border shadow-sm py-2 px-3 bg-white rounded-xl">
            <div className="flex items-center gap-2">
              <TfiSearch className="text-2xl font-bold text-gray-500" />
              <FormGroup
                className="outline-none w-full"
                colSpan={2}
                placeholder={"Search"}
                maxLength={50}
                type={"text"}
                onChange={debounceFunction}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 cursor-pointer  bg-gray-700 text-white py-2 px-4 rounded-xl shadow hover:bg-gray-800 transition duration-300">
            <button
              onClick={() => setIsShowAddStaff(true)}
              className="font-semibold"
            >
              Add New
            </button>
            <GoPlus className="text-xl text-white" />
          </div>
          <button
            onClick={() => setIsGridView(!isGridView)} // Toggle between list and grid view
            className="bg-yellow-500 text-white py-2 px-4 rounded-xl shadow hover:bg-blue-600 transition duration-300"
          >
            {isGridView ? "Show List" : "Show Grid"}
          </button>
        </div>
      </div>

      <div className="text-gray-500 text-sm md:text-base">{rowsPerPageAndTotal}</div>

      {!isGridView ? (
        // Render List View
        <section className="overflow-x-auto border rounded-2xl mt-5">
          <table className="table w-full">
            <thead className="bg-yellow-500">
              <tr className="text-sm font-medium text-white text-left">
                <td className="p-3 rounded-tl-xl">Employee ID</td>
                <td className="p-3">Name</td>
                <td className="p-3">Password</td>
                <td className="p-3">Phone</td>
                <td className="p-3">Role</td>
                
                <td className="p-3 rounded-tr-xl">Action</td>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index} className="hover:bg-slate-100 py-2 hover:rounded-xl">
                  <td className="px-4 text-xs md:text-base py-5">{item.member_id}</td>
                  <td className="md:px-4 md:py-5 flex items-center gap-3">
                    <div>
                      <img
                        src={item.photourl || "https://multigympremium.com/uploads/nophoto.png"}
                        className="md:w-14 md:h-14 hidden md:block md:rounded-full"
                        alt="staff member"
                      />
                    </div>
                    <div>
                      <p className="md:font-medium text-xs md:text-base">{item.full_name}</p>
                      <p className="text-sm">{item.gender} ({item?.blood_group})</p>
                    </div>
                  </td>
                  <td className="font-normal md:text-base text-xs">
        <h5>{item?.email}</h5>
        {item.email && <GenerateCredentials email={item.email} />}
      </td>
                  <td className="px-4 py-5">
                    <p className="text-xs md:text-base">{item.contact_no}</p>
                  </td>
                  <td className="px-4 text-xs md:text-sm py-5">
                    <p className="border max-w-max rounded-2xl py-1 border-gray-300 px-2">
                      {item.role}
                    </p>
                  </td>
                  {/* <td className="px-4 text-sm md:text-base py-5">
                    <p className="flex items-center gap-2">
                      <CiCreditCard2 className="text-xl" />
                      <span className="hover:underline text-xs md:text-base">{item.card_no}</span>
                    </p>
                  </td> */}
                  <td className="px-4 py-5 text-xl">
                    <div className="flex text-xl items-center gap-2">
                      <button className="flex items-center hover:text-gray-700 transition-all duration-500 mt-1 gap-3 text-gray-600 flex-row-reverse">
                        <MdOutlineSms />
                      </button>
                      <button
                        onClick={() => {
                          setIsShowEditStaff(true);
                          setUserId(item?._id);
                        }}
                        className="flex hover:text-blue-500 transition-all duration-500 items-center gap-3 text-gray-600 flex-row-reverse"
                      >
                        <FiEdit3 />
                      </button>
                      {user.role === "admin" && (
                        <button
                          onClick={() => handleMemberDelete(item._id)}
                          className="flex hover:text-red-500 transition-all duration-500 items-center gap-3 text-gray-600 flex-row-reverse"
                        >
                          <AiOutlineDelete />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <MtableLoading data={members} />
        </section>
      ) : (
        // Render Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
          {paginatedData.map((member, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-md p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
            >
              <img
                src={member.photourl || "https://multigympremium.com/uploads/nophoto.png"}
                alt={`${member.full_name}`}
                className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
              />
              <h3 className="text-lg font-bold text-center">{member.full_name} ({member.role})</h3>
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-semibold">Gender:</span> {member.gender}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                <span className="font-semibold">Email:</span> {member.email}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                <span className="font-semibold">Phone:</span> {member.contact_no}
              </p>
              <div className="flex justify-center mt-4 gap-4">
                <button className="text-gray-600 hover:text-blue-500 transition-all duration-500">
                  <MdOutlineSms />
                </button>
                <button
                  onClick={() => {
                    setIsShowEditStaff(true);
                    setUserId(member?._id);
                  }}
                  className="text-gray-600 hover:text-blue-500 transition-all duration-500"
                >
                  <FiEdit3 />
                </button>
                {user.role === "admin" && (
                  <button
                    onClick={() => handleMemberDelete(member._id)}
                    className="text-gray-600 hover:text-red-500 transition-all duration-500"
                  >
                    <AiOutlineDelete />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {paginationControls}

      <Modal isShowModal={isShowAddStuff} setIsShowModal={setIsShowAddStaff}>
        <AddStaff setIsShow={setIsShowAddStaff} isShow={isShowAddStuff} />
      </Modal>
      <Modal isShowModal={isShowEditStuff} setIsShowModal={setIsShowEditStaff}>
        <EditStaff
          setIsShow={setIsShowEditStaff}
          isShow={isShowEditStuff}
          user_id={userId}
          setUserId={setUserId}
        />
      </Modal>
    </div>
  );
};

export default GymStaff;
