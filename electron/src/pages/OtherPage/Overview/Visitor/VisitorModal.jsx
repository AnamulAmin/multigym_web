import React, { useState, useEffect, useCallback } from "react";
import UseAxiosSecure from "../../../../Hook/UseAxioSecure";
import Swal from "sweetalert2";
import Webcam from "react-webcam";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../../../providers/AuthProvider";

const VisitorModal = ({ isOpen, onClose, visitorId, onSave, branch }) => {
  const axiosSecure = UseAxiosSecure();
  const [visitor, setVisitor] = useState({
    visitorName: "",
    visitorMobile: "",
    visitorEmail: "",
    visitorPicture: "",
    visit_date: "",
    branch: branch,
  });
  const [loading, setLoading] = useState(false);
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState("");
  const webcamRef = React.useRef(null);
  const [btnLoading, setBtnLoading] = useState(false);

  const getCurrentDateTime = () => {
    const now = new Date();
    const gmtPlus6 = new Date(now.getTime() + 6 * 60 * 60 * 1000);
    return gmtPlus6.toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (visitorId) {
      setLoading(true);
      axiosSecure
        .get(`/visitor/${visitorId}?branch=${branch}`)
        .then((response) => {
          setVisitor(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching visitor:", error);
          setLoading(false);
          Swal.fire("Error", "Failed to fetch visitor", "error");
        });
    } else {
      setVisitor({
        visitorName: "",
        visitorMobile: "",
        visitorEmail: "",
        visitorPicture: "",
        visit_date: getCurrentDateTime(),
        branch: branch,
      });
    }
  }, [visitorId, axiosSecure, branch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVisitor({ ...visitor, [name]: value });
  };

  const validateForm = () => {
    const { visitorName, visitorMobile, visit_date } = visitor;

    if (!visitorName) {
      Swal.fire("Validation Error", "Name is required", "warning");
      return false;
    }

    if (!visitorMobile) {
      Swal.fire("Validation Error", "Mobile number is required", "warning");
      return false;
    } else if (!/^\d{11}$/.test(visitorMobile)) {
      Swal.fire(
        "Validation Error",
        "Mobile number must be 11 digits",
        "warning"
      );
      return false;
    }

    if (!visit_date) {
      Swal.fire("Validation Error", "Visit Date is required", "warning");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setBtnLoading(true);

    const updatedVisitor = {
      ...visitor,
      visitorPicture: capturedImage || visitor.visitorPicture,
    };

    if (visitorId) {
      axiosSecure
        .put(`/visitor/${visitorId}`, updatedVisitor)
        .then(() => {
          onSave();
          onClose();
          Swal.fire("Success", "Visitor updated successfully", "success");
        })
        .catch((error) => {
          console.error("Error updating visitor:", error);
          Swal.fire("Error", "Failed to update visitor", "error");
        })
        .finally(() => setBtnLoading(false));
    } else {
      axiosSecure
        .post("/visitor/create", updatedVisitor)
        .then(() => {
          onSave();
          onClose();
          Swal.fire("Success", "Visitor added successfully", "success");
        })
        .catch((error) => {
          console.error("Error adding visitor:", error);
          Swal.fire("Error", "Failed to add visitor", "error");
        })
        .finally(() => setBtnLoading(false));
    }
  };

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    uploadCapturedImage(imageSrc);
    setIsWebcamOpen(false);
  }, [webcamRef]);

  const uploadCapturedImage = async (imageDataUrl) => {
    const file = dataURLtoBlob(imageDataUrl);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/get-image-url?pathName=multi-gym-premium`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = response.data;

      if (response.status === 200) {
        const imageUrl = `${import.meta.env.VITE_APP_SPACES_URL}${data.path}`;
        setCapturedImage(imageUrl);
        toast.success("Image uploaded successfully");
      } else {
        toast.error(data.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    }
  };

  const dataURLtoBlob = (dataUrl) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 overflow-scroll bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">
          {visitorId ? "Edit Visitor" : "Add New Visitor"}
        </h2>
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="block text-gray-700 font-semibold mb-1">
                Name
              </label>
              <input
                type="text"
                name="visitorName"
                value={visitor.visitorName}
                onChange={handleChange}
                required
                className="focus:border-yellow-400 appearance-none text-gray-700 text-base border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-3">
              <label className="block text-gray-700 font-semibold mb-1">
                Mobile
              </label>
              <input
                type="text"
                name="visitorMobile"
                value={visitor.visitorMobile}
                onChange={handleChange}
                required
                className="focus:border-yellow-400 appearance-none text-gray-700 text-base border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-3">
              <label className="block text-gray-700 font-semibold mb-1">
                Email
              </label>
              <input
                type="email"
                name="visitorEmail"
                value={visitor.visitorEmail}
                onChange={handleChange}
                required
                className="focus:border-yellow-400 appearance-none text-gray-700 text-base border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-3">
              <label className="block text-gray-700 font-semibold mb-1">
                Picture
              </label>

              {capturedImage ? (
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-32 h-32 mb-4"
                />
              ) : (
                <input
                  type="text"
                  name="visitorPicture"
                  value={visitor.visitorPicture}
                  onChange={handleChange}
                  placeholder="Enter image URL or capture photo"
                  className="focus:border-yellow-400 appearance-none text-gray-700 text-base border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline"
                />
              )}
              <button
                type="button"
                onClick={() => setIsWebcamOpen(true)}
                className="bg-blue-500 text-white py-2 px-4 mt-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                {capturedImage ? "Retake Photo" : "Capture Photo"}
              </button>
              {isWebcamOpen && (
                <div className="my-4">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full mb-4"
                  />
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
                  >
                    Capture Photo
                  </button>
                </div>
              )}
            </div>
            <div className="mb-3">
              <label className="block text-gray-700 font-semibold mb-1">
                Visit Date
              </label>
              <input
                type="datetime-local"
                name="visit_date"
                value={visitor.visit_date}
                onChange={handleChange}
                required
                className="focus:border-yellow-400 appearance-none text-gray-700 text-base border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 text-white py-2 px-4 font-semibold hover:bg-gray-600 rounded-xl transition duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-yellow-500 text-white py-2 px-4 font-semibold flex items-center gap-1 hover:bg-yellow-700 rounded-xl transition duration-300"
                disabled={btnLoading}
              >
                {btnLoading && (
                  <span className="loading loading-spinner loading-md"></span>
                )}
                {visitorId ? "Update" : "Add"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default VisitorModal;
