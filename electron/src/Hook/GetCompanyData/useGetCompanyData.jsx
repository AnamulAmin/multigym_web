import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../UseAxioSecure";
import Swal from "sweetalert2";
import { useAuth } from "../../providers/AuthProvider";

function useGetCompanyData() {
  const [profile, setProfile] = useState({});
  const [selectedImage, setSelectedImage] = useState("");
  const [branchNotFound, setBranchNotFound] = useState(false);
  const { user } = useAuth();
  const [branchcode, setBranchcode] = useState(user?.branch || "shia");
  const axiosSecure = UseAxiosSecure();

  useEffect(() => {
    axiosSecure
      .get(`/branches/${branchcode}`)
      .then((response) => {
        console.log("Response data:", response.data);
        if (response.data && response.data._id) {
          setProfile(response.data);
          setSelectedImage(response.data.companyLogo);
          setBranchNotFound(false);
        } else {
          setBranchNotFound(true);
          Swal.fire({
            title: "Company Branch Not Found!",
            text: "Please add new Company branch data first.",
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the Company branches!",
          error
        );
        setBranchNotFound(true);
      });
  }, [axiosSecure, branchcode]);
  return profile;
}

export default useGetCompanyData;
