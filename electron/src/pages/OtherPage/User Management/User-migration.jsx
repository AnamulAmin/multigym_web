import React, { useContext, useState, useEffect } from "react";
import Mtitle from "../../../components library/Mtitle";
import { TfiSearch } from "react-icons/tfi";
import useGetFilterMemberData from "../../../Hook/GetMemberData/GetFilterMemberData/useGetFilterMemberData";
import Pagination from "../../../components/partial/Pagination/Pagination";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../Hook/UseAxioSecure";
import { AuthContext } from "../../../providers/AuthProvider";
import useGetCompanyData from "../../../Hook/GetCompanyData/useGetCompanyData";

const Usermigration = () => {
  const { branch } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const [nameCardPhone, setNameCardPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [userIdToSwitch, setUserIdToSwitch] = useState(null);
  const [Memberids, setMemberids] = useState(null);
  const axiosSecure = UseAxiosSecure();
  const otherbranch = useGetCompanyData();
  console.log(otherbranch.otherBranchesCount);

  const { members, refetch } = useGetFilterMemberData({
    currentPage,
    setTotalItems,
    nameCardPhone,
    setNameCardPhone,
    setLoading,
  });

  console.log(members);

  useEffect(() => {
    if (members) {
      setLoading(false);
    }
  }, [members]);

  const handleSearchChange = (e) => {
    setNameCardPhone(e.target.value);
  };

  const openModal = (member) => {
    setUserIdToSwitch(member._id);
    setShowModal(true);
    setMemberids(member.member_id);
    console.log(member);
  };

  const handleSwitchBranch = async () => {
    if (!selectedBranch) {
      Swal.fire("Error!", "Please select a branch.", "error");
      return;
    }
  
    // Save the original Member ID for comparison
    const checkId = Memberids;
  
    const userData = { branch: selectedBranch };
  
    // Confirm the branch transfer and verify the member ID
    const { value: memberIdInput } = await Swal.fire({
      title: "Confirm Branch Transfer",
      text: `Are you sure you want to transfer the user to branch "${selectedBranch}"?`,
      icon: "warning",
      input: "text",
      inputLabel: "Enter the Member ID to confirm",
      inputPlaceholder: "Type Member ID here...",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) {
          return "Member ID is required!";
        }
      },
    });
  
    // Check if the user input matches the original Member ID
    if (memberIdInput && memberIdInput === checkId) {
      try {
        await axiosSecure.put(`/users/put/${userIdToSwitch}`, userData);
        Swal.fire("Success!", "Branch has been updated.", "success");
        refetch();
        setShowModal(false);
      } catch (error) {
        Swal.fire("Error!", "There was a problem updating the branch.", "error");
      }
    } else if (memberIdInput) {
      Swal.fire("Error!", "Member ID does not match. Transfer canceled.", "error");
    }
  };
  

  return (
    <div>
      {/* Top div */}
      <div className="px-2">
        <Mtitle
          title="User Migration"
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
                      value={nameCardPhone}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>
                <div
                  className="flex md:gap-2 cursor-pointer items-center bg-yellow-500 text-white py-2 px-2 md:px-4 rounded-xl shadow hover:bg-yellow-600 transition duration-300"
                >
                  <button className="font-semibold text-xs md:text-base">Search</button>
                </div>
              </div>
            </div>
          }
        />
      </div>

      <div className="bg-white rounded-lg shadow-md">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
            <p className="ml-4 text-gray-500">Loading data...</p>
          </div>
        ) : members.length === 0 ? (
          <div className="flex justify-center items-center h-96">
            <p className="text-gray-500">No users found. Try refining your search.</p>
          </div>
        ) : (
          <table className="w-full table-auto">
            <thead className="bg-yellow-500 text-white text-sm font-semibold">
              <tr>
                <th className="p-4 text-left">Name & Department</th>
                <th className="p-4 text-left">Member ID</th>
                <th className="p-4 text-left">Contact No</th>
                <th className="p-4 text-left">Branch</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <tr key={index} className="hover:bg-yellow-50 transition">
                  <td className="px-4 py-3 flex items-center space-x-4">
                    <img
                      src={member.photourl}
                      alt={member.full_name}
                      className="w-10 h-10 rounded-full border border-gray-300"
                    />
                    <div>
                      <p className="font-semibold text-gray-700">{member.full_name}</p>
                      <p className="text-sm text-gray-500">{member.profession}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">{member.member_id}</td>
                  <td className="px-4 py-3">{member.contact_no}</td>
                  <td className="px-4 py-3">{member.branch}</td>
                  <td className="py-3 px-6 text-right">
                  <button
  onClick={() => openModal(member)}
  className="bg-yellow-500 text-white font-medium py-1 px-4 rounded-lg hover:bg-yellow-600 transition"
>
  Switch Branch
</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <Pagination
          totalItems={totalItems}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-80">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Select Branch</h2>
            <select
              className="w-full border border-gray-300 rounded p-2 mb-4"
              onChange={(e) => setSelectedBranch(e.target.value)}
              value={selectedBranch}
            >
              <option value="">Choose a branch</option>
              {otherbranch.otherBranchesCount.map((branch) => (
                <option key={branch.branch} value={branch.branch}>
                  {branch.name}
                </option>
              ))}
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSwitchBranch}
                className="px-4 py-2 bg-yellow-500 text-white rounded"
              >
                Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usermigration;
