import Mtitle from "/src/components library/Mtitle";
import React from "react";
import { GoPlus } from "react-icons/go";
import { TfiSearch } from "react-icons/tfi";

function DietLibraryHeader({
  search,
  setSearch,
  showAddDietForm,
  setShowAddDietForm,
  setDietId,
}) {
  return (
    <Mtitle title="Diet Library"
      rightcontent={
        <div className="flex md:mt-0 mt-3 justify-between items-center md:mb-4 md:pl-4">
          <div className="flex items-center gap-1 md:gap-4">
            <div className="flex gap-2 border bg-white p-2 pl-3 rounded-xl items-center md:w-64">
              <TfiSearch className=" md:text-2xl text-gray-500" />
              <input
                type="text"
                className="md:w-full  focus:outline-none "
                placeholder="Search here"
              // value={searchTerm}
              // onChange={handleSearch}
              />
            </div>
            <button
              // onClick={handleAddNew}
              onClick={() => {
                setShowAddDietForm(true);
                setDietId("");
              }}
              className="flex gap-1 md:gap-2 justify-center font-semibold items-center bg-yellow-500 text-white py-2 px-2 md:px-4 rounded-xl shadow hover:bg-yellow-600 transition duration-300"
            >
              <GoPlus className="text-xl" />
              New
            </button>
          </div>
        </div>
      }></Mtitle>

  );
}

export default DietLibraryHeader;
