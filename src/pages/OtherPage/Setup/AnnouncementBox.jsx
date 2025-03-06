import React from "react";
import useGetCompanyData from "../../../Hook/GetCompanyData/useGetCompanyData";

export default function AnnouncementBox() {
  const profileData = useGetCompanyData();

  console.log("profileData", profileData);

  return (
    <div className="max-w-2xl mx-auto p-8 shadow-2xl bg-white rounded-lg mt-10">
      <div className="flex items-center justify-between flex-col gap-6 mb-6">
        <h2 className="text-4xl font-extrabold text-purple-700">
          {profileData.announcementPurpose}
        </h2>
        <p dangerouslySetInnerHTML={{ __html: profileData.announcementBody }} />
      </div>
    </div>
  );
}
