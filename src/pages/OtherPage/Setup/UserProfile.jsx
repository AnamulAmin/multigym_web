import { useContext, useState, useEffect } from "react";
import { FaEdit, FaEnvelope } from "react-icons/fa";
import { AuthContext } from "./../../../providers/AuthProvider";
import UseAxiosSecure from "../../../Hook/UseAxioSecure";
import Mtitle from "/src/components library/Mtitle";
import EditMember from "../../../components/partial/MemberRegistration/EditMember/EditMember";
import Modal from "../../../components/partial/Modal/Modal";
import Swal from "sweetalert2";

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const [editProfile, setEditProfile] = useState({});
  const [imageUploadMode, setImageUploadMode] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isChangedBranch, setIsChangedBranch] = useState(false);
  const [loading, setLoading] = useState(false);
  const axiosSecure = UseAxiosSecure();
  const userEmail = user?.email;
  const role = userProfile.role;

  console.log(user, "user", userEmail, user?._id);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosSecure.get(
          `/users/user_by_email/${userEmail}`
        );
        setUserProfile(response.data);
        setEditProfile(response.data);
        console.log(response.data, "response.data");
      } catch (error) {
        console.error("There was an error fetching the user profile!", error);
      }
    };

    if (userEmail) {
      fetchProfile();
    }
  }, [userEmail, axiosSecure, isEditing, isChangedBranch]);

  const handleEdit = () => setIsEditing(true);
  const cancel = () => setIsEditing(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await axiosSecure.put(`/users/update_profile/${userEmail}`, editProfile);
      setUserProfile(editProfile);
      setIsEditing(false);
      setLoading(false);
    } catch (error) {
      console.error("There was an error saving the profile!", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setEditProfile({
      ...editProfile,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    let imageData = "";

    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await axiosSecure.post(`/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageData = response.data.url;
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    } else if (imageUrl) {
      imageData = imageUrl;
    }

    if (imageData) {
      try {
        await axiosSecure.put(`/users/update_profile_image/${userEmail}`, {
          photourl: imageData,
        });
        setUserProfile((prev) => ({ ...prev, photourl: imageData }));
        setImageUploadMode(false);
      } catch (error) {
        console.error("Error updating profile image:", error);
      }
    }
  };

  const handleSwitchBranch = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, switch it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let switchBranch = userProfile.branch === "shia" ? "lalmatia" : "shia";
        let userData = {
          branch: switchBranch,
        };

        try {
          const res = await axiosSecure.put(`/users/put/${user._id}`, userData);

          if (res.status === 200 || res.status === 201) {
            Swal.fire("Success!", "Branch has been updated.", "success");
            setIsChangedBranch((prev) => !prev);
          }
        } catch (error) {
          Swal.fire(
            "Error!",
            "There was a problem updating the branch.",
            "error"
          );
        }
      }
    });
  };

  if (!userProfile) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4 px-10">
      <Mtitle title="My Profile"></Mtitle>
      <div className="flex items-center relative space-x-6 border rounded-lg p-3">
        <div>
          <img
            src={userProfile?.photourl || "/default-avatar.png"}
            alt="User Profile"
            className="md:w-24 md:h-24 rounded-full border cursor-pointer"
            onClick={() => setImageUploadMode(true)}
          />
          {imageUploadMode && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 bg-opacity-75 rounded-full">
              <form
                onSubmit={handleImageUpload}
                className="border p-5 rounded-xl bg-white"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="mb-2"
                />
                <input
                  type="text"
                  placeholder="Or enter image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="focus:border-blue-300 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline my-2"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    className="bg-gray-500 text-white py-2 px-4 font-semibold hover:bg-gray-600 rounded-xl transition duration-300 flex items-center"
                    onClick={() => setImageUploadMode(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 font-semibold hover:bg-blue-700 rounded-xl transition duration-300 flex items-center"
                  >
                    Upload Image
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div>
          <h1 className="md:text-xl font-semibold md:font-bold">
            {userProfile.full_name || "Not Provided"}
          </h1>
          <p className="text-gray-600 text-sm md:text-base ">
            {userProfile.profession || "Profession Not Provided"}
          </p>
          <div className="flex text-sm md:text-base items-center md:space-x-2 mt-1">
            <FaEnvelope className="text-gray-500 hidden md:block" />
            <p>{userProfile.email || "Email Not Provided"}</p>
          </div>
          {role === "admin" && (
            <button
              onClick={handleSwitchBranch}
              className="mt-4 md:mt-0 bg-yellow-500 font-medium text-white py-1 px-3 rounded-lg hover:bg-yellow-600 absolute top-4 right-4"
            >
              Switch Branch
            </button>
          )}
        </div>
        {/* {!isEditing ? (
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <EditField
              label="Full Name"
              name="full_name"
              value={editProfile.full_name}
              onChange={handleChange}
            />
            <EditField
              label="Profession"
              name="profession"
              value={editProfile.profession}
              onChange={handleChange}
            />
          </div>
        )} */}
      </div>

      <h2 className="text-lg font-semibold my-2 mt-6">Personal Information</h2>
      <div className="mt-3 border rounded-xl p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <DisplayField label="Nickname" value={userProfile.nickname} />
          <DisplayField
            label="Date of Birth"
            value={userProfile.date_of_birth}
          />
          <DisplayField label="Gender" value={userProfile.gender} />
          <DisplayField label="Blood Group" value={userProfile.blood_group} />
          <DisplayField label="Height" value={userProfile.height} />
          <DisplayField label="Weight" value={userProfile.weight} />
          <DisplayField label="Address" value={userProfile.address} />
          <DisplayField label="Contact No" value={userProfile.contact_no} />
        </div>
      </div>
      {/* {!isEditing ? (
      ) : (
        <div className="mt-3 border rounded-xl p-6">
          <div className="grid grid-cols-2 gap-4">
            <EditField
              label="Nickname"
              name="nickname"
              value={editProfile.nickname}
              onChange={handleChange}
            />
            <EditField
              label="Date of Birth"
              name="date_of_birth"
              value={editProfile.date_of_birth}
              onChange={handleChange}
            />
            <EditField
              label="Gender"
              name="gender"
              value={editProfile.gender}
              onChange={handleChange}
            />
            <EditField
              label="Blood Group"
              name="blood_group"
              value={editProfile.blood_group}
              onChange={handleChange}
            />
            <EditField
              label="Height"
              name="height"
              value={editProfile.height}
              onChange={handleChange}
            />
            <EditField
              label="Weight"
              name="weight"
              value={editProfile.weight}
              onChange={handleChange}
            />
            <EditField
              label="Address"
              name="address"
              value={editProfile.address}
              onChange={handleChange}
            />
            <EditField
              label="Contact No"
              name="contact_no"
              value={editProfile.contact_no}
              onChange={handleChange}
            />
          </div>
        </div>
      )} */}

      <h2 className="text-lg font-semibold mt-6">Additional Information</h2>
      <div className="mt-3 border rounded-xl p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <DisplayField label="Member ID" value={userProfile.member_id} />
          <DisplayField label="NID Number" value={userProfile.nid_number} />
          <DisplayField label="Status" value={userProfile.status} />
          <DisplayField label="Religion" value={userProfile.religion} />
          <DisplayField label="Branch" value={userProfile.branch} />
          <DisplayField label="Email" value={userProfile.email} />
          <DisplayField
            label="Emergency Contact Name"
            value={userProfile.emergency_contact_name}
          />
          <DisplayField
            label="Emergency Contact Number"
            value={userProfile.emergency_contact_number}
          />
        </div>
      </div>
      {/* {!isEditing ? (
      ) : (
        <div className="mt-3 border rounded-xl p-6">
          <div className="grid grid-cols-2 gap-4">
            <EditField
              label="Member ID"
              name="member_id"
              value={editProfile.member_id}
              onChange={handleChange}
            />
            <EditField
              label="NID Number"
              name="nid_number"
              value={editProfile.nid_number}
              onChange={handleChange}
            />
            <EditField
              label="Status"
              name="status"
              value={editProfile.status}
              onChange={handleChange}
            />
            <EditField
              label="Religion"
              name="religion"
              value={editProfile.religion}
              onChange={handleChange}
            />
            <EditField
              label="Branch"
              name="branch"
              value={editProfile.branch}
              onChange={handleChange}
            />
            <EditField
              label="Email"
              name="email"
              value={editProfile.email}
              onChange={handleChange}
            />
            <EditField
              label="Emergency Contact Name"
              name="emergency_contact_name"
              value={editProfile.emergency_contact_name}
              onChange={handleChange}
            />
            <EditField
              label="Emergency Contact Number"
              name="emergency_contact_number"
              value={editProfile.emergency_contact_number}
              onChange={handleChange}
            />
          </div>
        </div>
      )} */}

      {isEditing ? (
        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-500 text-white py-2 px-4 font-semibold hover:bg-gray-600 rounded-xl transition duration-300 mr-2"
            onClick={cancel}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white py-2 px-4 font-semibold hover:bg-blue-700 rounded-xl transition duration-300"
            onClick={handleSave}
            disabled={loading}
          >
            {loading && (
              <span className="loading loading-spinner loading-md"></span>
            )}
            Save Changes
          </button>
        </div>
      ) : (
        <div className="flex justify-end mt-4">
          <button
            className="bg-blue-600 text-white py-2 px-4 font-semibold hover:bg-blue-700 rounded-xl transition duration-300 flex items-center"
            onClick={handleEdit}
          >
            <FaEdit className="mr-2" />
            Edit Profile
          </button>
        </div>
      )}

      <Modal isShowModal={isEditing} setIsShowModal={setIsEditing}>
        <EditMember
          setIsShow={setIsEditing}
          isShow={isEditing}
          user_id={user?._id}
        />
      </Modal>
    </div>
  );
};

const DisplayField = ({ label, value }) => (
  <div className="flex gap-2 items-center">
    <label className="text-sm font-bold">{label}:</label>
    <p>{value || "Not Provided"}</p>
  </div>
);

const EditField = ({ label, name, value, onChange }) => (
  <div>
    <label className="text-sm font-semibold">{label}:</label>
    <input
      type="text"
      name={name}
      value={value || ""}
      onChange={onChange}
      className="focus:border-blue-300 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>
);

export default UserProfile;
