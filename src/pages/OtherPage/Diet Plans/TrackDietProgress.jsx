import React, { useState } from "react";
import DashboardTitle from "../../../components/partial/DashboardTitle/Title";
import Mtitle from "/src/components library/Mtitle";

const TrackDietProgress = () => {
  // Fake Data for demonstration purposes
  const memberData = [
    {
      id: 1,
      name: "Rahim Ahmed",
      weight: "85 kg",
      goal: "80 kg",
      progress: 75,
      caloriesConsumed: "1800 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0001.JPG",
      memberId: "001"
    },
    {
      id: 2,
      name: "Fatema Begum",
      weight: "70 kg",
      goal: "65 kg",
      progress: 60,
      caloriesConsumed: "1500 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0002.JPG",
      memberId: "002"
    },
    {
      id: 3,
      name: "Sakib Hasan",
      weight: "90 kg",
      goal: "85 kg",
      progress: 50,
      caloriesConsumed: "2000 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0003.JPG",
      memberId: "003"
    },
    {
      id: 4,
      name: "Nasima Akter",
      weight: "65 kg",
      goal: "60 kg",
      progress: 45,
      caloriesConsumed: "1400 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0004.JPG",
      memberId: "004"
    },
    {
      id: 5,
      name: "Anika Rahman",
      weight: "75 kg",
      goal: "70 kg",
      progress: 55,
      caloriesConsumed: "1700 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0005.JPG",
      memberId: "005"
    },
    {
      id: 6,
      name: "Mitu Chowdhury",
      weight: "62 kg",
      goal: "57 kg",
      progress: 65,
      caloriesConsumed: "1300 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0006.JPG",
      memberId: "006"
    },
    {
      id: 7,
      name: "Tanvir Ahmed",
      weight: "95 kg",
      goal: "88 kg",
      progress: 40,
      caloriesConsumed: "2200 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0007.JPG",
      memberId: "007"
    },
    {
      id: 8,
      name: "Raisa Khan",
      weight: "68 kg",
      goal: "60 kg",
      progress: 35,
      caloriesConsumed: "1600 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0008.JPG",
      memberId: "008"
    },
    {
      id: 9,
      name: "Faruk Hossain",
      weight: "83 kg",
      goal: "78 kg",
      progress: 50,
      caloriesConsumed: "1800 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0009.JPG",
      memberId: "009"
    },
    {
      id: 10,
      name: "Laila Noor",
      weight: "73 kg",
      goal: "67 kg",
      progress: 55,
      caloriesConsumed: "1500 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0010.JPG",
      memberId: "010"
    },
    {
      id: 11,
      name: "Mahmudur Rahman",
      weight: "88 kg",
      goal: "82 kg",
      progress: 65,
      caloriesConsumed: "1900 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0011.JPG",
      memberId: "011"
    },
    {
      id: 12,
      name: "Nusrat Islam",
      weight: "69 kg",
      goal: "62 kg",
      progress: 60,
      caloriesConsumed: "1400 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0012.JPG",
      memberId: "012"
    },
    {
      id: 13,
      name: "Kamran Khan",
      weight: "80 kg",
      goal: "75 kg",
      progress: 70,
      caloriesConsumed: "1800 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0013.JPG",
      memberId: "013"
    },
    {
      id: 14,
      name: "Salma Begum",
      weight: "64 kg",
      goal: "60 kg",
      progress: 65,
      caloriesConsumed: "1300 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0014.JPG",
      memberId: "014"
    },
    {
      id: 15,
      name: "Roksana Khatun",
      weight: "78 kg",
      goal: "72 kg",
      progress: 60,
      caloriesConsumed: "1700 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0015.JPG",
      memberId: "015"
    },
    {
      id: 16,
      name: "Shirin Nahar",
      weight: "72 kg",
      goal: "65 kg",
      progress: 45,
      caloriesConsumed: "1500 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0016.JPG",
      memberId: "016"
    },
    {
      id: 17,
      name: "Nadim Karim",
      weight: "85 kg",
      goal: "78 kg",
      progress: 55,
      caloriesConsumed: "1800 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0017.JPG",
      memberId: "017"
    },
    {
      id: 18,
      name: "Rina Akter",
      weight: "68 kg",
      goal: "60 kg",
      progress: 65,
      caloriesConsumed: "1400 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0018.JPG",
      memberId: "018"
    },
    {
      id: 19,
      name: "Shafik Rahman",
      weight: "92 kg",
      goal: "85 kg",
      progress: 35,
      caloriesConsumed: "2100 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0019.JPG",
      memberId: "019"
    },
    {
      id: 20,
      name: "Tania Jahan",
      weight: "74 kg",
      goal: "68 kg",
      progress: 70,
      caloriesConsumed: "1500 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0020.JPG",
      memberId: "020"
    },
    {
      id: 21,
      name: "Arif Islam",
      weight: "82 kg",
      goal: "75 kg",
      progress: 65,
      caloriesConsumed: "1900 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0021.JPG",
      memberId: "021"
    },
    {
      id: 22,
      name: "Rokeya Sultana",
      weight: "68 kg",
      goal: "62 kg",
      progress: 60,
      caloriesConsumed: "1400 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0022.JPG",
      memberId: "022"
    },
    {
      id: 23,
      name: "Jashim Hossain",
      weight: "89 kg",
      goal: "80 kg",
      progress: 50,
      caloriesConsumed: "2000 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0023.JPG",
      memberId: "023"
    },
    {
      id: 24,
      name: "Samira Khan",
      weight: "75 kg",
      goal: "70 kg",
      progress: 55,
      caloriesConsumed: "1600 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0024.JPG",
      memberId: "024"
    },
    {
      id: 25,
      name: "Bashir Uddin",
      weight: "96 kg",
      goal: "85 kg",
      progress: 40,
      caloriesConsumed: "2200 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0025.JPG",
      memberId: "025"
    },
    {
      id: 26,
      name: "Nazia Hasan",
      weight: "72 kg",
      goal: "66 kg",
      progress: 65,
      caloriesConsumed: "1500 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0026.JPG",
      memberId: "026"
    },
    {
      id: 27,
      name: "Sadiq Rahman",
      weight: "88 kg",
      goal: "80 kg",
      progress: 55,
      caloriesConsumed: "2000 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0027.JPG",
      memberId: "027"
    },
    {
      id: 28,
      name: "Parvin Akter",
      weight: "69 kg",
      goal: "64 kg",
      progress: 60,
      caloriesConsumed: "1400 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0028.JPG",
      memberId: "028"
    },
    {
      id: 29,
      name: "Mizanur Rahman",
      weight: "91 kg",
      goal: "83 kg",
      progress: 55,
      caloriesConsumed: "2100 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0029.JPG",
      memberId: "029"
    },
    {
      id: 30,
      name: "Asma Sultana",
      weight: "65 kg",
      goal: "60 kg",
      progress: 70,
      caloriesConsumed: "1300 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0030.JPG",
      memberId: "030"
    },
    {
      id: 31,
      name: "Kamal Hossain",
      weight: "86 kg",
      goal: "80 kg",
      progress: 60,
      caloriesConsumed: "1900 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0031.JPG",
      memberId: "031"
    },
    {
      id: 32,
      name: "Rehana Aktar",
      weight: "67 kg",
      goal: "63 kg",
      progress: 65,
      caloriesConsumed: "1400 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0032.JPG",
      memberId: "032"
    },
    {
      id: 33,
      name: "Shahidul Islam",
      weight: "92 kg",
      goal: "85 kg",
      progress: 45,
      caloriesConsumed: "2100 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0033.JPG",
      memberId: "033"
    },
    {
      id: 34,
      name: "Shamima Begum",
      weight: "74 kg",
      goal: "68 kg",
      progress: 70,
      caloriesConsumed: "1500 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0034.JPG",
      memberId: "034"
    },
    {
      id: 35,
      name: "Abdul Kader",
      weight: "95 kg",
      goal: "88 kg",
      progress: 50,
      caloriesConsumed: "2200 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0035.JPG",
      memberId: "035"
    },
    {
      id: 36,
      name: "Rasheda Khan",
      weight: "70 kg",
      goal: "65 kg",
      progress: 60,
      caloriesConsumed: "1500 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0036.JPG",
      memberId: "036"
    },
    {
      id: 37,
      name: "Rakib Hossain",
      weight: "89 kg",
      goal: "82 kg",
      progress: 65,
      caloriesConsumed: "2000 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0037.JPG",
      memberId: "037"
    },
    {
      id: 38,
      name: "Lubna Ahmed",
      weight: "63 kg",
      goal: "58 kg",
      progress: 55,
      caloriesConsumed: "1300 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0038.JPG",
      memberId: "038"
    },
    {
      id: 39,
      name: "Hassan Khan",
      weight: "88 kg",
      goal: "80 kg",
      progress: 50,
      caloriesConsumed: "2000 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0039.JPG",
      memberId: "039"
    },
    {
      id: 40,
      name: "Ruma Chowdhury",
      weight: "71 kg",
      goal: "66 kg",
      progress: 60,
      caloriesConsumed: "1400 kcal/day",
      pictureUrl: "https://mgpwebaps.s3.eu-north-1.amazonaws.com/Sample+Person+Image+/IMG0040.JPG",
      memberId: "040"
    }
    // Add more member objects as per your requirements
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  
  // Filtered members based on search term
  const filteredMembers = memberData.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.memberId.includes(searchTerm)
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const displayedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 md:p-8">
      <Mtitle title="Members' Progress Report" />
      <div className="mt-6 mb-4">
        <input
          type="text"
          placeholder="Search by name or member ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white shadow-md rounded-md p-4 border border-gray-200"
          >
            <img
              src={member.pictureUrl}
              alt={`${member.name}`}
              className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
            />
            <h3 className="text-lg font-bold text-center">{member.name}</h3>
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold">Current Weight:</span> {member.weight}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              <span className="font-semibold">Goal Weight:</span> {member.goal}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              <span className="font-semibold">Calories Consumed:</span> {member.caloriesConsumed}
            </p>
            <div className="mt-3">
              <p className="text-sm font-semibold mb-1">Progress:</p>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-green-500 h-4 rounded-full"
                  style={{ width: `${member.progress}%` }}
                ></div>
              </div>
              <p className="text-xs mt-1 text-center">{member.progress}% of Goal</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 bg-blue-500 text-white rounded-md ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Previous
        </button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 bg-blue-500 text-white rounded-md ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TrackDietProgress;