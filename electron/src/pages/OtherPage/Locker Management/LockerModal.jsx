import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../Hook/UseAxioSecure";

const LockerModal = ({ locker, onClose, onSave, groups, genders, branch }) => {
  const [formData, setFormData] = useState({
    lockerName: "",
    group: "",
    gender: "",
    status: "available",
    branch: branch,
    member_id: "",
  });
  const [loading, setLoading] = useState(false);

  const axiosSecure = UseAxiosSecure();

  useEffect(() => {
    if (locker) {
      setFormData({
        lockerName: locker.lockerName,
        group: locker.group,
        gender: locker.gender,
        status: locker.status,
        branch: locker.branch,
        member_id: locker.member_id || "",
      });
    }
  }, [locker]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    setLoading(true);
    if (!formData.lockerName.trim()) {
      Swal.fire("Validation Error", "Locker Name is required.", "error");
      return;
    }

    if (!formData.group) {
      Swal.fire("Validation Error", "Group is required.", "error");
      return;
    }

    if (!formData.gender) {
      Swal.fire("Validation Error", "Gender is required.", "error");
      return;
    }

    try {
      if (locker && locker._id) {
        // Edit locker
        await axiosSecure.put(`/lockers/put/${locker._id}`, formData);
        Swal.fire("Success!", "Locker updated successfully!", "success");
      } else {
        // Add new locker
        await axiosSecure.post("/lockers/post", formData);
        Swal.fire("Success!", "Locker added successfully!", "success");
      }

      // Trigger the callback to refresh the data and close the modal
      onSave();
      setLoading(false);
    } catch (error) {
      console.error("Error saving locker:", error);
      Swal.fire("Error!", "There was an error saving the locker.", "error");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {locker ? "Edit Locker" : "Add New Locker"}
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700">Locker Name</label>
          <input
            type="text"
            name="lockerName"
            value={formData.lockerName}
            onChange={handleChange}
            className="focus:border-gray-300 appearance-none text-gray-700  border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Group</label>
          <select
            name="group"
            value={formData.group}
            onChange={handleChange}
            className="focus:border-gray-300 appearance-none cursor-pointer text-gray-700  border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select Group</option>
            {groups
              .filter((groupOption) => groupOption !== "All")
              .map((groupOption) => (
                <option key={groupOption} value={groupOption}>
                  {groupOption}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="focus:border-gray-300 appearance-none cursor-pointer text-gray-700  border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select Gender</option>
            {genders
              .filter((genderOption) => genderOption !== "All") // Filter out 'All'
              .map((genderOption) => (
                <option key={genderOption} value={genderOption}>
                  {genderOption}
                </option>
              ))}
          </select>
        </div>

        <div className="flex flex-row-reverse  gap-4 mt-6">
          <div className="flex max-w-min gap-3 cursor-pointer  items-center bg-yellow-500 text-white py-2 px-4 rounded-xl shadow hover:bg-yellow-600  hover:border-gray-300 hover:shadow-none transition duration-300">
            <button onClick={handleSave} disabled={loading}>
              {loading && (
                <span className="loading loading-spinner loading-md"></span>
              )}
              Save
            </button>
          </div>

          <div className="flex max-w-min gap-3 cursor-pointer  items-center bg-red-500 text-white py-2 px-4 rounded-xl shadow hover:bg-red-600 hover:border-gray-300 hover:shadow-none transition duration-300">
            <button onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockerModal;
