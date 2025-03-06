import React, { useContext, useEffect, useState } from "react";
import TableHeader from "../../../components/partial/Headers/TableHeader/TableHeader";
import FilterHeader from "../../../components/partial/Headers/FilterHeader/FilterHeader";
import Table from "../../../components/partial/Table/Table";
import TableRow from "../../../components/partial/Table/TableRow/TableRow";
import UseAxiosSecure from "../../../Hook/UseAxioSecure";
import Modal from "../../../components/partial/Modal/Modal";
import MemberRegistration from "../../../components/partial/MemberRegistration/MemberRegistration";
import { FaImage, FaUser, FaPhone, FaEnvelope, FaCheckCircle, FaCalendarAlt, FaEllipsisV } from 'react-icons/fa';

import WriteNote from "../../../components/partial/WriteNote/WriteNote";
import Pagination from "../../../components/partial/Pagination/Pagination";
import EditMember from "../../../components/partial/MemberRegistration/EditMember/EditMember";
import MtableLoading from "../../../components library/MtableLoading";
import { FaRegEdit } from "react-icons/fa";
import useGetFilterMemberData from "../../../Hook/GetMemberData/GetFilterMemberData/useGetFilterMemberData";
import Mtitle from "/src/components library/Mtitle";
import { Global } from "@emotion/react";
import GlobalLoading from "../../../components library/GlobalLoading";
import NoDataImage from "../../../components/partial/NoDataImage/NoDataImage";
import SMSModal from "../../../components/partial/SendSMS/SMSModal";
import { AuthContext } from "../../../providers/AuthProvider";
const Members = () => {
  const [isShowRegister, setIsShowRegister] = useState(false);
  const [isShowNote, setIsShowNote] = useState(false);
  const [isShowEditMember, setIsShowEditMember] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const [userId, setUserId] = useState("");
  const [resetFields, setResetFields] = useState(0);
  const [isDeleteMember, setIsDeleteMember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSMSModalOpen, setSMSModalOpen] = useState(false);
  const [contactNumber, setContactNumber] = useState("");
  const [targetId, setTargetId] = useState("");
  const [noteData, setNoteData] = useState("");
  // const [branch, setbranch] = useState("");
  const {branch} = useContext(AuthContext);
 
  // filtering state

  const [member_id, setMember_id] = useState("");
  const [nameCardPhone, setNameCardPhone] = useState("");
  const [expiredate, setExpiredate] = useState("");
  const [blood_group, setBlood_group] = useState("");
  const [gender, setGender] = useState("");

  const {members} = useGetFilterMemberData({
    currentPage,
    setTotalItems,
    isShowEditMember,
    isShowRegister,
    resetFields,
    gender,
    blood_group,
    expiredate,
    nameCardPhone,
    member_id,
    setMember_id,
    setNameCardPhone,
    setExpiredate,
    setBlood_group,
    setGender,
    isDeleteMember,
    setIsLoading,
    isShowNote
  });

  if (isLoading) return <GlobalLoading />;

  return (
    <div className="rounded">
      {/* <DashboardTitle title="Members" /> */}
      {/* <p className="text-2xl">Total Result : {members.length}</p> */}
      <div className="w-full md:sticky -top-10 z-10 bg-slate-50 py-4">
        <div>
          <TableHeader
            setIsShowRegister={setIsShowRegister}
            totalItems={totalItems}
            setResetFields={setResetFields}
          />
        </div>
        <FilterHeader
          currentPage={currentPage}
          setTotalItems={setTotalItems}
          isShowEditMember={isShowEditMember}
          isShowRegister={isShowRegister}
          resetFields={resetFields}
          setMember_id={setMember_id}
          setNameCardPhone={setNameCardPhone}
          setExpiredate={setExpiredate}
          setBlood_group={setBlood_group}
          setGender={setGender}
          expiredate={expiredate}
          blood_group={blood_group}
          gender={gender}
        />
      </div>
      <section
        className="overflow-y-hidden md:overflow-hidden border rounded-2xl mt-5"
        style={{ scrollbarWidth: "thin" }}
      >
        <table className="table w-full">
        <thead className="text-base font-normal">
      <tr>
        <th>
          <FaImage className="inline-block mr-2" />
          Image
        </th>
        <th>
          <FaUser className="inline-block mr-2" />
          Member
        </th>
        <th>
          <FaUser className="inline-block mr-2" />
          Name
        </th>
        <th>
          <FaPhone className="inline-block mr-2" />
          Phone
        </th>
        <th>
          <FaEnvelope className="inline-block mr-2" />
          Email
        </th>
        <th>
          <FaCheckCircle className="inline-block mr-2" />
          Status
        </th>
        <th>
          <FaCalendarAlt className="inline-block mr-2" />
          Subscription
        </th>
        <th>
          <FaEllipsisV className="inline-block mr-2" />
          Actions
        </th>
      </tr>
    </thead>
          <tbody>
            {members?.length > 0 &&
              members.map((item, index) => (
                <TableRow
                  key={index}
                  data={item}
                  setIsShowEditMember={setIsShowEditMember}
                  setIsShowNote={setIsShowNote}
                  setUserId={setUserId}
                  isShowManagePackageBtn={true}
                  setIsDeleteMember={setIsDeleteMember}
                  isSMSModalOpen={isSMSModalOpen}
                  setSMSModalOpen={setSMSModalOpen}
                  contactNumber={contactNumber}
                  setContactNumber={setContactNumber}
                  branch={branch}
                  setTargetId={setTargetId}
                  setNoteData={setNoteData}
                  // setbranch={setbranch}
                />
              ))}
          </tbody>
        </table>
        {members?.length == 0 && <NoDataImage />}
        {/* {isLoading && <GlobalLoading />} */}
        {/* <MtableLoading data={members} /> */}
      </section>

      <Pagination
        // totalItems={members.length}
        totalItems={totalItems}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />

      <Modal isShowModal={isShowRegister} setIsShowModal={setIsShowRegister}>
        <MemberRegistration
          setIsShow={setIsShowRegister}
          isShow={isShowRegister}
        />
      </Modal>
      <Modal
        isShowModal={isShowEditMember}
        setIsShowModal={setIsShowEditMember}
      >
        <EditMember
          setIsShow={setIsShowEditMember}
          isShow={isShowEditMember}
          user_id={userId}
          setUserId={setUserId}
        />
      </Modal>

      <Modal isShowModal={isShowNote}>
        <WriteNote setIsShow={setIsShowNote} isShow={isShowNote} targetId={targetId} setNoteData={setNoteData} noteData={noteData} />
      </Modal>

      <SMSModal
        isOpen={isSMSModalOpen}
        onClose={() => setSMSModalOpen(false)}
        contactNumber={contactNumber}
        userbranch={branch}
      />
    </div>
  );
};

export default Members;
