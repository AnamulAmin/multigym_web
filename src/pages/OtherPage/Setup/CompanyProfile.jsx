import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaEdit, FaSave } from "react-icons/fa";
import UseAxiosSecure from "./../../../Hook/UseAxioSecure";
import Swal from "sweetalert2";
import Mtitle from "/src/components library/Mtitle";
import ImageUpload from "../../../config/Upload/ImageUploadcpanel";
import { AuthContext } from "../../../providers/AuthProvider";
import useGetCompanyData from "../../../Hook/GetCompanyData/useGetCompanyData";

const CompanyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    address: "",
    mobile: "",
    email: "",
    web: "",
    companyLogo: "",
    punchDeviceId: "", // New field
    punchOutDeviceId: "", // New field
  });
  const [selectedImage, setSelectedImage] = useState("");
  const [branchNotFound, setBranchNotFound] = useState(false);
  const { branch } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();
  const profile2 = useGetCompanyData();
  useEffect(() => {
    if (profile2) {
      setProfile(profile2);
    }
  }, [profile2]);

  console.log(profile2);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (url) => {
    setProfile({
      ...profile,
      companyLogo: url,
    });

    setSelectedImage(url);
  };

  const handleSave = () => {
    if (
      !profile.name ||
      !profile.address ||
      !profile.mobile ||
      !profile.email
    ) {
      Swal.fire({
        title: "Missing Information!",
        text: "Please fill in all the required fields (Company Name, Address, Mobile, and Email).",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    setLoading(true);
    const updatedProfile = {
      ...profile,
      branch,
    };

    const saveUrl = profile._id ? `/branches/${profile._id}` : "/branches";
    const method = profile._id ? "put" : "post";
    axiosSecure[method](saveUrl, updatedProfile)
      .then((response) => {
        setIsEditing(false);
        setProfile(response.data);
        setSelectedImage(response.data.companyLogo);
        Swal.fire({
          title: "Success!",
          text: "Company Profile saved successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error saving the branch!", error);
        Swal.fire({
          title: "Error!",
          text: "There was an error saving the Company profile.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setLoading(false);
      }
      )
      ;
  };

  return (
    <div className="md:p-8 p-5 mx-auto rounded-xl">
      <Mtitle title="Company Profile"></Mtitle>
      <div className="rounded-xl">
        {branchNotFound ? (
          <div className="text-center">
            {!isEditing && (
              <p className="text-red-600 text-lg font-semibold">
                Branch not found. Please add new branch data first.
              </p>
            )}
            {isEditing && (
              <div className="w-full items-center space-y-4 mt-4 flex justify-start">
                <div className="w-full p-5 bg-white rounded-xl shadow">
                  <ImageUpload
                    setImageUrl={(url) =>
                      setProfile({ ...profile, companyLogo: url })
                    }
                    setPreviewImageUrl={setSelectedImage}
                    setValue={() => { }}
                    label="Upload Company Logo"
                  />
                  <div className="flex flex-col items-start">
                    <label className="text-gray-700">Company Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={profile.name || ""}
                      onChange={handleChange}
                      className="focus:border-yellow-500 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline my-2"
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <label className="text-gray-700">Address:</label>
                    <input
                      type="text"
                      name="address"
                      value={profile.address || ""}
                      onChange={handleChange}
                      className="focus:border-yellow-500 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline my-2"
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <label className="text-gray-700">Mobile:</label>
                    <input
                      type="text"
                      name="mobile"
                      value={profile.mobile || ""}
                      onChange={handleChange}
                      className="focus:border-yellow-500 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline my-2"
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <label className="text-gray-700">Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email || ""}
                      onChange={handleChange}
                      className="focus:border-yellow-500 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline my-2"
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <label className="text-gray-700">Web:</label>
                    <input
                      type="text"
                      name="web"
                      value={profile.web || ""}
                      onChange={handleChange}
                      className="focus:border-yellow-500 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline my-2"
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <label className="text-gray-700">Punch In Device ID:</label>
                    <input
                      type="text"
                      name="punchDeviceId"
                      value={profile.punchDeviceId || ""}
                      onChange={handleChange}
                      className="focus:border-yellow-500 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline my-2"
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <label className="text-gray-700">
                      Punch Out Device ID:
                    </label>
                    <input
                      type="text"
                      name="punchOutDeviceId"
                      value={profile.punchOutDeviceId || ""}
                      onChange={handleChange}
                      className="focus:border-yellow-500 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline my-2"
                    />
                  </div>
                </div>
                <div className="w-full">
                  {selectedImage && (
                    <div className="flex justify-center ">
                      <img
                        src={selectedImage}
                        alt="Selected Logo"
                        className="w-96 h-auto mt-4 mb-3"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-green-600 text-white py-2 px-4 font-semibold hover:bg-green-700 rounded-xl flex items-center mt-4"
              >
                <FaEdit className="mr-2" /> Add New Branch
              </button>
            )}
          </div>
        ) : (
          <>
            {!isEditing ? (
              <div className="w-full items-center space-y-4 md:mt-4 gap-4 md:gap-0 flex flex-col-reverse md:flex-row justify-start">
                <div className="w-full p-5 rounded-xl border">
                  <div className="mb-4">
                    <p className="text-lg font-semibold">Company Name</p>
                    <p className="text-gray-700">{profile.name}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-lg font-semibold">Address</p>
                    <p className="text-gray-700">{profile.address}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-lg font-semibold">Mobile</p>
                    <p className="text-gray-700">{profile.mobile}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-lg font-semibold">Email</p>
                    <p className="text-gray-700">{profile.email}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-lg font-semibold">Web</p>
                    <p className="text-gray-700">
                      <a
                        href={profile.web}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-500 hover:underline"
                      >
                        {profile.web}
                      </a>
                    </p>
                  </div>
                  <div className="mb-4">
                    <p className="text-lg font-semibold">Punch Device ID</p>
                    <p className="text-gray-700">{profile.punchDeviceId}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-lg font-semibold">Punch Out Device ID</p>
                    <p className="text-gray-700">{profile.punchOutDeviceId}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-lg font-semibold">Company Logo URL</p>
                    <p className="text-gray-700">{profile.companyLogo}</p>
                  </div>
                </div>
                <div className="w-[80%] md:w-full">
                  <div className="flex justify-center ">
                    <img
                      src={profile.companyLogo}
                      alt="Company logo"
                      className="w-96 h-auto md:mt-4 mb-3"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full items-center space-y-4 mt-4 flex justify-start">
                <div className="w-full p-5 bg-white rounded-xl shadow">
                  <ImageUpload
                    setImageUrl={(url) => handleImageUpload(url)}
                    setValue={() => { }}
                    label="Upload Company Logo"
                  />
                  <div className="flex flex-col items-start">
                    <label className="text-gray-700">Company Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={profile.name || ""}
                      onChange={handleChange}
                      className="focus:border-yellow-500 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline my-2"
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <label className="text-gray-700">Address:</label>
                    <input
                      type="text"
                      name="address"
                      value={profile.address || ""}
                      onChange={handleChange}
                      className="focus:border-yellow-500 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline my-2"
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <label className="text-gray-700">Mobile:</label>
                    <input
                      type="text"
                      name="mobile"
                      value={profile.mobile || ""}
                      onChange={handleChange}
                      className="focus:border-yellow-500 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline my-2"
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <label className="text-gray-700">Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email || ""}
                      onChange={handleChange}
                      className="focus:border-yellow-500 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline my-2"
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <label className="text-gray-700">Web:</label>
                    <input
                      type="text"
                      name="web"
                      value={profile.web || ""}
                      onChange={handleChange}
                      className="focus:border-yellow-500 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline my-2"
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <label className="text-gray-700">Punch In Device ID:</label>
                    <input
                      type="text"
                      name="punchDeviceId"
                      value={profile.punchDeviceId || ""}
                      onChange={handleChange}
                      className="focus:border-yellow-500 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline my-2"
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <label className="text-gray-700">
                      Punch Out Device ID:
                    </label>
                    <input
                      type="text"
                      name="punchOutDeviceId"
                      value={profile.punchOutDeviceId || ""}
                      onChange={handleChange}
                      className="focus:border-yellow-500 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline my-2"
                    />
                  </div>
                </div>
                <div className="w-full">
                  {selectedImage && (
                    <div className="flex justify-center ">
                      <img
                        src={selectedImage}
                        alt="Selected Logo"
                        className="w-96 h-auto mt-4 mb-3"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex justify-start space-x-4 mt-6">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-yellow-500 text-white py-2 px-4 font-semibold hover:bg-yellow-700 rounded-xl flex gap-3 items-center"
              disabled={loading}
            >

              <span className="flex items-center">
                <FaSave className="mr-2" /> Save
              </span>
              {loading && (
                <span className="loading loading-spinner loading-md"></span>
              )}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white py-2 px-4 font-semibold hover:bg-gray-600 rounded-xl"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-yellow-500 text-white py-2 px-4 font-semibold hover:bg-yellow-700 rounded-xl flex items-center"
          >
            <FaEdit className="mr-2" /> Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;
