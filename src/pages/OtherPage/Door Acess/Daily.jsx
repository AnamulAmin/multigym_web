import React, { useState, useEffect, useContext } from 'react';
import { FiFileText, FiSend } from 'react-icons/fi'; // Import the send icon
import UseAxiosSecure from '../../../Hook/UseAxioSecure';
import Swal from 'sweetalert2';
import { TbReportAnalytics } from "react-icons/tb";
import Mtitle from "/src/components library/Mtitle";
import { IoFilterOutline } from "react-icons/io5";
import {TbMessageDots} from "react-icons/tb";
import { FaRegFilePdf } from "react-icons/fa6";
import { AuthContext } from '../../../providers/AuthProvider';
const DailyDoor = () => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date
    const [gender, setGender] = useState('ALL');
    const {branch} = useContext(AuthContext);
    const [userType, setUserType] = useState('ALL');
    const [logs, setLogs] = useState([]);
    const axiosSecure = UseAxiosSecure();

    const fetchLogs = async () => {
        try {
            const url = `/device-logs/filter/${userType}/${date}/${gender}/${branch}`;
            const response = await axiosSecure.get(url);
            setLogs(response.data);
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
    };

    const handleViewReport = () => {
        // Fetch filtered data when the user clicks the "VIEW REPORT" button
        fetchLogs();
        Swal.fire('Report Viewed!', 'The report has been updated based on your filters.', 'success');
    };

    const selectClass = "select border focus:border-yellow-500 appearance-none text-gray-700 text-sm  shadow rounded-xl w-full py-3 md:px-3 leading-tight focus:outline-none focus:shadow-outline"

    useEffect(() => {
        // Initially fetch logs when the component mounts
        fetchLogs();
    }, []); // Empty dependency array to run only on mount

    const handleExportPDF = () => {
        // Logic to export the current data to PDF
        console.log(`Date: ${date}, Gender: ${gender}, User Type: ${userType}`);
        Swal.fire('Exported!', 'The report has been exported as a PDF.', 'success');
    };

    const calculateHours = (inTime, outTime) => {
        const inDate = new Date(inTime);
        const outDate = new Date(outTime);
        const diffMs = outDate - inDate;
        const diffHrs = diffMs / (1000 * 60 * 60);
        return diffHrs.toFixed(2); // Return hours rounded to two decimal places
    };

    const getHoursStyle = (hours) => {
        if (hours < 2) {
            return { color: 'black' };
        } else if (hours >= 2.25 && hours <= 7) { // 2.25 hours = 2 hours 15 minutes
            return { color: 'red' };
        } else if (hours > 7) {
            return { color: 'green' };
        }
        return { color: 'black' }; // Default to black for anything else
    };

    const handleSendSMS = (log) => {
        // Logic to send SMS
        Swal.fire('SMS Sent!', `SMS has been sent to ${log.memberName}.`, 'success');
    };

    return (
        <div className="md:p-6 px-3">
            {/* Dashboard Title */}
            <Mtitle title="Daily Attendence Report" rightcontent={
                <div className='flex md:mt-0 mt-3 gap-3'>
                    <button className="bg-red-500 btn shadow rounded-xl text-white hover:bg-red-600  flex items-center gap-2 flex-row-reverse" onClick={handleViewReport}><TbReportAnalytics className='text-lg ' /> VIEW REPORT</button>
                    <button className="bg-yellow-500 btn shadow rounded-xl text-white hover:bg-yellow-600  flex items-center gap-2 flex-row-reverse" onClick={handleExportPDF}><span><FaRegFilePdf className='' /></span>EXPORT PDF</button>

                </div>
            } ></Mtitle>
            {/* filter div */}
            <div className='md:flex  md:justify-between my-6'>
                <div className='hidden md:block'>
                    <h3 className="font-semibold md:text-lg border max-w-max p-2 md:pr-5 rounded-xl  flex items-center md:gap-3 gap-1 mb-2 md:mb-0 "><span><IoFilterOutline></IoFilterOutline></span> Filter Report</h3>
                </div>
                <div className='md:flex gap-3 grid grid-cols-3 md:w-7/12'>
                    <input
                        type="date"
                        className=" focus:border-yellow-500 appearance-none text-gray-700 text-sm  shadow rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <select
                        className={selectClass}
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                    >
                        <option value="ALL">ALL USER</option>
                        <option value="MEMBER">MEMBER</option>
                        <option value="STAFF">STAFF</option>
                    </select>
                    <select
                        className={selectClass}
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                    >
                        <option value="ALL">ALL GENDER</option>
                        <option value="MALE">MALE</option>
                        <option value="FEMALE">FEMALE</option>
                    </select>
                </div>
            </div>


            {/* Report Table */}
            <div className="overflow-x-auto border shadow-sm rounded-xl p-4 mt-5">
                <table className="table w-full">
                    <thead>
                        <tr className='text-base font-normal text-gray-500'>
                            <td>SL.No.</td>
                            <td>ID</td>
                            <td>Name</td>
                            <td>In Time</td>
                            <td>Out Time</td>
                            <td>Hours</td>
                            <td>Message</td> {/* New Action Column */}
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log, index) => {
                            const hours = calculateHours(log.punchinTime, log.punchOutTime);
                            return (
                                <tr key={log.memberID}>
                                    <td>{index + 1}</td>
                                    <td>{log.memberID}</td>
                                    <td>{log.memberName}</td>
                                    <td>{new Date(log.punchinTime).toLocaleTimeString()}</td>
                                    <td>{new Date(log.punchOutTime).toLocaleTimeString()}</td>
                                    <td style={getHoursStyle(hours)}>{hours}</td>
                                    <td>
                                        <button
                                            className="btn-circle bg-transparent border border-gray-200 btn"
                                            onClick={() => handleSendSMS(log)}
                                            title="Send SMS"
                                        >
                                            <TbMessageDots className='text-xl text-gray-500' />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {/* Pagination controls could be placed here if needed */}
            </div>
        </div>
    );
};

export default DailyDoor;
