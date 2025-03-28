import React, { useContext, useEffect, useState } from 'react';
import DashboardTitle from '../../../components/partial/DashboardTitle/Title';
import Mpagination from '../../../components library/Mpagination';
import UseAxiosSecure from '../../../Hook/UseAxioSecure';
import { TfiSearch } from 'react-icons/tfi';
import { GoPlus } from 'react-icons/go';
import Mmodal from '../../../components library/Mmodal';
import { HiOutlineUsers } from 'react-icons/hi2';
import { LuFileSpreadsheet } from "react-icons/lu";
import { LiaUndoSolid } from "react-icons/lia";
import { LuUsers } from "react-icons/lu";
import Mtitle from '/src/components library/Mtitle';
import { AuthContext } from '../../../providers/AuthProvider';
import { ColorRing } from 'react-loader-spinner';

const ClassAttendance = () => {

    const axiosSecure = UseAxiosSecure();
    const { branch } = useContext(AuthContext)
    const [classes, setClasses] = useState([])
    const [filteredClass, setFilteredClass] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [registeredUsers, setRegisteredUser] = useState([]);
    const [attendenceClassId, setAttendenceClassId] = useState(null);
    const [attendenceClassName, setAttendenceClassName] = useState(null);
    const [loading, setLoading] = useState(false);
    const openModal = () => {
        setIsOpen(true);
    };
    const closeModal = () => {
        setIsOpen(false);
    };
    useEffect(() => {
        // Filter classes based on the search term
        const results = classes.filter((cls) =>
            cls.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredClass(results);
    }, [searchTerm, classes]);

    useEffect(() => {
        fetchClasses();
    }, []);
    const ImageCompo = ({ itemId }) => {
        const [avatars, setAvatars] = useState([]);

        const [total, setTotal] = useState(0);

        useEffect(() => {
            const fetchAvatars = async () => {
                const [totalCount, fetchedAvatars] = await handleGetImage(itemId);
                setAvatars(fetchedAvatars);
                setTotal(totalCount);
            };

            if (itemId) {
                fetchAvatars();
            }
        }, [itemId]);

        return (
            <div className='md:w-16'>
                {people(avatars.length, avatars)}
            </div>
        );
    };
    const handleGetImage = async (id) => {

        const avatars = [];
        let total = 0;

        try {
            const res = await axiosSecure.get(`/classes/get-id/${id}`);
            const registeredUsers = res.data.registered;

            total = registeredUsers.length;

            // Fetch each user's avatar by their unique ID
            for (const user of registeredUsers) {
                if (user?.photo) {
                    avatars.push(user.photo); // Use the user's photo if available
                } else {
                    avatars.push("https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-600nw-1725655669.jpg"); // Default avatar
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }

        return [total, avatars];
    };
    const fetchClasses = async () => {
        try {
            setLoading(true);
            const response = await axiosSecure.get(`/classes/${branch}/get-all`);
            setClasses(response.data);
            setFilteredClass(response.data);
        } catch (error) {
            console.error('There was an error fetching the classes!', error);
        } finally {
            setLoading(false);
        }
    };
    // Utility function to format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Utility function to format time
    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const isPM = hour >= 12;
        const formattedHour = hour % 12 || 12;
        const ampm = isPM ? 'PM' : 'AM';
        return `${formattedHour}:${minutes} ${ampm}`;
    };

    const handleAttendance = id => {
        setIsOpen(true);
        setAttendenceClassId(id);
        axiosSecure.get(`/classes/get-id/${id}?branch=${branch}`)
            .then(response => {
                const { registered } = response.data;
                console.log(response.data)
                setRegisteredUser(registered)
                // setEditClassId(id);
                // openModal();
            })
            .catch(error => {
                console.error('There was an error fetching the class data!', error);
            });
    }

    const { paginatedData, paginationControls, rowsPerPageAndTotal } = Mpagination({ totalData: filteredClass ? filteredClass : classes });
    const updateAttendanceStatus = async (email, status) => {
        try {
            const response = await axiosSecure.put(`/classes/${attendenceClassId}/attendance`, {
                email,
                status,
            });
            console.log('Attendance status updated:', response.data);
            handleAttendance(attendenceClassId)
            return response.data;
        } catch (error) {
            console.error('Error updating attendance status:', error);
            throw error;
        }
    };

    return (
        <section className="p-4">
            <Mtitle title="Class Attendence" rightcontent={
                <section className='flex justify-between md:mt-0 mt-3'>
                    {/* <h2 className="text-2xl font-semibold">Class Attendence</h2> */}
                    <div className="flex justify-end gap-4 items-center md:mb-4">
                        {/* Search bar */}
                        <div className='md:w-64 border shadow-sm py-2 px-3 bg-white rounded-xl'>
                            <div className='flex items-center gap-2'>
                                <TfiSearch className='text-2xl font-bold text-gray-500' />
                                <input type="text" value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)} className='outline-none w-full' placeholder='Search class' />
                            </div>
                        </div>
                        {/* Add new button */}
                        <div className="flex gap-2 cursor-pointer items-center bg-gray-700 text-white py-2 px-4 rounded-xl shadow hover:bg-gray-800 transition duration-300">
                            <button
                                className="font-semibold"
                            >
                                Search
                            </button>
                            {/* <GoPlus className="text-xl text-white" /> */}
                        </div>
                    </div>
                </section>
            }></Mtitle>

            {/* Items per page */}
            <div className='text-sm md:text-base'>
                {rowsPerPageAndTotal}
            </div>

            {/* table */}
            <section className="overflow-x-auto border shadow-sm rounded-xl p-4 mt-5">
                <table className="table w-full">
                    <thead className="bg-gray-700">
                        <tr className="text-sm font-medium text-white text-left">
                            <td className="p-3 rounded-l-xl">Name</td>
                            <td className="p-3">Instructor</td>
                            <td className="p-3">Date and time</td>
                            {/* <td className="p-3">Time</td> */}
                            {/* <td className="p-3">Duration</td> */}
                            <td className="p-3">Location</td>
                            <td className="p-3  rounded-r-xl">Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((item, index) => (
                            <tr key={index} className="hover:bg-slate-100 hover:rounded-xl">
                                <td className="px-4 py-3 ">
                                    <div className='flex justify-between items-center'>
                                        <div>
                                            <p className='font-semibold '>{item.name}</p>
                                            <p className='text-xs'>{item.duration} mins</p>
                                        </div>
                                        {/* <p className='flex items-center gap-2'>{item.registered.length} <HiOutlineUsers className="text-gray-600" /></p> */}
                                        <ImageCompo itemId={item._id} registeredUsers={registeredUsers} />

                                    </div>
                                </td>
                                <td className="px-4 py-3">{item.instructor}</td>
                                <td className="px-4 py-3 flex flex-col gap-1"><p className='font-medium'>{formatDate(item.date)}</p> <p >{formatTime(item.time)}</p></td>
                                {/* <td className="px-4 py-3">{formatTime(item.time)}</td> */}
                                {/* <td className="px-4 py-3">{item.duration} minutes</td> */}
                                <td className="px-4 py-3">{item.location}</td>
                                <td className=" hover:text-blue-500  py-3 cursor-pointer " onClick={() => { handleAttendance(item._id); setAttendenceClassName(item.name) }}>
                                    <div className='flex items-center gap-2'>
                                        Attendence
                                        <LuFileSpreadsheet />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* use  Mpagination for pagination and MtableLoading for table loading    */}
                
                {
                    loading ?
                    <>
                        <div className="flex justify-center pt-20 pb-7">
                            <ColorRing
                                visible={true}
                                height="80"
                                width="80"
                                ariaLabel="color-ring-loading"
                                wrapperStyle={{}}
                                wrapperClass="color-ring-wrapper"
                                colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
                            />
                        </div>
                    </> :
                    classes.length === 0 &&
                    <div className='flex text-base justify-center pt-36 pb-36'>
                        <p>No classes found !</p>
                    </div>
                }
                {classes.length != 0 && classes.length > 5  && paginationControls}
            </section>

            {/* Modal part */}
            <Mmodal isOpen={isOpen} onClose={closeModal}>
                <div className='flex gap-3 mb-3'>
                    <p className='font-semibold'>{attendenceClassName && attendenceClassName} </p>
                    <p className='flex gap-2 items-center border px-2 rounded-lg'><span className='font-normal'>{registeredUsers.length}</span>
                        <LuUsers className='text-gray-600 text-sm' />
                    </p>
                </div>
                <div className='max-h-[500px] mt-2 pr-2 overflow-scroll overflow-x-hidden overflow-y-auto'>
                    {
                        registeredUsers &&
                        registeredUsers.map((item, index) => (
                            <div className='flex pr-5 rounded-2xl border justify-between mt-2'>
                                {console.log(item)}
                                <div>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask rounded-l-2xl h-12 w-12">
                                                <img
                                                    src={item.photo ? item.photo : "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-600nw-1725655669.jpg"}
                                                    alt={item.name} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold">{item.name}</div>
                                            <div className="text-sm opacity-50">{item.email}</div>
                                        </div>
                                    </div>
                                </div>
                                {
                                    item.status === "Not Marked" ?
                                        <>
                                            <div className='flex gap-5 '>
                                                <button className='hover:text-green-800  transition-colors duration-100 ease-in-out' onClick={() => { updateAttendanceStatus(item.email, "Present") }}>Present</button>
                                                <button className='hover:text-red-800 transition-colors duration-100 ease-in-out' onClick={() => { updateAttendanceStatus(item.email, "Absent") }}>Absent</button>

                                            </div>
                                        </> : <>
                                            <div className='flex gap-5 items-center'>
                                                <p className={`${item.status === 'Present' ? 'text-green-500' : 'text-red-500'} font-semibold`}>
                                                    {item.status}
                                                </p>

                                                <button onClick={() => { updateAttendanceStatus(item.email, "Not Marked") }}>
                                                    <LiaUndoSolid className='hover:text-gray-600' />
                                                </button>
                                            </div>
                                        </>
                                }
                            </div>
                        ))
                    }
                    {
                        registeredUsers.length == 0 &&
                        <div className='py-4'>
                            No registered users found
                        </div>
                    }
                </div>
            </Mmodal>
        </section>
    );
};

const people = (total, avatars) => {
    return (
        <div className="avatar-group -space-x-3 rtl:space-x-reverse">
            {avatars.slice(0, 3).map((avatar, index) => (
                <div key={index} className="avatar">
                    <div className="w-5">
                        <img src={avatar || "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-600nw-1725655669.jpg"} alt={`Avatar ${index + 1}`} />
                    </div>
                </div>
            ))}
            {total > 3 && (
                <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content w-5">
                        <span>+{total - 3}</span>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ClassAttendance;
