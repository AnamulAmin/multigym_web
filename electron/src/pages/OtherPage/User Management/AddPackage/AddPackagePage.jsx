import { useCallback, useRef, useState } from "react";
import TableHeader from "../../../../components/partial/Headers/TableHeader/TableHeader";
import Table from "../../../../components/partial/Table/Table";
import Modal from "../../../../components/partial/Modal/Modal";
import { useParams } from "react-router-dom";
import AddPackageFilter from "./AddPackageFilter/AddPackageFilter";
import TableRow from "../../../../components/partial/Table/TableRow/TableRow";
import Pagination from "../../../../components/partial/Pagination/Pagination";
import AddPackageForm from "./AddPackageForm/AddPackageForm";
import useInvoiceData from "../../../../Hook/GetInvoiceData/GetInvoiceData";
import PrintModal from "../../../../components/partial/Modal/PrintModal/PrintModal";
import PrintTemplate from "../../../../config/PrintTemplate/PrintTemplate";
import useGetSingleMemberData from "../../../../Hook/GetMemberData/useGetSingleMemberData";
import A4PrintTemplate from "../../../../config/PrintTemplate/A4PrintTemplate/A4PrintTemplate";
import { useReactToPrint } from "react-to-print";
import UseAxiosSecure from "../../../../Hook/UseAxioSecure";
import Swal from "sweetalert2";
import { useAuth } from "../../../../providers/AuthProvider";

function AddPackagePage() {
  const [isShowAddPackage, setIsShowAddPackage] = useState(false);
  const [isShowNote, setIsShowNote] = useState(false);
  const [isShowEditMember, setIsShowEditMember] = useState(false);
  const [isShowManagePackage, setIsShowManagePackage] = useState(false);
  // const [members, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const [userId, setUserId] = useState("");
  const [resetFields, setResetFields] = useState(0);
  const [isShowPrint, setIsShowPrint] = useState(false);
  const [printData, setPrintData] = useState(null);
  const [member_id, setMember_id] = useState("");
  const [nameCardPhone, setNameCardPhone] = useState("");
  const [printType, setPrintType] = useState("");
  const [isDeleteMember, setIsDeleteMember] = useState(false);
  const [isDeleteInvoice, setIsDeleteInvoice] = useState(false);

  const { user } = useAuth();

  const axiosSecure = UseAxiosSecure();

  const { id: param_member_id } = useParams();
  const members = useGetSingleMemberData({
    currentPage,
    setTotalItems,
    isShowEditMember,
    resetFields,
    param_member_id,
    nameCardPhone,
    member_id,
    isShowAddPackage,
    isDeleteMember,
    isDeleteInvoice,
  });

  console.log(members, "members");

  const { invoiceData } = useInvoiceData({
    id: param_member_id,
    isShowAddPackage,
    isShowEditMember,
    isDeleteInvoice,
   
  });

  console.log("invoiceData", invoiceData);

  const resetPrintData = () => {
    setIsShowPrint(false);
    setPrintData(null);
    setPrintType("");
  };

  const handleA4Print = useReactToPrint({
    content: () => document.getElementById("A4-print-template"),
  });
  const handleThermalPrint = useReactToPrint({
    content: () => document.getElementById("print-template"),
  });

  const handlePrint = useCallback(() => {
    if (printType === "thermal" && printData) {
      handleThermalPrint();
      console.log("handleThermalPrint");
    } else if (printType === "A4Print" && printData) {
      handleA4Print();
      console.log("handleA4Print");
    }
  }, [printType, printData, handleThermalPrint, handleA4Print]);

  const handleGetPrintData = async (id, print_type) => {
    console.log("id", id, "print_type", print_type);
    try {
      const res = await axiosSecure.get(`/invoice/get-id/${id}?branch=${user?.branch}`);
      if (res.status === 200) {
        if (print_type === "" || print_type === undefined) {
          setPrintType(printType);
        } else {
          setPrintType(print_type);
        }
        setIsShowPrint(true);
        setPrintData(res.data);
        console.log("res.data", res.data);
      } else {
        Swal.fire({
          title: "Error!",
          text: res.data.message || "Failed to get Data.",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to get Data.",
        icon: "error",
      });
    }
  };

  return (
    <div className="p-5">
      {/* <DashboardTitle title="Members" /> */}
      {/* <TableHeader
        setIsShowAddPackage={setIsShowAddPackage}
        totalItems={totalItems}
        setResetFields={setResetFields}
        isMember={false}
      /> */}
      {/* <AddPackageFilter
        setMember_id={setMember_id}
        setNameCardPhone={setNameCardPhone}
      /> */}
      <div className="">
        <Table>
          {members &&
            members?.length > 0 &&
            members.map((item, index) => (
              <TableRow
                invoiceData={invoiceData && invoiceData}
                key={index}
                data={item}
                setIsShowEditMember={setIsShowEditMember}
                setIsShowNote={setIsShowNote}
                setUserId={setUserId}
                setIsShowAddPackage={setIsShowAddPackage}
                setIsShowManagePackage={setIsShowManagePackage}
                isAddPackageBtn={true}
                setIsDeleteMember={setIsDeleteMember}
                setIsDeleteInvoice={setIsDeleteInvoice}
                userId={userId}
                setIsShowPrint={setIsShowPrint}
                setPrintData={setPrintData}
                setPrintType={setPrintType}
                printData={printData}
                handleGetPrintData={handleGetPrintData}
              />
            ))}
        </Table>
      </div>
      {/* <Pagination
        // totalItems={members.length}
        totalItems={totalItems}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      /> */}

      <Modal
        isShowModal={isShowAddPackage}
        setIsShowModal={setIsShowAddPackage}
      >
        <AddPackageForm
          setIsShow={setIsShowAddPackage}
          isShow={isShowAddPackage}
          userId={userId}
          setIsShowPrint={setIsShowPrint}
          setPrintData={setPrintData}
          setPrintType={setPrintType}
          printData={printData}
          handleGetPrintData={handleGetPrintData}
        />
      </Modal>
      <PrintModal
        isShowModal={printType === "thermal" && printData}
        setIsShowModal={setPrintType}
        resetPrintData={resetPrintData}
        handlePrint={handlePrint}
      >
        <PrintTemplate data={printData} handlePrint={handleThermalPrint} />
      </PrintModal>
      <PrintModal
        isShowModal={printType === "A4Print" && printData}
        setIsShowModal={setPrintType}
        resetPrintData={resetPrintData}
        handlePrint={handlePrint}
      >
        <A4PrintTemplate data={printData} handlePrint={handleA4Print} />
      </PrintModal>
    </div>
  );
}

export default AddPackagePage;
