import React, { useContext } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../../../../Hook/UseAxioSecure";
import moment from "moment";
import { AuthContext } from "../../../../../../providers/AuthProvider";

function ReportRow({ data, setIsDeleteInvoice, timeFrame, index }) {
  const axiosSecure = UseAxiosSecure();
  const {user} = useContext(AuthContext);
 const role =user.role;

 const handleInvoiceDelete = async (id) => {
  // Check if the user is an admin
  if (role !== "admin") {
    Swal.fire("Permission Denied", "You are not allowed to perform this transaction.", "error");
    return;
  }

  try {
    const result = await Swal.fire({
      title: "Do you want to delete the item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      const res = await axiosSecure.delete(`/invoice/delete/${id}`);
      console.log("Invoice deleted successfully:", res);
      toast.success("Invoice Deleted Successfully");
      setIsDeleteInvoice((prev) => !prev);
    } else if (result.isDismissed) {
      Swal.fire("Action Cancelled", "The invoice has not been deleted.", "info");
    }
  } catch (error) {
    toast.error("Invoice Deletion Failed");
    console.error("Error during deletion:", error);
  }
};
  return (
    <>
      {timeFrame === "daily" ? (
        <tr className="grid grid-cols-12  hover:bg-gray-50 text-lg text-center font-semibold">
          <td className="col-span-1 text-left font-normal">
            <p className="py-3">{index + 1}</p>
          </td>
          <td className="col-span-2">
            <h3 className="text-sm font-normal mr-3 py-4">{data?.receipt_no}</h3>
          </td>

          <td className="col-span-2 text-sm text-left font-normal">
            <h5 className="mr-2 py-2">
              {data?.member_name} <span>({data?.member_id})</span>
            </h5>
          </td>

          <td className="text-sm col-span-1 font-normal text-center ">
            <h5 className="py-2">
              <span className="text-nowrap">{moment(data?.admission_date).format("DD-MM")}</span> <br />
              {moment(data?.admission_date).format("HH:mm")}
            </h5>

          </td>
          <td className="text-sm col-span-1 font-normal text-center ">
            <h5 className="py-4">{data?.admissionFee}</h5>
          </td>
          <td className="text-sm col-span-1 font-normal text-center ">
            <h5 className="py-4">{data?.packageFee}</h5>
          </td>

          <td className="text-sm col-span-1 font-normal text-center ">
            <h5 className="py-4">{data?.discount}</h5>
          </td>
          <td className="text-sm col-span-1 font-normal text-center ">
            <h5  className="py-4">{data?.payment_method}</h5>
          </td>
          <td className="col-span-2 text-sm text-right flex gap-6  font-normal justify-end">
            <h5  className="py-4">
              {parseInt(data?.admissionFee) +
                parseInt(data?.packageFee) -
                parseInt(data?.discount)}
            </h5>
            <button
              className="flex  text-red-500  transition-all duration-500 items-center gap-3  text-2xl hover:bg-red-200 p-2 rounded-lg"
              onClick={() => handleInvoiceDelete(data._id)}
            >
              <AiOutlineDelete />
            </button>
          </td>
        </tr>
      ) : (
        <tr className="grid grid-cols-12 items-center justify-between  border-gray-300 hover:bg-gray-50 text-xs md:text-lg md:font-semibold">
          <td className="col-span-1 text-left ">{data.date}</td>
          <td className="col-span-2 text-center  border-l border-gray-300">
            {data?.packageFees}
          </td>
          <td className="text-center col-span-3  border-l border-gray-300 ">
            {data?.admissionFees}
          </td>

          <td className=" col-span-2 text-center  border-l border-gray-300">
            {data?.monthlyFees || 0}
          </td>

          <td className="col-span-2 text-center  border-l border-gray-300">
            {data?.discount}
          </td>
          <td className="col-span-2 text-right  border-l border-gray-300">
            {data?.total}
          </td>
        </tr>
      )}
    </>
  );
}

export default ReportRow;
