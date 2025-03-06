// import React, { useEffect, useState } from "react";
// import UseAxiosSecure from "../../UseAxioSecure";

// function useGetFilterMemberData({
//   currentPage,
//   setTotalItems,
//   isShowEditMember,
//   isShowRegister,
//   resetFields,
//   gender = "",
//   blood_group = "",
//   expiredate = "",
//   nameCardPhone = "",
//   member_id = "",
//   setMember_id = () => {},
//   setNameCardPhone = () => {},
//   setExpiredate = () => {},
//   setBlood_group = () => {},
//   setGender = () => {},
//   setIsLoading = () => {},
//   isDeleteMember = false,
// }) {
//   const [members, setMembers] = useState([]);
//   const axiosSecure = UseAxiosSecure();
//   useEffect(() => {
//     const submitData = async () => {
//       const filter = {};

//       setIsLoading(true);
//       if (member_id) filter.member_id = member_id;
//       if (nameCardPhone) filter.nameCardPhone = nameCardPhone;
//       if (expiredate) filter.expiredate = expiredate;
//       if (blood_group) filter.blood_group = blood_group;
//       if (gender) filter.gender = gender;
//       try {
//         const res = await axiosSecure.post(
//           `/users/get-users?branch=shia&currentPage=${currentPage}`,
//           filter
//         );

//         console.log("res 16561", res);

//         setMembers(res?.data?.data);
//         setTotalItems(res?.data?.totalItems);
//         setIsLoading(false);
//       } catch (error) {
//         console.error("res 16561", error);
//         setIsLoading(false);
//       }
//     };

//     submitData();
//   }, [
//     gender,
//     blood_group,
//     expiredate,
//     nameCardPhone,
//     member_id,
//     currentPage,
//     isShowEditMember,
//     isShowRegister,
//     setTotalItems,
//     axiosSecure,
//     setMembers,
//     resetFields,
//     isDeleteMember,
//   ]);

//   useEffect(() => {
//     console.log("resetFields", resetFields);
//     if (resetFields) {
//       setMember_id("");
//       setNameCardPhone("");
//       setExpiredate("");
//       setBlood_group("");
//       setGender("");
//       const inputFields = document.querySelectorAll(".filterItem");

//       inputFields.forEach((item) => {
//         item.value = "";
//       }, []);

//       // for (item of inputFields) {
//       //   item.value = "";
//       // }
//     }
//   }, [resetFields]);
//   return members;
// }

// export default useGetFilterMemberData;
import React, { useEffect, useState, useCallback, useContext } from "react";
import UseAxiosSecure from "../../UseAxioSecure";
import { AuthContext } from "../../../providers/AuthProvider";

function useGetFilterMemberData({
  currentPage,
  setTotalItems,
  isShowEditMember,
  isShowRegister,
  resetFields,
  gender = "",
  blood_group = "",
  expiredate = "",
  nameCardPhone = "",
  member_id = "",
  setMember_id = () => {},
  setNameCardPhone = () => {},
  setExpiredate = () => {},
  setBlood_group = () => {},
  setGender = () => {},
  setIsLoading = () => {},
  isDeleteMember = false,
  isShowNote = false
}) {
  const [members, setMembers] = useState([]);
  const axiosSecure = UseAxiosSecure();
  const {branch} = useContext(AuthContext);
  // Refetch function to be used externally
  const refetch = useCallback(async () => {
    const filter = {};

    setIsLoading(true);
    if (member_id) filter.member_id = member_id;
    if (nameCardPhone) filter.nameCardPhone = nameCardPhone;
    if (expiredate) filter.expiredate = expiredate;
    if (blood_group) filter.blood_group = blood_group;
    if (gender) filter.gender = gender;

    try {
      const res = await axiosSecure.post(
        `/users/get-users?branch=${branch}&currentPage=${currentPage}`,
        filter
      );

      console.log("res 16561", res);

      setMembers(res?.data?.data);
      setTotalItems(res?.data?.totalItems);
      setIsLoading(false);
    } catch (error) {
      console.error("res 16561", error);
      setIsLoading(false);
    }
  }, [
    gender,
    blood_group,
    expiredate,
    nameCardPhone,
    member_id,
    currentPage,
    axiosSecure,
    setTotalItems,
    setIsLoading,
    isShowNote
  ]);

  // Call refetch function in useEffect when dependencies change
  useEffect(() => {
    refetch();
  }, [
    gender,
    blood_group,
    expiredate,
    nameCardPhone,
    member_id,
    currentPage,
    isShowEditMember,
    isShowRegister,
    setTotalItems,
    axiosSecure,
    setMembers,
    resetFields,
    isDeleteMember,
    isShowNote
    
  ]);

  // Reset fields effect
  useEffect(() => {
    if (resetFields) {
      setMember_id("");
      setNameCardPhone("");
      setExpiredate("");
      setBlood_group("");
      setGender("");
      const inputFields = document.querySelectorAll(".filterItem");

      inputFields.forEach((item) => {
        item.value = "";
      });
    }
  }, [resetFields]);

  return { members, refetch };
}

export default useGetFilterMemberData;
