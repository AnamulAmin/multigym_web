import React, { useContext, useEffect, useState } from "react";
import { TfiSearch } from "react-icons/tfi";
import { GoPlus } from "react-icons/go";
import Mpagination from "../../../components library/Mpagination";
import UseAxiosSecure from "../../../Hook/UseAxioSecure";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import Mtitle from "/src/components library/Mtitle";
import { ColorRing } from "react-loader-spinner";
import { AuthContext } from "../../../providers/AuthProvider";
import Swal from "sweetalert2";


const ScheduleClasses = () => {
  // /register/:classId
  const axiosSecure = UseAxiosSecure();
  const { branch, user } = useContext(AuthContext)
  const [classes, setClasses] = useState([]);
  const [filteredClass, setFilteredClass] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
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

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const response = await axiosSecure.get(`/classes/${branch}/get-all`);
      setClasses(response.data);
      setFilteredClass(response.data);
    } catch (error) {
      console.error("There was an error fetching the classes!", error);
    } finally {
      setLoading(false)
    }
  };






  const handleRegister = async (classId) => {
    try {
      const response = await axiosSecure.post(`/classes/register/${classId}`, {
        name: user.full_name,
        email: user.email,
        photo: user.photourl,
      });

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Registration successful!',
          text: 'You have been registered successfully.',
          confirmButtonText: 'OK',
        });
        fetchClasses()
        // Additional UI update logic can go here
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Unexpected Response',
          text: 'An unexpected response was received.',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error Registering User',
        text: error.response?.data || error.message,
        confirmButtonText: 'OK',
      });
      console.error(error);
    }
  };


  // Utility function to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Utility function to format time
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const isPM = hour >= 12;
    const formattedHour = hour % 12 || 12;
    const ampm = isPM ? "PM" : "AM";
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // calling pagination funciton
  const { paginatedData, paginationControls, rowsPerPageAndTotal } =
    Mpagination({ totalData: filteredClass ? filteredClass : classes });

  return (
    <>
      <section className="p-4">
        <Mtitle title="Shedule Classes"
          rightcontent={
            <section className='flex justify-between mt-3 md:mt-0'>
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
                <div className="flex md:gap-2 gap-1 cursor-pointer items-center bg-yellow-500 text-white py-2 md:px-4 px-2 rounded-xl shadow hover:bg-yellow-600 transition duration-300">
                  <button
                    className="font-semibold"
                  >
                    Search
                  </button>
                  {/* <GoPlus className="text-xl text-white" /> */}
                </div>
              </div>
            </section>
          } />

        {/* Items per page */}
        <div className="text-sm md:text-base">
          {rowsPerPageAndTotal}
        </div>

        {/* table */}
        <section className="overflow-x-auto border shadow-sm rounded-xl p-4 mt-5">
          <table className="table w-full">
            <thead className="bg-yellow-500">
              <tr className="text-sm font-medium text-white text-left">
                <td className="p-3 rounded-l-xl">Name</td>
                <td className="p-3">Instructor</td>
                <td className="p-3">Date</td>
                <td className="p-3">Time</td>
                <td className="p-3">Duration</td>
                <td className="p-3">Location</td>
                <td className="p-3  rounded-r-xl">Action</td>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index} className="hover:bg-slate-100 text-xs md:text-sm  hover:rounded-xl">
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">{item.instructor}</td>
                  <td className="px-4 py-3">{formatDate(item.date)}</td>
                  <td className="px-4 py-3">{formatTime(item.time)}</td>
                  <td className="px-4 py-3">{item.duration} minutes</td>
                  <td className="px-4 py-3">{item.location}</td>

                  {
                    item.registered.find((reg) => reg.email === user.email) ?
                      <>
                        <td className=" text-green-500  py-3 ">Registered</td>
                      </> :
                      <>
                        <td className=" hover:text-blue-500  py-3 cursor-pointer" onClick={() => { handleRegister(item._id) }}>Register</td>
                      </>
                  }
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
          {classes.length != 0 && classes.length > 5 && paginationControls}
        </section>
      </section>
    </>
  );
};

export default ScheduleClasses;
