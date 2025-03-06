import React from "react";
import PackageInput from "../PackageInput/PackageInput";
import PackageSelect from "../PackageSelect/PackageSelect";
import PackageInfoRow from "./PackageInfoRow";
import { set } from "react-hook-form";

function CustomPackageArea({
  errors,
  register,
  isCustom = false,
  packageDetails,
  setPackageDetails,
  handleStartEndDate,
  setAmount,
  setReceipt_Tk,
  amount,
  setStartDate,
  handleReceiptTk,
  calendarMinDate,
}) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg">
      <h2 className="px-5 py-3 border-b border-dashed border-gray-300 flex justify-between items-center w-full font-bold text-[1.5rem]">
        <span>Package</span>
      </h2>
      <div className="p-8 ">
        {!isCustom && (
          <>
            <PackageInfoRow
              title={"Package Name"}
              value={packageDetails?.name}
            />
            <PackageInfoRow
              title={"Admission Fee"}
              value={packageDetails?.admissionFee}
            />
            <PackageInfoRow
              title={"Package Fee"}
              value={packageDetails?.packageFee}
            />
            <PackageInfoRow title={"Total"} value={packageDetails?.amount} />
          </>
        )}

        {isCustom && (
          <>
            <PackageInput
              type={"text"}
              register={register}
              error={errors}
              name={"package_name"}
              isRequired={false}
              label={"Package Name"}
            />
            <PackageInput
              type={"date"}
              register={register}
              error={errors}
              name={"start_date"}
              isRequired={false}
              label={"Start Date"}
              min={calendarMinDate}
            />

            <PackageInput
              type={"date"}
              register={register}
              error={errors}
              name={"end_date"}
              isRequired={false}
              label={"End Date"}
            />
            <PackageInput
              type={"number"}
              register={register}
              error={errors}
              name={"amount"}
              isRequired={false}
              label={"Amount"}
              onChange={{
                onChange: (e) => {
                  setAmount(e.target.value);
                  // setValue("receipt_Tk", e.target.value - discount);
                  handleReceiptTk(e);
                },
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default CustomPackageArea;
