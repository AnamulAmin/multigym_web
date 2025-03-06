import React, { useState, useEffect, useContext } from "react";
import { TfiSearch } from "react-icons/tfi";
import { MdFollowTheSigns } from "react-icons/md";
import axios from "axios";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import { AuthContext } from "../../../providers/AuthProvider";
import Mtitle from "/src/components library/Mtitle";
import UseAxiosSecure from "../../../Hook/UseAxioSecure";

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const FollowUpScheduling = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAllFollowUpsModalOpen, setIsAllFollowUpsModalOpen] = useState(false);
  const [allFollowUps, setAllFollowUps] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("expired");
  const [daysFilter, setDaysFilter] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const axiosSecure = UseAxiosSecure();
  const [formData, setFormData] = useState({
    date: getTodayDate(),
    description: "",
    nextFollowUpDate: "",
    status: "Pending",
  });
  const { branch } = useContext(AuthContext);

  const fetchData = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await axiosSecure.get(
        `/users/users-with-followups/${branch}`,
        {
          params: {
            page,
            status: statusFilter,
            days: daysFilter,
            search: searchTerm,
          },
        }
      );
      setData(response.data.data);
      setTotalPages(response.data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, statusFilter, daysFilter, searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
    fetchData(1);
  };

  const handleDaysChange = (event) => {
    setDaysFilter(event.target.value);
    setCurrentPage(1);
    fetchData(1);
  };

  const handleFollowUpClick = (userId) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleViewAllFollowUpsClick = async (userId) => {
    try {
      const response = await axiosSecure.get(`/followup/user/${userId}`);
      setAllFollowUps(response.data);
      console.log(response.data);
      setSelectedUserId(userId);
      setIsAllFollowUpsModalOpen(true);
    } catch (error) {
      console.error("Error fetching all follow-ups", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const response = await axiosSecure.post("/followup", {
        userId: selectedUserId,
        followUp: [{ date: formData.date, description: formData.description }],
        nextFollowUpDate: formData.nextFollowUpDate,
        status: formData.status,
        branch: branch,
      });
      console.log(response.data.message);
      setIsModalOpen(false);
      fetchData(currentPage);
      setBtnLoading(false);
    } catch (error) {
      console.error("Error creating follow-up", error);
      setBtnLoading(false);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="p-4">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Mtitle title="Follow-Up Tasks" />
          <div className="flex justify-between mt-3">
            <div className="flex gap-4 items-center">
              <div className="border shadow-sm py-2 px-3 bg-white rounded-xl">
                <div className="flex items-center gap-2">
                  <TfiSearch className="text-2xl text-gray-500" />
                  <input
                    type="text"
                    className="outline-none w-full"
                    placeholder="Search by name, contact, or email"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <select
              className="border rounded-lg p-2"
              value={statusFilter}
              onChange={handleStatusChange}
            >
              <option value="active">Active</option>
              <option value="expired">Expire</option>
            </select>

            <select
              className="border rounded-lg p-2"
              value={daysFilter}
              onChange={handleDaysChange}
            >
              <option value="1">1 Day</option>
              <option value="3">3 Days</option>
              <option value="7">7 Days</option>
              <option value="10">10 Days</option>
              <option value="15">15 Days</option>
              <option value="30">30 Days</option>
              <option value="45">45 Days</option>
              <option value="60">60 Days</option>
              <option value="90">90+ Days</option>
            </select>
          </div>

          <div className="overflow-hidden shadow-lg rounded-2xl bg-white mt-5">
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="bg-yellow-500 text-white text-sm">
                  <tr>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Contact</th>
                    <th className="px-6 py-3 text-left">Member ID</th>
                    <th className="px-6 py-3 text-left">Gender</th>
                    <th className="px-6 py-3 text-left">
                      {statusFilter === "active"
                        ? "Days Until Expiration"
                        : "Inactive Days"}
                    </th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((user) => {
                    const latestFollowUp =
                      user.followUps[0]?.followUp?.[
                        user.followUps[0].followUp.length - 1
                      ] || {};
                    return (
                      <React.Fragment key={user._id}>
                        <tr className="hover:bg-gray-50 transition-all border-b border-gray-200">
                          <td className="px-6 py-4">{user.full_name}</td>
                          <td className="px-6 py-4">{user.contact_no}</td>
                          <td className="px-6 py-4">{user.member_id}</td>
                          <td className="px-6 py-4">{user.gender}</td>
                          <td className="px-6 py-4">
                            {user.daysUntilExpiration}
                          </td>
                          <td className="px-6 py-4">
                            {user.followUps[0]?.status || "N/A"}
                          </td>
                          <td className="flex gap-3 px-6 py-4">
                            <button
                              onClick={() => handleFollowUpClick(user._id)}
                              className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow transition duration-200"
                            >
                              Follow Up
                            </button>
                            <button
                              onClick={() =>
                                handleViewAllFollowUpsClick(user._id)
                              }
                              className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow transition duration-200"
                            >
                              View Follow-Ups
                            </button>
                          </td>
                        </tr>

                        <tr className="hover:bg-gray-50 transition-all border-b border-gray-200">
                          <td
                            colSpan="7"
                            className="px-6 py-4 text-sm text-gray-600 bg-gray-50 rounded-b-2xl"
                          >
                            <div className="flex justify-between">
                              <div className="w-2/3">
                                <strong>Last Follow-Up Description:</strong>{" "}
                                {latestFollowUp.description || "N/A"}
                              </div>
                              <div className="text-right">
                                <strong>Last Follow-Up Date:</strong>{" "}
                                {latestFollowUp.date || "N/A"}
                              </div>
                              <div className="text-right">
                                <strong>Next Follow-Up Date:</strong>{" "}
                                {user.followUps[0]?.nextFollowUpDate || "N/A"}
                              </div>
                            </div>
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4 mb-5">
              <button
                onClick={() => setCurrentPage(1)}
                className={`px-4 py-2 mx-1 rounded-lg ${
                  currentPage === 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                1
              </button>
              {currentPage > 3 && <span className="px-4 py-2 mx-1">...</span>}
              {Array.from({ length: 3 }, (_, index) => {
                const pageNumber = currentPage - 1 + index;
                if (pageNumber > 1 && pageNumber < totalPages) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-4 py-2 mx-1 rounded-lg ${
                        currentPage === pageNumber
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 text-gray-700"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                }
                return null;
              })}
              {currentPage < totalPages - 2 && (
                <span className="px-4 py-2 mx-1">...</span>
              )}
              {totalPages > 1 && (
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`px-4 py-2 mx-1 rounded-lg ${
                    currentPage === totalPages
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {totalPages}
                </button>
              )}
            </div>
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white rounded-lg p-8 shadow-lg w-1/2">
                <h2 className="text-xl font-semibold mb-4">Follow-Up Form</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block mb-2">Follow-Up Date:</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="border p-2 w-full rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2">Description:</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      className="border p-2 w-full rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2">Next Follow-Up Date:</label>
                    <input
                      type="date"
                      name="nextFollowUpDate"
                      value={formData.nextFollowUpDate}
                      onChange={handleChange}
                      required
                      className="border p-2 w-full rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2">Status:</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                      className="border p-2 w-full rounded"
                    >
                      <option value="Join">Join</option>
                      <option value="Rejoin">Rejoin</option>
                      <option value="End">End</option>
                      <option value="Pending">Pending</option>
                      <option value="Scheduled">Scheduled</option>
                    </select>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-3"
                      disabled={btnLoading}
                    >
                      {btnLoading && (
                        <span
                          className="spinner-border spinner-border-sm mr-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      )}
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {isAllFollowUpsModalOpen && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white rounded-lg p-8 shadow-lg w-1/2 max-h-96 overflow-y-auto relative">
                <h2 className="text-xl font-semibold mb-4">All Follow-Ups</h2>

                <ul>
                  {allFollowUps.length > 0 ? (
                    <>
                      <p>
                        <strong>Next Follow-Up Date:</strong>{" "}
                        {new Date(
                          allFollowUps[0].nextFollowUpDate
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p>
                        <strong>Status:</strong> {allFollowUps[0].status}
                      </p>
                      {allFollowUps[0].followUp.map((followUp, index) => (
                        <li
                          key={index}
                          className="border-b border-gray-300 py-2"
                        >
                          <p>
                            <strong>Date:</strong>{" "}
                            {new Date(followUp.date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                          <p>
                            <strong>Description:</strong> {followUp.description}
                          </p>
                        </li>
                      ))}
                    </>
                  ) : (
                    <p>No follow-ups available</p>
                  )}
                </ul>

                {/* Close Button */}
                <button
                  onClick={() => setIsAllFollowUpsModalOpen(false)}
                  className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FollowUpScheduling;
