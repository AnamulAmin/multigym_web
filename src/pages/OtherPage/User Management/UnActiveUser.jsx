import React, { useState, useEffect, useContext, useCallback } from "react";
import Swal from "sweetalert2";
import DashboardTitle from "../../../components/partial/DashboardTitle/Title";
import { TfiSearch } from "react-icons/tfi";
import UseAxiosSecure from "../../../Hook/UseAxioSecure";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import Mtitle from "/src/components library/Mtitle";
import { AuthContext } from "../../../providers/AuthProvider";
import Modal from "../../../components/partial/Modal/Modal";
import EditMember from "../../../components/partial/MemberRegistration/EditMember/EditMember";
import AddPackageForm from "./AddPackage/AddPackageForm/AddPackageForm";
import { useReactToPrint } from "react-to-print";
import PrintModal from "../../../components/partial/Modal/PrintModal/PrintModal";
import PrintTemplate from "../../../config/PrintTemplate/PrintTemplate";
import A4PrintTemplate from "../../../config/PrintTemplate/A4PrintTemplate/A4PrintTemplate";
const UnActiveUser = () => {
  const { branch } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  // setIsShow, isShow, user_id, setUserId 
  const [isShowAddPackage, setIsShowAddPackage] = useState(false);
  const [resetFields, setResetFields] = useState(0);
  const [isShowPrint, setIsShowPrint] = useState(false);
  const [printData, setPrintData] = useState(null);
  const [printType, setPrintType] = useState("");

  const [isShowEditMember, setIsShowEditMember] = useState(false);
  const [user_id, setUserId] = useState("");
  
  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchQuery]);

  const fetchUsers = () => {
    setIsLoading(true);
    axiosSecure
      .get(`/users/inactive-users-search?branch=${branch}`, {
        params: {
          branch,
          search: searchQuery,
          currentPage,
          limit: itemsPerPage,
        },
      })
      .then((response) => {
        setUsers(response.data.data);
        setTotalPages(Math.ceil(response.data.totalItems / itemsPerPage));
      })
      .catch((error) => {
        console.error("Error fetching inactive users:", error);
        Swal.fire("Error", "Failed to fetch inactive users", "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleActivate = (id) => {
    setUserId(id);
    setIsShowEditMember(true);
  };

  const handleGetPrintData = async (id, print_type) => {
    console.log("id", id, "print_type", print_type);
    try {
      const res = await axiosSecure.get(`/invoice/get-id/${id}?branch=${branch}`);
      if (res.status === 200) {
        if (print_type === "" || print_type === undefined) {
          setPrintType(printType);
        } else {
          setPrintType(print_type);
        }
        setIsShowPrint(true);
        setPrintData(res.data);
        console.log("res.data", res.data);
      } else {
        Swal.fire({
          title: "Error!",
          text: res.data.message || "Failed to get Data.",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to get Data.",
        icon: "error",
      });
    }
  };
  const resetPrintData = () => {
    setIsShowPrint(false);
    setPrintData(null);
    setPrintType("");
  };

  const handleA4Print = useReactToPrint({
    content: () => document.getElementById("A4-print-template"),
  });
  const handleThermalPrint = useReactToPrint({
    content: () => document.getElementById("print-template"),
  });

  const handlePrint = useCallback(() => {
    if (printType === "thermal" && printData) {
      handleThermalPrint();
      console.log("handleThermalPrint");
    } else if (printType === "A4Print" && printData) {
      handleA4Print();
      console.log("handleA4Print");
    }
  }, [printType, printData, handleThermalPrint, handleA4Print]);

  const handleDelete = async userId => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to get the user",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete user!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const deleteUser = await axiosSecure.delete(`users/delete/${userId}`);
          console.log(deleteUser);
          fetchUsers();
          Swal.fire({
            title: "Deleted!",
            text: "User has been deleted.",
            icon: "success"
          });
        } catch (error) {
          console.log(error)
        }
      }
    });
  };

  return (
    <div className="p-4">
      <Mtitle title="Inactive Users" rightcontent={
        <div className="flex justify-end gap-4 items-center my-4">
          <div className="w-64 border shadow-sm py-2 px-3 bg-white rounded-xl">
            <div className="flex items-center gap-2">
              <TfiSearch className="text-2xl font-bold text-gray-500" />
              <input
                type="text"
                className="outline-none w-full"
                placeholder="Search by name, email, or phone"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
      }></Mtitle>

      {/* Search Bar */}


      {/* Total Users Display */}
      <div className="mb-4">
        <span className="text-gray-700 text-sm md:text-base md:font-semibold">
          Showing {users.length} users
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border shadow-sm rounded-xl p-4 mt-5">
        <table className="table w-full">
          <thead className="bg-yellow-500">
            <tr className="text-sm font-medium text-white text-left">
              <td className="p-3 rounded-l-xl">Name</td>
              <td className="p-3">Email</td>
              <td className="p-3">Phone</td>
              <td className="p-3">Card No</td>
              <td className="p-3 rounded-r-xl">Actions</td>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="text-center py-28">
                  <div className="flex justify-center items-center">
                    <span className="loading loading-spinner loading-lg text-yellow-500"></span>
                  </div>
                  <p className="mt-4 text-gray-500">Loading data...</p>
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={index} className="hover:bg-slate-100 hover:rounded-xl text-sm md:text-sm">
                  <td className="px-4 py-3">{user.full_name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.contact_no}</td>
                  <td className="px-4 py-3">{user.card_no || "N/A"}</td>
                  <td className="px-4 py-3 flex">
                    <button
                      onClick={() => handleActivate(user._id)}
                      className="md:px-4 md:py-2 px-2 py-1 font-semibold bg-green-500 text-white rounded-md mr-2"
                    >
                      Activate
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="md:px-4 md:py-2 px-2 py-1 font-semibold bg-red-500 text-white rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`md:py-2 md:px-4 font-semibold py-1 px-2 rounded-lg ${currentPage === 1 ? "bg-gray-200" : "bg-yellow-500 text-white hover:bg-yellow-600"}`}
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`md:py-2 md:px-4 font-semibold py-1 px-2 rounded-lg ${currentPage === totalPages ? "bg-gray-200" : "bg-yellow-500 text-white hover:bg-yellow-600"}`}
          >
            Next
          </button>
        </div>
      </div>

      <Modal
        isShowModal={isShowEditMember}
        setIsShowModal={setIsShowEditMember}
      >
        <EditMember
          isActiveUserPage={true}
          reFetch={fetchUsers}
          setIsShow={setIsShowEditMember}
          isShow={isShowEditMember}
          user_id={user_id}
          setUserId={setUserId}
          setIsShowAddPackage={setIsShowAddPackage}
        />
      </Modal>
      <Modal
        isShowModal={isShowAddPackage}
        setIsShowModal={setIsShowAddPackage}
      >
        <AddPackageForm
          setIsShow={setIsShowAddPackage}
          isShow={isShowAddPackage}
          userId={user_id}
          setIsShowPrint={setIsShowPrint}
          setPrintData={setPrintData}
          setPrintType={setPrintType}
          printData={printData}
          handleGetPrintData={handleGetPrintData}
        ></AddPackageForm>
      </Modal>

      <PrintModal
        isShowModal={printType === "thermal" && printData}
        setIsShowModal={setPrintType}
        resetPrintData={resetPrintData}
        handlePrint={handlePrint}
      >
        <PrintTemplate data={printData} handlePrint={handleThermalPrint} />
      </PrintModal>
      <PrintModal
        isShowModal={printType === "A4Print" && printData}
        setIsShowModal={setPrintType}
        resetPrintData={resetPrintData}
        handlePrint={handlePrint}
      >
        <A4PrintTemplate data={printData} handlePrint={handleA4Print} />
      </PrintModal>
    </div>
  );
};

export default UnActiveUser;
