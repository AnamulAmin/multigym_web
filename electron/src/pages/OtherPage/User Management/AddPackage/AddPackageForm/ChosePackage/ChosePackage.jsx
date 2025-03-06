import React from "react";
import useGetPackages from "../../../../../../Hook/GetPackageData/GetPackageData";

function ChosePackage({
  setSelectedPackage,
  selectedPackage,
  setPackageDetails,
  handleStartEndDate,
  handleReceiptTk,
}) {
  const packageData = useGetPackages();

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg mt-10">
      <h2 className="px-5 py-3 border-b border-dashed border-gray-300 flex justify-between items-center w-full font-bold text-[1.5rem]">
        <span>Choose Package</span>
      </h2>
      <div className="p-8">
        <select
          className="select select-bordered w-full max-w-xs transition duration-150 ease-in-out hover:border-gray-400 focus:outline-none focus:border-blue-500"
          value={selectedPackage}
          onChange={(e) => {
            setSelectedPackage(e.target.value);
            setPackageDetails(
              packageData.find((item) => item.name === e.target.value)
            );
            handleStartEndDate();
            handleReceiptTk();
          }}
        >
          <option value="" disabled>
            Select a Package
          </option>
          <option value="custom">Custom</option>
          {packageData?.map((item, index) => (
            <option value={item.name} key={index}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default ChosePackage;
