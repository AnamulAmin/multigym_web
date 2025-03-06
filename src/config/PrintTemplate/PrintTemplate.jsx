// import React, { useEffect, useRef, useState } from "react";
// import moment from "moment";
// import useGetCompanyData from "../../Hook/GetCompanyData/useGetCompanyData";
// import ReactToPrint, { useReactToPrint } from "react-to-print";
// import { CgSpinner } from "react-icons/cg";

// // Import the CSS file for styling
// import "./PrintTemplate.css";
// import ThermalPrint from "./ThermalPrint";
// import ReceiptTemplate from "./ReceiptTemplate";
// import { set } from "react-hook-form";
// import { Oval } from "react-loader-spinner";

// function PrintTemplate({ setIsShowPrint, data, handlePrint }) {
//   const profileData = useGetCompanyData();
//   const [content, setContent] = useState(``);
//   const [loading, setLoading] = useState(false);

//   const componentRef = useRef();

//   const thermalPrintTemplate = useRef(null);

//   const handleThermalPrint = useReactToPrint({
//     // content: () => thermalPrintTemplate.current,
//     content: content && content.split("").join(""),
//   });

//   // const handlePrint = () => {
//   //   const template = `

//   //     <div
//   //       className="receipt-template"
//   //       ref={thermalPrintTemplate}
//   //       // id="printableArea"
//   //       style='
//   //         fontFamily: "fakeReceipt",
//   //         width: "72mm",
//   //         margin: "auto",
//   //         padding: 16px,
//   //         fontSize: "12px",
//   //         color: "#1f1f39",
//   //         // fontWeight: bold,
//   //       '
//   //     >

//   //       <div style={{ textAlign: "center", marginBottom: "16px" '>
//   //         <h2
//   //           style={{
//   //             fontSize: "16px",
//   //             fontWeight: "bold",
//   //             marginBottom: "2px",
//   //           '
//   //         >
//   //           ${profileData?.name}
//   //         </h2>
//   //         <p style={{ fontSize: "12px", margin: 0 '>{profileData?.address}</p>
//   //         <p style={{ fontSize: "12px", margin: 0 '>
//   //           Contact : ${profileData?.mobile}
//   //         </p>
//   //         <hr style={{ margin: "5px 0", borderTop: "1px dashed #626262" ' />
//   //       </div>

//   //       {/* Receipt Info */}
//   //       <div>
//   //         <p style={{ fontSize: "12px", textAlign: "center", margin: 0 '>
//   //           Receipt No : ${data?.receipt_no}
//   //         </p>
//   //         <p style={{ fontSize: "12px", textAlign: "center", margin: 0 '>
//   //           Date : ${moment().format("DD-MMM-YYYY")}
//   //         </p>
//   //         <p style={{ fontSize: "12px", textAlign: "center", margin: 0 '>
//   //           ${data?.member_name} - {data?.member_id}
//   //         </p>
//   //         <hr style={{ margin: "5px 0", borderTop: "1px dashed #626262" ' />
//   //       </div>

//   //       <div style={{ marginBottom: "5px" '>
//   //         <table
//   //           style={{
//   //             width: "100%",
//   //             borderCollapse: "collapse",
//   //             fontSize: "12px",
//   //           '
//   //         >
//   //           <thead>
//   //             <tr>
//   //               <th style={{ textAlign: "left" '>#</th>
//   //               <th style={{ textAlign: "left" '>Particulars</th>
//   //               <th style={{ textAlign: "right" '>Amount</th>
//   //             </tr>
//   //           </thead>
//   //           <tbody>
//   //             <tr>
//   //               <td style={{ textAlign: "left" '>1</td>
//   //               <td style={{ textAlign: "left" '>Admission Fee</td>
//   //               <td style={{ textAlign: "right" '>
//   //                 ${data?.admissionFee || 0}
//   //               </td>
//   //             </tr>
//   //             <tr>
//   //               <td style={{ textAlign: "left" '>2</td>
//   //               <td style={{ textAlign: "left" '>Package Fee</td>
//   //               <td style={{ textAlign: "right" '>{data?.packageFee || 0}</td>
//   //             </tr>
//   //           </tbody>
//   //         </table>
//   //         <hr style={{ margin: "5px 0", borderTop: "1px dashed #626262" ' />
//   //       </div>

