import { useEffect, useState } from "react";
import UseAxiosSecure from "../../../../../Hook/UseAxioSecure";
import FormGroup from "../../../../../components/partial/Headers/FilterHeader/FormGroup/FormGroup";

function AddPackageFilter({
  setMembers,
  currentPage,
  setTotalItems,
  isShowEditMember,
  resetFields,
  param_member_id,
  invoiceData,
  setMember_id,
  setNameCardPhone,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mt-3">
      <FormGroup
        colSpan={2}
        placeholder={"ENTER MEMBER ID"}
        type={"text"}
        inputClassName={"filterItem"}
        setState={setMember_id}
      />
      <FormGroup
        colSpan={4}
        placeholder={"ENTER NAME,EMAIL,PHONE"}
        type={"text"}
        inputClassName={"filterItem"}
        setState={setNameCardPhone}
      />
    </div>
  );
}

export default AddPackageFilter;
