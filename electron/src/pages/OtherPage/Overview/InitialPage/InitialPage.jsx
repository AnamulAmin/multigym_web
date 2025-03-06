import React, { useState } from "react";
import Stat from "./State/Stat";
import SalesChart from "./SalesChart/SalesChart";
import MemberPackage from "../../Setup/MemberPackage";
import InputDateFilter from "./InputDateFilter/InputDateFilter";
import TopPart from "./TopPart/TopPart";
import Door_log from "./DoorLog/Door_log";
import UpcomingBirthdays from "./UpcomingBirthdays/UpcomingBirthdays";
import UserOverview from "./UserOverview/UserOverview"; // Importing the new component
import { IoBalloon, IoBalloonOutline } from "react-icons/io5";
import { TbDoorExit } from "react-icons/tb";
import { TbLayoutDashboard } from "react-icons/tb";
import { IoAnalyticsOutline } from "react-icons/io5";
import GenderChart from "./GenderChart/GenderChart";
import { CgGenderMale } from "react-icons/cg";

function InitialPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [selectType, setSelectType] = useState("last30Days");

  return (
    <section>
      {/* Top part */}
      <div className="border-b sticky md:static top-0 z-30 bg-slate-50 -mt-5 md:mb-8 mb-4 pb-2 border-gray-200">
        <TopPart />
      </div>

      <div className="mb-8">
        <Stat />
        {/* <div className="gap-4 my-5 flex"></div> */}
      </div>

      <div className="md:pl-0 pb-5 md:pb-0 md:px-0 px-2">
        <section className="grid gap-3 grid-cols-1 md:grid-cols-3">
          {/* Row 1: Gender Chart and Sales Report */}
          <div className="w-full border rounded-2xl bg-white shadow">
            <div className="flex items-center justify-between">
              <p className="font-medium pl-4 text-gray-600 py-2 flex flex-row-reverse gap-2 items-center">
                Gender Distribution
                <CgGenderMale className="text-lg" />
              </p>
              <p className="pr-4 text-gray-400"></p>
            </div>
            <div className="border-t">
              <GenderChart />
            </div>
          </div>
          <div className="w-full border min-h-[295px] bg-white rounded-xl md:col-span-2 shadow">
            <div className="flex">
              <p className="font-medium pl-6 text-gray-600 py-2 flex flex-row-reverse items-center gap-2">
                Sales Report Monthly
                <IoAnalyticsOutline className="hidden md:block" />
              </p>
              <InputDateFilter
                year={year}
                setYear={setYear}
                month={month}
                setMonth={setMonth}
                selectType={selectType}
                setSelectType={setSelectType}
              />
            </div>
            <div
              className="border-t pl-8 overflow-auto"
              style={{ scrollbarWidth: "thin" }}
            >
              <SalesChart year={year} month={month} selectType={selectType} />
            </div>
          </div>

          {/* Row 2: Door logs, User overview, and Upcoming birthdays */}
          <div className="w-full max-h-[350px] overflow-hidden border rounded-2xl bg-white shadow">
            <div className="flex items-center justify-between">
              <p className="font-medium pl-4 text-gray-600 py-2 flex items-center gap-2 flex-row-reverse">
                Door Access Log
                <TbDoorExit />
              </p>
              <p className="pr-4 text-gray-400">History</p>
            </div>
            <Door_log />
          </div>

          <div className="w-full h-[350px] border rounded-2xl bg-white shadow">
            <div className="flex items-center justify-between">
              <p className="font-medium pl-4 text-gray-600 py-2 flex flex-row-reverse gap-2 items-center">
                Overview
                <TbLayoutDashboard />
              </p>
              <p className="pr-4 text-gray-400"></p>
            </div>
            <UserOverview />
          </div>

          <div className="w-full h-[350px] border rounded-2xl bg-white shadow">
            <div className="flex items-center justify-between">
              <p className="font-medium pl-4 text-gray-600 py-2 flex items-center flex-row-reverse gap-2">
                Upcoming Birthdays
                <IoBalloonOutline />
              </p>
              <p className="pr-4 text-gray-400"></p>
            </div>
            <UpcomingBirthdays />
          </div>
        </section>
      </div>

    </section>
  );
}

export default InitialPage;
