import moment from "moment";
import React, { useRef } from "react";
import useGetCompanyData from "../../Hook/GetCompanyData/useGetCompanyData";
import { useReactToPrint } from "react-to-print";

function PrintTemplate({ setIsShowPrint, data, handlePrint }) {
  const profileData = useGetCompanyData();

  const thermalPrintTemplate = useRef(null);

  const handleThermalPrint = useReactToPrint({
    content: () => thermalPrintTemplate.current,
    documentTitle: 'Receipt',
    pageStyle: `
      @media print {
        .print-template {
          font-size: 8px !important;
        }
      }
    `,
  });
  



  return (
    <div  style={{ fontSize: '8px' }} className="w-full max-w-[80mm] bg-white uppercase text-[8px]">
      <div
        className="p-4 mx-auto text-gray-800 rounded-md"
        id="print-template"
        ref={thermalPrintTemplate}
      >
        {/* Header Section */}
        <div className="text-center mb-1">
          {/* {profileData?.logo && (
            <img
              src={profileData?.companyLogo}
              alt="Company Logo"
              className="w-16 h-16 mx-auto mb-3"
            />
          )} */}
          <h2 className=" text-base font-medium uppercase">{profileData?.name}</h2>
          <p className=" uppercase ">{profileData?.address}</p>
          <p className="    uppercase">Contact : {profileData?.mobile}</p>
          {/* <p className=" font-merchantDouble break-words">{profileData?.email}</p> */}
          <hr className="my-2 border-dashed border-gray-400" />
        </div>

        {/* Receipt Details */}
        <div className="text-center mb-3">
          <p className=" mb-1  ">
            <span className=" ">Receipt No:</span> {data?.receipt_no}
          </p>
          <p className=" mb-1  ">
            <span className="">Date:</span> {moment().format("DD-MMM-YYYY")}
          </p>
          <p className="  ">
            {data?.member_name} - {data?.member_id}
          </p>
        </div>
        <hr className=" border-dashed border-gray-400" />
        {/* Particulars Table */}
        <table className="w-full mb-1 ">
          <thead>
            <tr className=" border-gray-300">
              <th className="text-left py-1">#</th>
              <th className="text-left">Particulars</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td><hr className=" border-dashed border-gray-400" /></td>
              <td><hr className=" border-dashed border-gray-400" /></td>
              <td><hr className=" border-dashed border-gray-400" /></td>
            </tr>
            <tr className="">
              <td className="py-1">1</td>
              <td>Admission Fee</td>
              <td className="text-right">{data?.admissionFee || 0}</td>
            </tr>
            <tr className="">
              <td className="py-1">2</td>
              <td>Package Fee</td>
              <td className="text-right">{data?.packageFee || 0}</td>
            </tr>
          </tbody>

        </table>
        <hr className="mb-2 border-dashed border-gray-400" />
        {/* Financial Summary */}
        <div className="text-right mb-1  ">
          <p className=" flex justify-between  items-center">
            <span className="">Subtotal:</span> {data?.amount || 0}
          </p>
          {data?.discount > 0 && (
            <p className=" flex justify-between  items-center">
              <span className=" mt-1">Discount:</span> <span>{data?.discount}</span>
            </p>
          )}

          <p className=" flex justify-between items-center">
            <span className=" mt-1 ">Discount:</span> <span className="">0</span>
          </p>
          <hr className="mt-2 border-dashed border-gray-400" />
          <p className=" flex justify-between  items-center">
            <span className=" mt-1">Received:</span>{" "}
            {parseInt(data?.amount || 0) - parseInt(data?.discount || 0)}
          </p>
        </div>
        <hr className="mb-1 border-dashed border-gray-400" />
        <div className="flex justify-end">
          <p className="font-dottie font-extrabold">Paid (Cash)</p>
        </div>
        <hr className="mt-1 border-dashed border-gray-400" />
        {/* Package Details */}
        <div className="text-center mt-5 mb-2 ">
          <p className=" text-right">{data?.package_name}</p>
          <p className="text-right ">
            <p className="mt-1">
              {moment(data?.start_date).format("DD MMM YYYY")} to {moment(data?.end_date).format("DD MMM YYYY")}
            </p>

          </p>
        </div>

        {/* Total Cost */}
        <div className="text-right mb-1   ">
          <p className="flex justify-between">
            Admission Fee:{" "}
            <div>
              {parseInt(data?.admissionFee || 0)}
            </div>
          </p>
        </div>
        <div className="text-right mb-1   ">
          <p className="flex justify-between">
            Package Fee :{" "}
            <div>
              {parseInt(data?.packageFee || 0)}
            </div>
          </p>
        </div>
        <div className="text-right mb-4   ">
          <p className="flex justify-between">
            Total Cost:{" "}
            <div>
              {parseInt(data?.packageFee || 0) + parseInt(data?.admissionFee || 0)}
            </div>
          </p>
        </div>
        <div className="border-b my-5"></div>

        {/* Footer Section */}
        <div className="text-center  ">
          <p>Staff: {data?.login_name}</p>
          <p>Created: {moment(data?.created_at).format("DD MMM YYYY hh:mm A")}</p>
          <p className="">Thank you for your payment!</p>
          {/* <p className=" text-gray-600 break-words">{profileData?.email}</p> */}
        </div>
      </div>

      {/* Print Button */}
      <div className="flex justify-end mt-4 mr-8 mb-8">
        <button
          className="bg-blue-500 text-white px-3 py-1 text-lg rounded hover:bg-blue-400 font-merchant"
          // onClick={handlePrint}
          onClick={handleThermalPrint}
        >
          PRINT
        </button>
      </div>
    </div>
  );
}

export default PrintTemplate;

