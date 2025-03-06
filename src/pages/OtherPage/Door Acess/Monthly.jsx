import React, { useState, useEffect, useContext } from 'react';
import DashboardTitle from "../../../components/DashboardTitle/Title";
import { FiFileText } from 'react-icons/fi';
import axios from 'axios'; // Make sure you have axios installed
import UseAxiosSecure from '../../../Hook/UseAxioSecure';
import Mtitle from "/src/components library/Mtitle";
import { IoFilterOutline } from "react-icons/io5";
import { TbFileExport } from "react-icons/tb";
import { AuthContext } from '../../../providers/AuthProvider';

const MonthlyDoor = () => {
    const [month, setMonth] = useState('9');
    const [year, setYear] = useState('2024');
    const [userType, setUserType] = useState('ALL');
    const [gender, setGender] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const axiosSecure = UseAxiosSecure();
    const {branch} = useContext(AuthContext);
    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosSecure.get(`/device-logs/filter/${year}/${month}/${userType}/${gender}/${branch}`);
                setMembers(response.data);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, [month, year, userType, gender]);

    // Filter members based on search query
    const filteredMembers = members.filter(member =>
        member.memberName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle member click
    const handleMemberClick = (member) => {
        setSelectedMember(member);
    };

    const handleExportPDF = () => {
        console.log(`Exporting report for ${month} ${year}, ${userType}, ${gender}`);
        // Logic to export the report as PDF
    };
    const selectClass = "select border focus:border-yellow-500 appearance-none text-gray-700 text-sm  shadow rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline"
    return (
        <div className="p-4 md:p-6">
            <Mtitle title="Monthly Attendance Report"
                rightcontent={
                    <div className="flex  gap-1 md:mt-0 mt-3" >
                        <input
                        type="text"
                        placeholder="Search name"
                        className=" focus:border-yellow-500  md:hidden block appearance-none text-gray-700 text-sm  shadow rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                        <button className="bg-yellow-500 btn shadow rounded-xl text-white hover:bg-yellow-600  flex items-center gap-2 flex-row-reverse"><TbFileExport  className='text-xl'/> EXPORT REPORT</button>
                    </div>
                }
            ></Mtitle>


            {/* filter div */}
            <div className='flex justify-between mb-6'>
                <div className='hidden md:block'>
                    <h3 className="font-semibold text-lg border max-w-max p-2 pr-5 rounded-xl pr- flex items-center gap-3 "><span><IoFilterOutline></IoFilterOutline></span> Filter Report</h3>
                </div>
                <div className='flex gap-3 md:w-10/12'>
                    <select
                        className={selectClass}
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                    >
                        <option value="1">January</option>
                        <option value="2">February</option>
                        <option value="3">March</option>
                        <option value="4">April</option>
                        <option value="5">May</option>
                        <option value="6">June</option>
                        <option value="7">July</option>
                        <option value="8">August</option>
                        <option value="9">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>

                    <select
                        className={selectClass}
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    >
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        {/* Add more years as needed */}
                    </select>

                    <select
                        className={selectClass}
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                    >
                        <option value="STAFF">STAFF</option>
                        <option value="MEMBER">MEMBER</option>
                        <option value="ALL">ALL USER</option>
                    </select>

                    <select
                        className={selectClass}
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                    >
                        <option value="MALE">MALE</option>
                        <option value="FEMALE">FEMALE</option>
                        <option value="ALL">ALL GENDER</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Search name"
                        className=" focus:border-yellow-500 hidden md:block appearance-none text-gray-700 text-sm  shadow rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            {/* ... */}
            <div className="flex md:flex-row flex-col md:border rounded-xl mt-7 gap-4">
                {/* Left-side  member list */}
                <div className="md:w-1/4  border-r max-h-44 overflow-scroll md:max-h-min">
                    <div className="h-[550px] mt-2 overflow-y-auto">
                        <ul className=' md:pl-2'>
                            {filteredMembers.map((member, index) => (
                                <li
                                    key={index}
                                    className={`p-2 hover:bg-gray-200 rounded-l-xl cursor-pointer ${selectedMember && selectedMember.memberName === member.memberName
                                            ? 'border-r border-yellow-500 bg-gray-100'
                                            : ''
                                        }`}
                                    onClick={() => handleMemberClick(member)}
                                >
                                    {member.memberName}
                                </li>
                            ))}
                        </ul>

                    </div>
                </div>

                {/* Right-side report table */}
                <div className="md:w-3/4">

                    {selectedMember ? (
                        <div className="overflow-x-auto shadow-sm rounded-xl  p-4">
                            <h3 className="font-semibold text-lg mb-2">Attendance Report for {selectedMember.memberName}</h3>
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>SL.No.</th>
                                        <th>Date</th>
                                        <th>In Time</th>
                                        <th>Out Time</th>
                                        <th>Hours</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedMember.punch.map((punch, index) => {
                                        // Handle invalid or undefined date values
                                        const inTime = new Date(punch.punchinTime);
                                        const outTime = new Date(punch.punchOutTime);

                                        const isInValid = isNaN(inTime.getTime());
                                        const isOutValid = isNaN(outTime.getTime());

                                        // Calculate hours if both times are valid
                                        const hours = isInValid || isOutValid ? 0 : (outTime - inTime);
                                        const hoursFormatted = isInValid || isOutValid ? '-' : new Date(hours).toISOString().substr(11, 8);

                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{punch.Date}</td>
                                                <td>{isInValid ? '-' : inTime.toLocaleTimeString()}</td>
                                                <td>{isOutValid ? '-' : outTime.toLocaleTimeString()}</td>
                                                <td>{hoursFormatted}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500 mt-4 text-lg">Select a member to view detailed attendance</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MonthlyDoor;
