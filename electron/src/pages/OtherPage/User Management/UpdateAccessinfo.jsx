import React, { useContext, useState, useEffect } from "react";
import Mtitle from "../../../components library/Mtitle";
import { TfiSearch } from "react-icons/tfi";
import useGetFilterMemberData from "../../../Hook/GetMemberData/GetFilterMemberData/useGetFilterMemberData";
import Pagination from "../../../components/partial/Pagination/Pagination";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../Hook/UseAxioSecure";
import { AuthContext } from "../../../providers/AuthProvider";
import UpdateAccessModal from "./Modal/UpdateAccessModal";

const UpdateAccessinfo = () => {
  const { branch } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [memberId, setMemberId] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const axiosSecure = UseAxiosSecure();
  const [selected, setSelected] = useState("");
  const [nameCardPhone, setNameCardPhone] = useState("");

  const { members, refetch } = useGetFilterMemberData({
    currentPage,
    setTotalItems,
    name,
    phone,
    member_id: memberId,
    nameCardPhone,
    setLoading,
  });

  useEffect(() => {
    if (members) {
      setLoading(false);
    }
  }, [members]);

  // Debounced search function to delay execution


  const handleSearchChange = (e) => {
    const value = e.target.value;
    setMemberId(value);

  };



  const handleUpdateAccess = (member) => {
    setSelectedMember(member);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMember(null);
  };

  return (
    <div>
      {/* Top div */}
      <div className="px-2">
        <Mtitle
          title="User Access Information"
          rightcontent={
            <div className="flex mt-3 md:mt-0 justify-between">
              <div className="flex justify-end gap-4 items-center md:mb-4">
                <div className="md:w-64 border shadow-sm py-2 px-3 bg-white rounded-xl">
                  <div className="flex items-center gap-2">
                    <TfiSearch className="text-2xl font-bold text-gray-500" />
                    <input
                      type="text"
                      className="outline-none w-full"
                      placeholder="Search a user"
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>
                <div className="flex md:gap-2 cursor-pointer items-center bg-yellow-500 text-white py-2 px-2 md:px-4 rounded-xl shadow hover:bg-yellow-600 transition duration-300">
                  <button className="font-semibold text-xs md:text-base">Search</button>
                </div>
              </div>
            </div>
          }
        />
      </div>

      {/* Table part */}
      <div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
            <p className="ml-4">Loading data...</p>
          </div>
        ) : members.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-96">
            <p className="text-gray-500 text-base md:text-base">No users found. Try refining your search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border shadow-sm rounded-xl p-4 mt-5">
            <table className="table w-full">
              <thead className="bg-yellow-500">
                <tr className="text-sm font-medium text-white text-left">
                  <th className="p-3">Name</th>
                  <th className="p-3">Contact No</th>
                  <th className="p-3">Member ID</th>
                  <th className="p-3">Profession</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member._id} className="hover:bg-slate-100 hover:rounded-xl">
                    <td className="px-4 py-3">{member.full_name}</td>
                    <td className="px-4 py-3">{member.contact_no}</td>
                    <td className="px-4 py-3">{member.member_id}</td>
                    <td className="px-4 py-3">{member.profession}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleUpdateAccess(member)}
                        className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 mr-2"
                      >
                        Update Access
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination totalItems={totalItems} setCurrentPage={setCurrentPage} currentPage={currentPage} />
      </div>

      {/* Update Access Modal */}
      {modalOpen && (
        <UpdateAccessModal
          member={selectedMember}
          closeModal={closeModal}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default UpdateAccessinfo;
