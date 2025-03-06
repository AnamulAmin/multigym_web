import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
// import Header from './../../components/Header/header';
import Sidebar from "./../../components/Sidebar/Sidebar";
import { ChevronRight } from "lucide-react";
import ToggleSidebarBtn from "../../components/Sidebar/ToggleSidebarBtn/ToggleSidebarBtn";
import useGetCompanyData from "../../Hook/GetCompanyData/useGetCompanyData";
import Modal from "../../components/partial/Modal/Modal";
import AnnouncementBox from "../OtherPage/Setup/AnnouncementBox";

const Root_Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const profileData = useGetCompanyData();

  console.log("profileData", profileData, "root data");
  const [isShowAnnouncement, setIsShowAnnouncement] = useState(false);

  useEffect(() => {
    if (profileData.announcementEnabled) {
      setIsShowAnnouncement(true);
    }
  }, [profileData]);
  return (
    <div className="grid grid-cols-[auto_1fr]">
      <Sidebar isCollapsed={isCollapsed} />
      {/* <Header/> */}
      <div className="md:p-8 bg-slate-50 h-dvh overflow-auto relative">
        <ToggleSidebarBtn
          setIsCollapsed={setIsCollapsed}
          isCollapsed={isCollapsed}
        />
        <Outlet />
      </div>

      <Modal
        isShowModal={isShowAnnouncement}
        // isShowModal={true}
        setIsShowModal={setIsShowAnnouncement}
      >
        <AnnouncementBox />
      </Modal>
    </div>
  );
};

export default Root_Dashboard;
