import React, { useContext, useEffect, useState } from "react";
import UseAxiosSecure from "../UseAxioSecure";
import { AuthContext } from "../../providers/AuthProvider";

function useGetSingleMemberData({
  currentPage,
  setTotalItems,
  isShowEditMember = false,
  resetFields,
  param_member_id,
  nameCardPhone,
  member_id,
  isShowAddPackage = false,
  isDeleteMember = false,
  isDeleteInvoice = false,
}) {
  const axiosSecure = UseAxiosSecure();
  const [expiredate, setExpiredate] = useState("");
  const [blood_group, setBlood_group] = useState("");
  const [gender, setGender] = useState("");
  const [members, setMembers] = useState([]);
  const {branch} = useContext(AuthContext);
  useEffect(() => {
    const submitData = async () => {
      const filter = {};

      // if (isNaN(parseInt(nameCardPhone)) && nameCardPhone.length != 0) {
      //   filter.full_name = nameCardPhone;
      // } else {
      //   if (nameCardPhone.length == 11 && nameCardPhone.length != 0) {
      //     filter.contact_no = nameCardPhone;
      //   } else if (nameCardPhone.length != 0) {
      //     filter.card_number = nameCardPhone;
      //   }
      // }
      if (member_id) filter.member_id = member_id;
      if (nameCardPhone) filter.nameCardPhone = nameCardPhone;
      if (expiredate) filter.expiredate = expiredate;
      if (blood_group) filter.blood_group = blood_group;
      if (gender) filter.gender = gender;
      if (param_member_id && !member_id && !nameCardPhone) {
        filter._id = param_member_id;
      } else {
        delete filter._id;
      }
      try {
        const res = await axiosSecure.post(
          `/users/get-users?branch=${branch}&currentPage=${currentPage}`,
          filter
        );

        console.log("res 16561", res);

        setMembers(res?.data?.data);
        setTotalItems(res?.data?.totalItems);
      } catch (error) {
        console.error("res 16561", error);
      }
    };

    submitData();
  }, [
    gender,
    blood_group,
    expiredate,
    nameCardPhone,
    member_id,
    currentPage,
    isShowEditMember,
    setTotalItems,
    axiosSecure,
    setMembers,
    resetFields,
    isShowAddPackage,
    isDeleteMember,
    isDeleteInvoice,
  ]);

  useEffect(() => {
    console.log("resetFields", resetFields);
    if (resetFields) {
      setExpiredate("");
      setBlood_group("");
      setGender("");
      const inputFields = document.querySelectorAll(".filterItem");

      console.log("inputFields", inputFields);

      inputFields.forEach((item) => {
        item.value = "";
      }, []);

      // for (item of inputFields) {
      //   item.value = "";
      // }
    }
  }, [resetFields]);
  return members;
}

export default useGetSingleMemberData;
