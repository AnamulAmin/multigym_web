import React, { useRef } from "react";
import moment from "moment";

const ThermalPrint = ({ profileData, data }) => {
  const thermalPrintTemplate = useRef(null);

  const handleThermalPrint = () => {
    if (thermalPrintTemplate.current) {
      window.print();
    }
  };

  return (
    <div>
      {/* Receipt Container */}
      <div
        className="receipt-template"
        ref={thermalPrintTemplate}
        // id="printableArea"
        style={{
          fontFamily: "fakeReceipt",
          width: "72mm",
          margin: "auto",
          padding: "16px",
          fontSize: "12px",
          color: "#1f1f39",
        }}
      >
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <h2
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "2px",
            }}
          >
            {profileData?.name}
          </h2>
          <p style={{ fontSize: "12px", margin: 0 }}>{profileData?.address}</p>
          <p style={{ fontSize: "12px", margin: 0 }}>
            Contact : {profileData?.mobile}
          </p>
          <hr style={{ margin: "5px 0", borderTop: "1px dashed #626262" }} />
        </div>

        {/* Receipt Info */}
        <div>
          <p style={{ fontSize: "12px", textAlign: "center", margin: 0 }}>
            Receipt No : {data?.receipt_no}
          </p>
          <p style={{ fontSize: "12px", textAlign: "center", margin: 0 }}>
            Date : {moment().format("DD-MMM-YYYY")}
          </p>
          <p style={{ fontSize: "12px", textAlign: "center", margin: 0 }}>
            {data?.member_name} - {data?.member_id}
          </p>
          <hr style={{ margin: "5px 0", borderTop: "1px dashed #626262" }} />
        </div>

        {/* Order Table Section */}
        <div style={{ marginBottom: "5px" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "12px",
            }}
          >
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>#</th>
                <th style={{ textAlign: "left" }}>Particulars</th>
                <th style={{ textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ textAlign: "left" }}>1</td>
                <td style={{ textAlign: "left" }}>Admission Fee</td>
                <td style={{ textAlign: "right" }}>
                  {data?.admissionFee || 0}
                </td>
              </tr>
              <tr>
                <td style={{ textAlign: "left" }}>2</td>
                <td style={{ textAlign: "left" }}>Package Fee</td>
                <td style={{ textAlign: "right" }}>{data?.packageFee || 0}</td>
              </tr>
            </tbody>
          </table>
          <hr style={{ margin: "5px 0", borderTop: "1px dashed #626262" }} />
        </div>

        {/* Financial Summary */}
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0 }}>Subtotal: {data?.amount || 0}</p>
          <p style={{ margin: 0 }}>Discount: {data?.discount || 0}</p>
          <hr style={{ margin: "7px 0", borderTop: "1px dashed #626262" }} />
          <p style={{ fontWeight: "bold", margin: 0 }}>
            Received:{" "}
            {parseInt(data?.amount || 0) - parseInt(data?.discount || 0)}
          </p>
          <hr style={{ margin: "5px 0", borderTop: "1px dashed #626262" }} />
          <p style={{ margin: 0, fontWeight: "bold" }}>PAID (CASH)</p>
        </div>

        {/* Footer Section */}
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <p style={{ margin: 0 }}>Staff: {data?.login_name}</p>
          <p style={{ margin: 0 }}>
            Created: {moment(data?.created_at).format("DD MMM YYYY hh:mm A")}
          </p>
          <p style={{ fontStyle: "italic", margin: "4px 0" }}>
            Thank you for your payment!
          </p>
        </div>
      </div>

      {/* Print Button */}
      <div style={{ textAlign: "right", marginTop: "16px" }}>
        <button
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "8px 16px",
            fontSize: "14px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={handleThermalPrint}
        >
          PRINT
        </button>
      </div>
    </div>
  );
};

export default ThermalPrint;
