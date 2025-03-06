import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const ImageUpload = ({
  setImageUrl = () => {},
  setPreviewImageUrl = () => {},
  setValue = () => {},
  label = "Upload Image",
}) => {
  const handleImageUpload = async (e) => {
    const imageFile = e.target.files[0];
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await axios.post(
        // "https://image.multigympremium.com/upload",
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
        if (setImageUrl) {
          setImageUrl(`${import.meta.env.VITE_APP_SPACES_URL}${data.path}`);
        }
        if (setPreviewImageUrl) {
          setPreviewImageUrl(data.path);
        }
        setValue(
          "photourl",
          `${import.meta.env.VITE_APP_SPACES_URL}${data.path}`
        );
        toast.success("Image uploaded successfully");
      } else {
        toast.error(data.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="md:w-full w-[95%] space-y-2 pt-1 md:max-w-min">
      <label className="capitalize font-bold text-[0.9rem]">{label}</label>
      <div className="form-control border rounded-lg shadow-sm">
        <input
          onChange={handleImageUpload}
          type="file"
          className="file-input outline-none focus:outline-none"
        />
      </div>
    </div>
  );
};

export default ImageUpload;
