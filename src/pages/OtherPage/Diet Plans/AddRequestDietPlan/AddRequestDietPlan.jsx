import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import { RiDeleteBin7Line } from "react-icons/ri";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../../Hook/UseAxioSecure";
import Modal from "../../../../components/partial/Modal/Modal";
import RequestDietPlanQuestion from "./Forms/RequestDietPlanQuestion";
import EditRequestDietPlanQuestion from "./Forms/EditRequestDietPlanQuestion";
import Mtitle from "../../../../components library/Mtitle";
import { useAuth } from "../../../../providers/AuthProvider";

function AddRequestDietPlan() {
  const [isShowModal, setIsShowModal] = useState(false);
  const [paymentMethodData, setPaymentMethodData] = useState([]);
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [isShowEditModal, setIsShowEditModal] = useState(false);
  const [targetId, setTargetId] = useState("");
  const axiosSecure = UseAxiosSecure();
  const { branch } = useAuth();

  useEffect(() => {
    const fetchPaymentMethodData = async () => {
      try {
        const response = await axiosSecure.get(`/diet-plan/food-habit-question/get?${branch}`);
        setPaymentMethodData(response?.data);
      } catch (error) {
        console.error("Error fetching payment method data:", error);
      }
    };

    fetchPaymentMethodData();
  }, [axiosSecure, isShowDeleteModal, isShowModal, isShowEditModal]);

  const handleDelete = async (id) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await axiosSecure.delete(`/diet-plan/food-habit-question/delete/${id}?branch=${branch}`);

          if (response.status === 200 || response.status === 201) {
            setIsShowDeleteModal((prev) => !prev);
            Swal.fire({
              title: "Success",
              text: "Payment method deleted successfully",
              icon: "success",
              confirmButtonText: "Ok",
            });
          }
        }
      });
    } catch (error) {
      console.log("error", error);
      Swal.fire({
        title: "Error",
        text: `Something went wrong`,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  return (
    <div className="px-3">
      <div className="pl-2">
        <Mtitle
          title="Add Request Diet Plan"
          rightcontent={
            <div
              className="flex mt-3 md:mt-0 items-center gap-2 justify-center px-3 py-2 rounded-xl hover:bg-yellow-600 bg-yellow-500 text-white cursor-pointer"
              onClick={() => setIsShowModal(true)}
            >
              <FaPlus />
              <h3 className="font-semibold">Add New</h3>
            </div>
          }
        />
      </div>

      <div className="border flex-col py-4 px-2 md:px-6 rounded-xl">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className=" text-white rounded-xl">
                <th className="text-left rounded-l-xl bg-yellow-500">Name</th>
                <th className="text-left bg-yellow-500">Label</th>
                <th className="text-left bg-yellow-500">Field Type</th>
                <th className="text-right rounded-r-xl bg-yellow-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {paymentMethodData?.length > 0 ? (
                paymentMethodData.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-100">
                    <td>{item?.name}</td>
                    <td>{item?.label.length > 50 ? item?.label.slice(0, 50) + "..." : item?.label}</td>
                    <td>{item?.field_type}</td>
                    <td className="text-right">
                      <div className="flex justify-end space-x-4">
                        <button
                          className="hover:bg-blue-100 text-white p-1 rounded"
                          onClick={() => {
                            setTargetId(item?._id);
                            setIsShowEditModal(true);
                          }}
                        >
                          <FiEdit3 className="text-blue-500 text-xl" />
                        </button>
                        <button
                          className="hover:bg-red-100 text-white p-1 rounded"
                          onClick={() => handleDelete(item?._id)}
                        >
                          <RiDeleteBin7Line className="text-red-500 text-xl" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center h-96">
                    <div>
                      <h1 className="text-2xl font-semibold">No Payment Method Found</h1>
                      <p className="text-gray-500 text-sm">No payment method found with this search criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <Modal isShowModal={isShowEditModal} setIsShowModal={setIsShowEditModal}>
        <EditRequestDietPlanQuestion
          setIsShowModal={setIsShowEditModal}
          isShowModal={isShowEditModal}
          targetId={targetId}
        />
      </Modal>
      <Modal isShowModal={isShowModal} setIsShowModal={setIsShowModal}>
        <RequestDietPlanQuestion
          setIsShowModal={setIsShowModal}
          isShowModal={isShowModal}
        />
      </Modal>
    </div>
  );
}

export default AddRequestDietPlan;
