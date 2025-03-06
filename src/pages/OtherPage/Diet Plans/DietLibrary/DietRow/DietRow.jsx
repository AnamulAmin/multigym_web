import moment from "moment";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../../../Hook/UseAxioSecure";
import { GrView } from "react-icons/gr";
import { MdOutlineEditCalendar } from "react-icons/md";
import { FiEdit3 } from "react-icons/fi";
import { BsSend } from "react-icons/bs";

function DietRow({
  item,
  setIsDeleted,
  //   setIsDeleteDiet,
  setIsShowUserSearch,
  setDietId,
  setIsShowViewDietModal,
  setShowAddDietForm,
}) {
  const axiosSecure = UseAxiosSecure();
  const handleDelete = async (id) => {
    try {
      Swal.fire({
        title: "Do you want to Delete the item?",

        showCancelButton: true,
        confirmButtonText: "Delete",
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          const res = await axiosSecure.delete(`/diet-plan/delete/${id}`);
          console.log("res 16561", res);
          toast.success("Member Deleted Successfully");
          setIsDeleted(true);
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
    } catch (error) {
      toast.error("Member Deleted Failed");
      console.error("res 16561", error);
    }
  };
  return (
    <tr role="row" className="odd" key={item._id}>
      <td className="border-b-2 border-dotted">
        <div className="text-left space-y-2 col-span-2">
          <h3 className="md:text-2xl font-semibold">{item?.dietName}</h3>
        </div>
      </td>
      <td>
        <div className="body flex items-center border-bottom-1 md:pt-5 justify-end">
          <button
            className="md:mr-4 flex items-center gap-2 cursor-pointer p-2 hover:bg-blue-200 hover:text-gray-600  text-yellow-950 rounded-lg transition-all duration-500"
            onClick={() => {
              setShowAddDietForm(true);
              setDietId(item?._id);
            }}
          >
            <FiEdit3 className=" md:text-xl" />
          </button>
          <button
            className="md:mr-4 flex items-center gap-2 cursor-pointer p-2 hover:bg-blue-200 hover:text-blue-500 rounded-lg transition-all duration-500"
            onClick={() => {
              setIsShowViewDietModal(true);
              setDietId(item?._id);
            }}
          >
            <GrView className="text-blue-500 md:text-xl" />
          </button>

          <button
            className="flex  hover:text-red-500  transition-all duration-500 items-center gap-3 text-gray-600 flex-row-reverse text-2xl hover:bg-red-200 p-2 rounded-lg mr-3"
            onClick={() => handleDelete(item?._id)}
          >
            <AiOutlineDelete className="text-base md:text-xl" />
          </button>

          <button
            className="px-2 md:px-3 flex items-center font-semibold bg-blue-500 hover:bg-blue-600 text-white gap-1 md:gap-2 py-1 md:p-2 rounded-xl transition-all duration-500 "
            onClick={() => {
              setIsShowUserSearch(true);
              setDietId(item?._id);
            }}
          >
            <BsSend />
            <span>Send</span>
          </button>
        </div>
      </td>
    </tr>
  );
}

export default DietRow;
