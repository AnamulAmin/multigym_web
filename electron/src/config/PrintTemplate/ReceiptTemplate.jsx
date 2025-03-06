// import React, { forwardRef } from "react";

// const ReceiptTemplate = forwardRef(({ profileData, data }, ref) => (
//   <div
//     ref={ref}
//     style={{
//       fontFamily: "'fakeReceipt'",
//       width: "80mm",
//       margin: "auto",
//       padding: "16px",
//       fontSize: "12px",
//       color: "#1f1f39",
//       backgroundColor: "white"
//     }}
//   >
//     <div style={{ textAlign: "center", marginBottom: "16px" }}>
//       <h2 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "2px" }}>
//         {profileData?.name}
//       </h2>
//       <p style={{ fontSize: "12px", margin: 0 }}>{profileData?.address}</p>
//       <p style={{ fontSize: "12px", margin: 0 }}>
//         Contact: {profileData?.mobile}
//       </p>
//       <hr style={{ margin: "5px 0", borderTop: "1px dashed #626262" }} />
//     </div>

//     <div>
//       <p style={{ fontSize: "12px", textAlign: "center", margin: 0 }}>
//         Receipt No: {data?.receipt_no}
//       </p>
//       <p style={{ fontSize: "12px", textAlign: "center", margin: 0 }}>
//         Date: {new Date().toLocaleDateString()}
//       </p>
//       <p style={{ fontSize: "12px", textAlign: "center", margin: 0 }}>
//         {data?.member_name} - {data?.member_id}
//       </p>
//       <hr style={{ margin: "5px 0", borderTop: "1px dashed #626262" }} />
//     </div>

//     <div style={{ marginBottom: "5px" }}>
//       <table
//         style={{
//           width: "100%",
//           borderCollapse: "collapse",
//           fontSize: "12px",
//         }}
//       >
//         <thead>
//           <tr>
//             <th style={{ textAlign: "left" }}>#</th>
//             <th style={{ textAlign: "left" }}>Particulars</th>
//             <th style={{ textAlign: "right" }}>Amount</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td style={{ textAlign: "left" }}>1</td>
//             <td style={{ textAlign: "left" }}>Admission Fee</td>
//             <td style={{ textAlign: "right" }}>{data?.admissionFee || 0}</td>
//           </tr>
//           <tr>
//             <td style={{ textAlign: "left" }}>2</td>
//             <td style={{ textAlign: "left" }}>Package Fee</td>
//             <td style={{ textAlign: "right" }}>{data?.packageFee || 0}</td>
//           </tr>
//         </tbody>
//       </table>
//       <hr style={{ margin: "5px 0", borderTop: "1px dashed #626262" }} />
//     </div>

//     <div style={{ textAlign: "right" }}>
//       <p
//         style={{
//           margin: 0,
//           display: "flex",
//           justifyContent: "space-between",
//         }}
//       >
//         <b>Subtotal:</b> {data?.amount || 0}
//       </p>
//       <p
//         style={{
//           margin: 0,
//           display: "flex",
//           justifyContent: "space-between",
//         }}
//       >
//         <b>Discount:</b> {data?.discount || 0}
//       </p>
//       <hr style={{ margin: "7px 0", borderTop: "1px dashed #626262" }} />
//       <p
//         style={{
//           fontWeight: "bold",
//           margin: 0,
//           display: "flex",
//           justifyContent: "space-between",
//         }}
//       >
//         <b>Received:</b>
//         {parseInt(data?.amount || 0) - parseInt(data?.discount || 0)}
//       </p>
//       <hr style={{ margin: "5px 0", borderTop: "1px dashed #626262" }} />
//       <p style={{ margin: 0, fontWeight: "bold" }}>PAID (CASH)</p>
//     </div>

//     <div style={{ textAlign: "center", marginTop: "10px" }}>
//       <p style={{ margin: 0 }}>Staff: {data?.login_name}</p>
//       <p style={{ margin: 0 }}>
//         Created: {new Date(data?.created_at).toLocaleString()}
//       </p>
//       <p
//         style={{
//           fontStyle: "italic",
//           margin: "4px 0",
//         }}
//       >
//         Thank you for your payment!
//       </p>
//     </div>
//   </div>
// ));

// export default ReceiptTemplate;

import React, { forwardRef } from "react";
import jsPDF from "jspdf";
import domtoimage from "dom-to-image";

