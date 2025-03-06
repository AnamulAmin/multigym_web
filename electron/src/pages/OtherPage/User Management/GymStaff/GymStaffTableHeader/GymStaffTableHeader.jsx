import React, { useState } from "react";
import SearchBox from "../../../../../components/partial/SearchBox/SearchBox";
import FormGroup from "../../../../../components/partial/Headers/FilterHeader/FormGroup/FormGroup";

function GymStaffTableHeader({ setIsShowAddStaff, search, setSearch }) {
  const debounceFuncetion = (e) => {
    const inputValue = e.target.value;
    let timeout;
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      setSearch(inputValue);
      console.log(inputValue);
    }, 100);
  };
  return (
    <div className="flex items-center justify-between px-4 bg-white py-2">
      <b>
        <span id="MemberStatus">Gym Staff</span>
        <input type="hidden" id="memberCount" name="memberCount" value="1504" />
      </b>
      <div className="flex gap-4 items-center">
        <FormGroup
          colSpan={2}
          placeholder={"Search"}
          maxLength={50}
          type={"text"}
          onChange={debounceFuncetion}
        />

        <button
          id="sendSMS"
          type="button"
          className="btn btn-xs btn-neutral rounded-full"
          onClick={() => setIsShowAddStaff(true)}
        >
          Add Staff
        </button>
      </div>
    </div>
  );
}

export default GymStaffTableHeader;
