import React, { useEffect, useState } from "react";
import axios from "axios";
import { GoDotFill } from "react-icons/go";
import UseAxiosSecure from "../../../Hook/UseAxioSecure";
import { Oval } from "react-loader-spinner";

const FeedbackSurveys = () => {
  const [followUps, setFollowUps] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAllFollowUpsModalOpen, setIsAllFollowUpsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    description: "",
    nextFollowUpDate: "",
    status: "Pending",
  });
  const [allFollowUps, setAllFollowUps] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const axiosSecure = UseAxiosSecure();

  useEffect(() => {
    const fetchFollowUps = async () => {
      try {
        const response = await axiosSecure.get("/followup/date/today");
        setFollowUps(response.data);
      } catch (error) {
        console.error("Error fetching follow-up data:", error);
      }
    };
    fetchFollowUps();
  }, []);

  const handleFollowUpClick = (userId) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const handleViewAllFollowUpsClick = async (userId) => {
    try {
      const response = await axiosSecure.get(`/followup/user/${userId}`);
      setAllFollowUps(response.data);
      setSelectedUserId(userId);
      setIsAllFollowUpsModalOpen(true);
    } catch (error) {
      console.error("Error fetching all follow-ups", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(false);
    try {
      const response = await axiosSecure.post("/followup", {
        userId: selectedUserId,
        followUp: [{ date: formData.date, description: formData.description }],
        nextFollowUpDate: formData.nextFollowUpDate,
        status: formData.status,
      });
      console.log(response.data.message);
      setIsModalOpen(false);
      setLoading(false);
    } catch (error) {
      console.error("Error creating follow-up", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Today’s Follow-Up</h2>
      <div className="overflow-x-auto border shadow-sm rounded-xl p-4 mt-5">
        <table className="table w-full">
          <thead className="bg-yellow-500">
            <tr className="text-sm font-medium text-white text-left">
              <td className="p-3 rounded-l-xl">Name</td>
              <td className="p-3">Contact No</td>
              <td className="p-3">Email</td>
              <td className="p-3">Member ID</td>
              <td className="p-3">Status</td>
              <td className="p-3">Follow-Up Details</td>
              <td className="p-3 rounded-r-xl">Actions</td>
            </tr>
          </thead>
          <tbody>
            {followUps.map((followUp) => (
              <tr
                key={followUp._id}
                className="hover:bg-slate-100 hover:rounded-xl"
              >
                <td className="px-4 py-3">{followUp.userId.full_name}</td>
                <td className="px-4 py-3">{followUp.userId.contact_no}</td>
                <td className="px-4 py-3">{followUp.userId.email || "N/A"}</td>
                <td className="px-4 py-3">
                  {followUp.userId.member_id || "N/A"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <GoDotFill
                      className={`text-xs ${
                        followUp.status === "inactive"
                          ? "text-[#f70000e0]"
                          : "text-green-500"
                      }`}
                    />
                    <span className="first-letter:uppercase">
                      {followUp.status}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <ul>
                    {followUp.followUp.map((item) => (
                      <li key={item._id} className="mb-2">
                        <strong>Date:</strong>{" "}
                        {new Date(item.date).toLocaleDateString()} <br />
                        <strong>Description:</strong> {item.description}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="flex gap-3 text-base my-4">
                  <button
                    onClick={() => handleFollowUpClick(followUp.userId._id)}
                    className="bg-blue-500 text-white px-4 py-1 rounded mr-2"
                  >
                    Follow up now
                  </button>
                  <button
                    onClick={() =>
                      handleViewAllFollowUpsClick(followUp.userId._id)
                    }
                    className="bg-green-500 text-white px-4 py-1 rounded"
                  >
                    View all
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
                  className="bg-green-500 text-white px-4 py-2 rounded flex gap-3 items-center"
                  disabled={loading}
                >
                  {loading && (
                    <span className="spinner-border spinner-border-sm"></span>
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
                    <li key={index} className="border-b border-gray-300 py-2">
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(followUp.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
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
            <button
              onClick={() => setIsAllFollowUpsModalOpen(false)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackSurveys;