const ReceiptTemplate = forwardRef(({ profileData, data }, ref) => {
  const generatePDF = async () => {
    const element = ref.current;
    if (!element) return;

    try {
      const dataUrl = await domtoimage.toPng(element, {
        style: {
          backgroundColor: "#ffffff", // Ensures a white background
        },
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (element.offsetHeight / element.offsetWidth) * imgWidth;

      pdf.addImage(dataUrl, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Receipt_${data?.receipt_no || "Unknown"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  console.log(data);
const printReceipt = () => {
  if (!ref.current) return;

  // Create a hidden iframe
  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.top = "-10000px";
  document.body.appendChild(iframe);

  // Write the receipt content to the iframe
  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) return;

  doc.open();
  doc.write(`
    <html>
      <head>
        <title>Receipt</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: auto;
            padding: 0;
            width: 75mm;
            height: fit-content;
          }
          .container {
            margin: auto;
            padding: 16px;
            font-size: 12px;
            color: #000;
            background-color: #fff;
          }
          .header {
            text-align: center;
            margin-bottom: 16px;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }
          .dashed-line {
            margin: 5px 0;
            border-top: 1px dashed #000;
          }
          .footer {
            text-align: center;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        ${ref.current.outerHTML}
      </body>
    </html>
  `);
  doc.close();

  // Trigger the print function
  iframe.contentWindow?.focus();
  iframe.contentWindow?.print();

  // Clean up the iframe after printing
  iframe.onload = () => document.body.removeChild(iframe);
};

  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      width: "72mm",
      margin: "auto",
      padding: "16px",
      fontSize: "12px",
      color: "#000",
      backgroundColor: "#fff",
      height: "fit-content",
    },
    header: {
      textAlign: "center",
      marginBottom: "16px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "12px",
    },
    dashedLine: {
      margin: "5px 0",
      borderTop: "1px dashed #000",
    },
    footer: {
      textAlign: "center",
      marginTop: "10px",
    },
    button: {
      marginTop: "16px",
      padding: "8px 12px",
      backgroundColor: "#007BFF",
      color: "#FFF",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      marginRight: "8px",
    },
  };

  return (
    <>
      <div ref={ref} style={styles.container}>
        {/* Header Section */}
        <div style={styles.header}>
          <h2
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "2px",
            }}
          >
            {profileData?.name || "Unknown Name"}
          </h2>
          <p style={{ fontSize: "12px", margin: 0 }}>
            {profileData?.address || "No Address Provided"}
          </p>
          <p style={{ fontSize: "12px", margin: 0 }}>
            Contact: {profileData?.mobile || "No Contact Info"}
          </p>
          <hr style={styles.dashedLine} />
        </div>

        {/* Receipt Info Section */}
        <div>
          <p style={{ fontSize: "12px", textAlign: "center", margin: 0 }}>
            Receipt No: {data?.receipt_no || "Unknown"}
          </p>
          <p style={{ fontSize: "12px", textAlign: "center", margin: 0 }}>
  Date:{" "}
  {new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })}
</p>
          <p style={{ fontSize: "12px", textAlign: "center", margin: 0 }}>
            {data?.member_name || "No Member Name"} -{" "}
            {data?.member_id || "No ID"}
          </p>
          <hr style={styles.dashedLine} />
        </div>

        {/* Table Section */}
        <div style={{ marginBottom: "5px" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Particulars</th>
                <th style={{ textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Admission Fee</td>
                <td style={{ textAlign: "right" }}>
                  {data?.admissionFee || 0}
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>Package Fee</td>
                <td style={{ textAlign: "right" }}>{data?.packageFee || 0}</td>
              </tr>
            </tbody>
          </table>
          <hr style={styles.dashedLine} />
        </div>

        {/* Totals Section */}
        <div style={{ textAlign: "right" }}>
  {data?.discount > 0 && (
    <>
      <p style={{ display: "flex", justifyContent: "space-between" }}>
        <b>Subtotal:</b> {data?.amount || 0}
      </p>
      <p style={{ display: "flex", justifyContent: "space-between" }}>
        <b>Discount:</b> {data?.discount || 0}
      </p>
      <hr style={styles.dashedLine} />
    </>
  )}
  <p
    style={{
      fontWeight: "bold",
      display: "flex",
      justifyContent: "space-between",
    }}
  >
    <b>Received:</b>{" "} ৳ {parseInt(data?.amount || 0) - parseInt(data?.discount || 0)}
  </p>
  <hr style={styles.dashedLine} />
  <p style={{ fontWeight: "bold" }}>
    PAID ({data?.payment_method || "Unknown"})
  </p>
  {/* Package Info Section */}
  <div style={{ textAlign: "center", marginTop: "10px" }}>
    <p style={{ fontWeight: "bold" }}>{data?.package_name || "No Package"}</p>
    <p>
  {data?.start_date
    ? new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(data.start_date)).replace(',', '')
    : "N/A"}{" "}
  to{" "}
  {data?.end_date
    ? new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(data.end_date)).replace(',', '')
    : "N/A"}
</p>
  </div>
</div>


        {/* Footer Section */}
        <div style={styles.footer}>
  <p>Staff: {data?.login_name || "Unknown Staff"}</p>
  <p>
    Created:{" "}
    {data?.createdAt
      ? new Intl.DateTimeFormat("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
          .format(new Date(data.createdAt))
          .replace(":", ".")
      : "N/A"}
  </p>
  <p style={{ fontStyle: "italic", margin: "4px 0" }}>
    Thank you for your payment!
  </p>
  <p style={{ margin: "4px 0", textAlign: "center", fontWeight: "bold" }}>
    www.multigympremium.com
  </p>
</div>
      </div>
      {/* Buttons */}
      <div>
        <button onClick={generatePDF} style={styles.button}>
          Download PDF
        </button>
        <button onClick={printReceipt} style={styles.button}>
          Print Receipt
        </button>
      </div>
    </>
  );
});

export default ReceiptTemplate;