//   //       <div style={{ textAlign: "right" '>
//   //         <p
//   //           style={{
//   //             margin: 0,
//   //             display: "flex",
//   //             justifyContent: "space-between",
//   //           '
//   //         >
//   //           <b>Subtotal:</b> ${data?.amount || 0}
//   //         </p>
//   //         <p
//   //           style={{
//   //             margin: 0,
//   //             display: "flex",
//   //             justifyContent: "space-between",
//   //           '
//   //         >
//   //           <b>Discount:</b> ${data?.discount || 0}
//   //         </p>
//   //         <hr style={{ margin: "7px 0", borderTop: "1px dashed #626262" ' />
//   //         <p
//   //           style={{
//   //             fontWeight: "bold",
//   //             margin: 0,
//   //             display: "flex",
//   //             justifyContent: "space-between",
//   //           '
//   //         >
//   //           <b>Received:</b>
//   //           ${parseInt(data?.amount || 0) - parseInt(data?.discount || 0)}
//   //         </p>
//   //         <hr style={{ margin: "5px 0", borderTop: "1px dashed #626262" ' />
//   //         <p style={{ margin: 0, fontWeight: "bold" '>PAID (CASH)</p>
//   //       </div>

//   //       <div style={{ textAlign: "center", marginTop: "10px" '>
//   //         <p style={{ margin: 0 '>Staff: ${data?.login_name}</p>
//   //         <p style={{ margin: 0 '>
//   //           Created: ${moment(data?.created_at).format("DD MMM YYYY hh:mm A")}
//   //         </p>
//   //         <p style={{ fontStyle: "italic", margin: "4px 0" '>
//   //           Thank you for your payment!
//   //         </p>
//   //       </div>
//   //     </div>

//   //     </div>
//   //   `;
//   // };

//   // return (
//   //   <div className="receipt-container font-dottie">
//   //     <div className="receipt-template" ref={thermalPrintTemplate}>
//   //       {/* Header Section */}
//   //       <div className="receipt-header">
//   //         <h2 className="company-title">{profileData?.name}</h2>
//   //         <p className="company-address">{profileData?.address}</p>
//   //         <p className="company-contact">Contact : {profileData?.mobile}</p>
//   //         <hr className="separator1" />
//   //       </div>

//   //       {/* Recept info */}
//   //       <div>
//   //         <p className="receipt">Receipt No : {data?.receipt_no}</p>
//   //         <p className="receipt">Date : {moment().format("DD-MMM-YYYY")}</p>
//   //         <p className="receipt">
//   //           {data?.member_name} - {data?.member_id}
//   //         </p>
//   //         <hr className="separator2" />
//   //       </div>
//   //       {/* Order Table Section */}
//   //       <div className="order-details">
//   //         <table className="details-table">
//   //           <thead>
//   //             <tr>
//   //               <th className="table-header">#</th>
//   //               <th className="table-header">Particulars</th>
//   //               <th className="right">Amount</th>
//   //             </tr>
//   //           </thead>
//   //           <tbody>
//   //             <tr>
//   //               <td>
//   //                 <hr className="separator" />
//   //               </td>
//   //               <td>
//   //                 <hr className="separator" />
//   //               </td>
//   //               <td>
//   //                 <hr className="separator" />
//   //               </td>
//   //             </tr>
//   //             <tr>
//   //               <td className="table-cell">1</td>
//   //               <td className="table-cell">Admission Fee</td>
//   //               <td className="table-cell align-right">
//   //                 {data?.admissionFee || 0}
//   //               </td>
//   //             </tr>
//   //             <tr>
//   //               <td className="table-cell">2</td>
//   //               <td className="table-cell">Package Fee</td>
//   //               <td className="table-cell align-right">
//   //                 {data?.packageFee || 0}
//   //               </td>
//   //             </tr>
//   //           </tbody>
//   //         </table>
//   //         <hr className="separator" />
//   //       </div>

//   //       {/* Financial Summary */}
//   //       <div className="summary-section">
//   //         <p className="twoContent">
//   //           <span className="">Subtotal:</span> <span>{data?.amount || 0}</span>
//   //         </p>
//   //         <p className="twoContent">
//   //           <span className="">Discount:</span>{" "}
//   //           <span>{data?.discount || 0}</span>
//   //         </p>
//   //         <hr className="separator3" />
//   //         <p className="twoContent highlight">
//   //           <span className=" Received">Received:</span>{" "}
//   //           {parseInt(data?.amount || 0) - parseInt(data?.discount || 0)}
//   //         </p>
//   //         <hr className="separator" />
//   //         <p className="Received">
//   //           PAID <span className="highlight">(CASH)</span>
//   //         </p>
//   //       </div>

//   //       <hr className="separator" />

