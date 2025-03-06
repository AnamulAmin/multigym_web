import moment from "moment";
import React, { useRef } from "react";
import useGetCompanyData from "../../../Hook/GetCompanyData/useGetCompanyData";
import { PDFDownloadLink } from "@react-pdf/renderer";
import A4PrintTemplatePdf from "./A4PrintTemplatePdf";
import { useReactToPrint } from "react-to-print";

function A4PrintTemplate({ data }) {
  const formattedDate = moment().format("MM/DD/YYYY hh:mm A");
  const profileData = useGetCompanyData();

  const A4PrintTemplate = useRef(null);

  const handleA4Print = useReactToPrint({
    content: () => A4PrintTemplate.current,
  });
  return (
    <div className="w-[210mm] bg-white mx-auto shadow-lg border border-gray-300 mt-10">
      <div className="flex justify-between items-center gap-2 w-full mt-4 px-8">
        <button className="bg-blue-500 text-white block text-3xl px-2 py-1 rounded   hover:text-black  hover:bg-red-200 ">
          <PDFDownloadLink
            document={
              <A4PrintTemplatePdf data={data} profileData={profileData} />
            }
            fileName={`Invoice of ${data?.member_name}.pdf`}
          >
            {({ loading }) =>
              loading ? "Loading document..." : "Download PDF"
            }
          </PDFDownloadLink>
        </button>
        <button
          className="bg-blue-500 text-white ml-auto block text-3xl px-2 py-1 rounded   hover:text-black  hover:bg-blue-300"
          onClick={handleA4Print}
        >
          PRINT
        </button>
      </div>
      <div
        className="w-[210mm] h-[297mm] p-10 receipt-template"
        id={"A4-print-template"}
        ref={A4PrintTemplate}
      >
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold">
            {profileData?.name}: Subscriptions
          </h1>
          <p className="text-sm text-gray-500">Printed on {formattedDate}</p>
        </div>

        <div className="border-t border-b py-4 mb-6">
          <p className="text-lg font-semibold">Received with thanks</p>
          <p>
            Receipt No: <span className="font-bold">{data?.receipt_no}</span>
          </p>
          <p>Date: {moment(data?.transaction).format("DD-MM-YYYY")}</p>
          <p>Currency: BDT</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold">Payment Summary</h2>
          <div className="flex justify-between">
            <span>Total Cost:</span>
            <span className="font-bold">
              {parseInt(data?.packageFee) + parseInt(data?.admissionFee)} BDT
            </span>
          </div>
          <div className="flex justify-between">
            <span>Total Received: </span>
            <span className="font-bold">
              {parseInt(data?.packageFee) +
                parseInt(data?.admissionFee) -
                parseInt(data?.discount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Total Discount:</span>
            <span className="font-bold">{data?.discount} BDT</span>
          </div>
          <div className="text-green-500 font-bold mt-2">PAID</div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold">Member Information</h2>
          <p>
            {data?.member_name} -
            <span className="font-bold">{data?.member_id}</span>
          </p>
          <p>
            Contact: <span className="font-bold">{data?.contact_no}</span>
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold">Package Details</h2>
          <p>
            Package Name:{" "}
            <span className="font-bold">{data?.package_name}</span>
          </p>
          <p>
            Validity: {data?.start_date} to {data?.end_date}
          </p>
          <div className="flex justify-between">
            <span>Admission Fee:</span>
            <span className="font-bold">{data?.admissionFee} BDT</span>
          </div>
          <div className="flex justify-between">
            <span>Package Fee:</span>
            <span className="font-bold">{data?.packageFee} BDT</span>
          </div>
          <div className="flex justify-between">
            <span>Installment:</span>
            <span className="font-bold">0 BDT</span>
          </div>
          <div className="flex justify-between mt-2">
            <span>Total Cost:</span>
            <span className="font-bold">
              {parseInt(data?.packageFee) +
                parseInt(data?.admissionFee) -
                parseInt(data?.discount)}{" "}
              BDT
            </span>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-center text-sm">
            {profileData?.name}
            <br />
            {profileData?.address}
            <br />
            Contact: {profileData?.mobile}
            <br />
            {profileData?.email}
            <br />
          </p>
        </div>
      </div>
    </div>
  );
}

export default A4PrintTemplate;
