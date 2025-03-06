import React, { useState } from "react";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../../Hook/UseAxioSecure";
import { set } from "react-hook-form";
import { Oval } from "react-loader-spinner";

const UpdateAccessModal = ({ member, closeModal, refetch }) => {
  const [cardNumber, setCardNumber] = useState(member?.card_no || "");
  const [memberID, setMemberID] = useState(member?.member_id || "");
  const [loading, setLoading] = useState(false);
  const axiosSecure = UseAxiosSecure();

  const handleSave = async () => {
    setLoading(true);
    if (!cardNumber) {
      Swal.fire("Validation Error!", "Please enter a Card Number.", "warning");
      return;
    }

    if (!memberID) {
      Swal.fire("Validation Error!", "Please enter a Member ID.", "warning");
      return;
    }

    try {
      const response = await axiosSecure.put(`/users/update/${member._id}`, {
        card_no: cardNumber,
        member_id: memberID,
      });

      Swal.fire("Success!", "Member access updated.", "success");
      setLoading(false);
      refetch();
      closeModal();
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          Swal.fire(
            "Error!",
            "Card number already exists in this branch.",
            "error"
          );
        } else if (error.response.status === 402) {
          Swal.fire("Error!", "Member ID already exists.", "error");
        } else {
          Swal.fire("Error!", "Failed to update member access.", "error");
        }
      } else {
        Swal.fire("Error!", "Network or server error occurred.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 w-1/3">
        <h2 className="text-lg font-semibold mb-4">Update Access Info</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Member Name:</label>
          <p>{member.full_name}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Card Number:</label>
          <input
            type="text"
            className="border rounded w-full p-2"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Member ID:</label>
          <input
            type="text"
            className="border rounded w-full p-2"
            value={memberID}
            onChange={(e) => setMemberID(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
            disabled={loading}
          >
            {loading && (
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
            Save Changes
          </button>
          <button
            onClick={closeModal}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateAccessModal;
