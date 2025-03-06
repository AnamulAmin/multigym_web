import React, { useState, useCallback, useEffect, useContext } from "react";
import UseAxiosSecure from "../../../Hook/UseAxioSecure";
import toast from "react-hot-toast";
import { AuthContext } from "../../../providers/AuthProvider";

// Debounce function to delay API calls until user stops typing
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const UserSearch = ({ setIsShow, setUserId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [usersData, setUsersData] = useState([]);
  const axiosSecure = UseAxiosSecure();
  const {branch} = useContext(AuthContext);
  // Handle search with debouncing to avoid frequent API calls
  const handleSearch = useCallback(
    debounce(async (value) => {
      try {
        const res = await axiosSecure.get(`/users/get-all-search?search=${value}&branch=${branch}`);
        setUsersData(res?.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }, 300),
    [axiosSecure]
  );

  useEffect(() => {
    if (searchTerm) {
      handleSearch(searchTerm);
    } else {
      // setUsersData([]);
      handleSearch("a");
    }
  }, [searchTerm, handleSearch]);

  const handleUserSelect = (user) => {
    setUserId(user._id);
    setIsShow(false);
    toast.success(`User ${user.full_name} selected`);
  };

  return (
    <div className="md:p-6 px-0 md:pt-4 bg-white  rounded-lg">
      {/* <h1 className="text-2xl font-semibold mb-4">User Search</h1> */}
      <input
        type="text"
        placeholder="Search by name or email..."
        className="focus:border-gray-300 appearance-none text-gray-700 border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline mb-6"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="font-semibold">
            <tr>
              <td className="py-2 px-4 border-b text-left">Image</td>
              <td className="py-2 px-4 border-b text-left">Name</td>
              <td className="py-2 px-4 border-b text-left">Email</td>
              <td className="py-2 px-4 border-b text-left">Action</td>
            </tr>
          </thead>
          <tbody>
            {usersData.length > 0 ? (
              usersData.slice(0, 7).map((user) => ( // Limiting results to 7
                <tr key={user._id} className="hover:bg-slate-100 cursor-pointer">
                  <td className="py-2 px-4 border-b">
                    <img
                      src={user.photourl || 'https://via.placeholder.com/150'} // Default image if none
                      alt={user.full_name}
                      className="w-10 h-10 rounded-full"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">{user.full_name}</td>
                  <td className="py-2 px-4 border-b">{user.email ? user.email : "Email not provided"}</td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex max-w-min gap-3 cursor-pointer  items-center bg-blue-500 text-white py-1 px-3 rounded-xl shadow hover:bg-blue-600 hover:border border hover:border-gray-300 hover:shadow-none transition duration-300">
                      <button
                        onClick={() => handleUserSelect(user)}
                      >
                        Select
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-20">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserSearch;
