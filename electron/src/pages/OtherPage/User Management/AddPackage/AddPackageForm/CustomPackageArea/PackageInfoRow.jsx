import React from "react";

function PackageInfoRow({ title, value }) {
  return (
    <div
      className={
        "w-full grid grid-cols-1 lg:grid-cols-2 gap-4 space-y-2 pt-2 items-center"
      }
    >
      <h3 className="capitalize font-bold  text-[1.3rem] my-3"> {title} </h3>

      <p>{value}</p>
    </div>
  );
}

export default PackageInfoRow;
