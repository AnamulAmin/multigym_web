import React, { useState, useContext, useEffect } from "react";
import { FiEdit, FiSave } from "react-icons/fi";
import { MdToggleOn, MdToggleOff } from "react-icons/md";
import { AuthContext } from "./../../../providers/AuthProvider";
import ReactQuill from "react-quill";
import Swal from "sweetalert2";

import "react-quill/dist/quill.snow.css";
import useGetCompanyData from "../../../Hook/GetCompanyData/useGetCompanyData";
import UseAxiosSecure from "../../../Hook/UseAxioSecure";

function Announcement() {
  const { branch } = useContext(AuthContext);
  const [announcementBody, setAnnouncementBody] = useState("");
  const [announcementPurpose, setAnnouncementPurpose] = useState("");
  const [announcementEnabled, setAnnouncementEnabled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const axiosSecure = UseAxiosSecure();

  // Get company data using the custom hook
  const profile = useGetCompanyData();

  // Use company data for initial values if available
  useEffect(() => {
    if (profile) {
      setAnnouncementBody(
        profile.announcementBody || "No announcement available."
      );
      setAnnouncementPurpose(profile.announcementPurpose || "General Notice");
      setAnnouncementEnabled(profile.announcementEnabled || false);
    }
  }, [profile]);

  // Toggle edit mode
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Toggle announcement enabled status and update in database
  const handleToggleEnabled = async () => {
    const newStatus = !announcementEnabled;
    setAnnouncementEnabled(newStatus);

    try {
      await axiosSecure.put(`/branches/${branch}/announcement`, {
        announcementEnabled: newStatus,
      });
      Swal.fire({
        icon: "success",
        title: "Announcement Status Updated",
        text: `Announcement is now ${newStatus ? "enabled" : "disabled"}.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error updating announcement status:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Update Status",
        text: "Could not update the announcement status.",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  // Save announcement changes
  const handleSave = async () => {
    setIsEditing(false);
    setBtnLoading(true);
    try {
      await axiosSecure.put(`/branches/${branch}/announcement`, {
        announcementBody,
        announcementPurpose,
        announcementEnabled,
      });
      Swal.fire({
        icon: "success",
        title: "Announcement Updated",
        text: "Your changes have been saved.",
        timer: 2000,
        showConfirmButton: false,
      });
      setBtnLoading(false);
    } catch (error) {
      console.error("Error updating announcement:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Update Announcement",
        text: "Could not save your changes.",
        timer: 2000,
        showConfirmButton: false,
      });
      setBtnLoading(false);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 shadow-2xl bg-white rounded-lg mt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-4xl font-extrabold text-purple-700">
          Announcement
        </h2>
        <button
          className={`btn btn-sm flex items-center gap-2 rounded-full transition-all ${
            isEditing
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-purple-500 text-white hover:bg-purple-600"
          }`}
          onClick={isEditing ? handleSave : handleEditToggle}
          disabled={btnLoading}
        >
          {btnLoading && (
            <span className="loading loading-spinner loading-md"></span>
          )}
          {isEditing ? <FiSave size={20} /> : <FiEdit size={20} />}
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>

      <div className="form-control mb-5">
        <label className="label">
          <span className="label-text font-semibold text-gray-700">
            Purpose
          </span>
        </label>
        {isEditing ? (
          <input
            type="text"
            className="input input-bordered w-full focus:border-purple-500 focus:ring focus:ring-purple-200"
            value={announcementPurpose}
            onChange={(e) => setAnnouncementPurpose(e.target.value)}
          />
        ) : (
          <p className="text-gray-800 text-lg font-medium">
            {announcementPurpose}
          </p>
        )}
      </div>

      <div className="form-control mb-5">
        <label className="label">
          <span className="label-text font-semibold text-gray-700">
            Announcement Body
          </span>
        </label>
        {isEditing ? (
          <ReactQuill
            theme="snow"
            value={announcementBody}
            onChange={setAnnouncementBody}
            className="bg-white text-gray-700 rounded-lg"
            placeholder="Write announcement here..."
          />
        ) : (
          <div
            className="text-gray-700 text-base p-3 border border-gray-300 rounded-lg bg-white shadow-inner"
            dangerouslySetInnerHTML={{ __html: announcementBody }}
          ></div>
        )}
      </div>

      <div className="flex items-center gap-3 mt-6">
        <span className="font-semibold text-gray-700">
          Enable Announcement:
        </span>
        <button
          className={`transition-all duration-300 text-4xl ${
            announcementEnabled
              ? "text-green-500 hover:text-green-600"
              : "text-gray-400 hover:text-gray-500"
          }`}
          onClick={handleToggleEnabled}
        >
          {announcementEnabled ? <MdToggleOn /> : <MdToggleOff />}
        </button>
      </div>
    </div>
  );
}

export default Announcement;