//   //       {/* Package Details */}
//   //       <div className="package-info">
//   //         <p className="info-title end">{data?.package_name}</p>
//   //         <p className="end">
//   //           {data?.start_date} to {data?.end_date}
//   //         </p>
//   //       </div>

//   //       <div className="twoContent">
//   //         <p>Admission Fee </p>
//   //         <p>{parseInt(data?.admissionFee || 0)}</p>
//   //       </div>
//   //       <div className="twoContent">
//   //         <p>Package Fee </p>
//   //         <p>{parseInt(data?.packageFee || 0)}</p>
//   //       </div>
//   //       <div className="twoContent">
//   //         <p>Installment </p>
//   //         <p>0</p>
//   //       </div>

//   //       {/* Total Cost */}
//   //       <div>
//   //         <p className="twoContent highlight">
//   //           Total Cost:{" "}
//   //           <span>
//   //             {parseInt(data?.packageFee || 0) +
//   //               parseInt(data?.admissionFee || 0)}
//   //           </span>
//   //         </p>
//   //       </div>

//   //       <hr className="lastBorder" />

//   //       {/* Footer Section */}
//   //       <div className="receipt-footer">
//   //         <p>Staff: {data?.login_name}</p>
//   //         <p>
//   //           Created: {moment(data?.created_at).format("DD MMM YYYY hh:mm A")}
//   //         </p>
//   //         <p className="italic-note">Thank you for your payment!</p>
//   //         {/* <p className="contact-footer">{profileData?.email}</p> */}
//   //       </div>
//   //     </div>

//   //     {/* Print Button */}
//   //     <div className="action-container">
//   //       <button className="action-button" onClick={handleThermalPrint}>
//   //         PRINT
//   //       </button>
//   //     </div>
//   //   </div>
//   // );

//   return (
//     <div
//       style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "4px" }}
//     >
//       {/* Receipt Container */}

//       {/* Print Button */}
//       {/* <div style={{ textAlign: "right", marginTop: "16px" }}>
//         <button
//           style={{
//             backgroundColor: "#007bff",
//             color: "white",
//             padding: "8px 16px",
//             fontSize: "14px",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer",
//           }}
//           onClick={handleThermalPrint}

//           // onClick={}
//         >
//           PRINT
//         </button>
//       </div> */}

//       <div>
//         <ReactToPrint
//           trigger={() => (
//             <button
//               style={{
//                 backgroundColor: "#007bff",
//                 color: "white",
//                 padding: "8px 16px",
//                 fontSize: "14px",
//                 border: "none",
//                 borderRadius: "4px",
//                 cursor: "pointer",
//                 display: "block",
//                 marginLeft: "auto",
//               }}
//               disabled={loading}
//               className="group"

//               // onClick={}
//             >
//               {loading ? (
//                 <div className="flex items-center justify-center gap-2">
//                   <Oval
//                     visible={true}
//                     height="15"
//                     width="15"
//                     color="#fff"
//                     ariaLabel="oval-loading"
//                     wrapperStyle={{}}
//                     wrapperClass=""
//                   />
//                   <span className="ml-2"> Loading</span>
//                 </div>
//               ) : (
//                 "PRINT"
//               )}
//             </button>
//           )}
//           content={() => componentRef.current}
//           documentTitle="Multi Gym Premium"
//           onBeforePrint={() => setLoading(true)}
//           onAfterPrint={() => setLoading(false)}
//         />
//         <ReceiptTemplate
//           ref={componentRef}
//           profileData={profileData}
//           data={data}
//         />
//       </div>
//     </div>
//   );

//   // return <ThermalPrint profileData={profileData} data={data} />;
// }

// export default PrintTemplate;




// import React, { useEffect, useRef, useState } from "react";
// import moment from "moment";
import useGetCompanyData from "../../Hook/GetCompanyData/useGetCompanyData";
// import ReactToPrint, { useReactToPrint } from "react-to-print";
// import { CgSpinner } from "react-icons/cg";

// Import the CSS file for styling
import "./PrintTemplate.css";
import ThermalPrint from "./ThermalPrint";
import ReceiptTemplate from "./ReceiptTemplate";
import { set } from "react-hook-form";
import { Oval } from "react-loader-spinner";


import React, { forwardRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function PrintTemplate({ setIsShowPrint, data }) {
  const profileData = useGetCompanyData();
  const ref = React.useRef();

  const handlePrint = async () => {
    const element = ref.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("receipt.pdf");
  };

  return (
    <div>
      <ReceiptTemplate ref={ref} profileData={profileData} data={data} />
      <button onClick={handlePrint}>Print PDF</button>
    </div>
  );
}

export default PrintTemplate;
