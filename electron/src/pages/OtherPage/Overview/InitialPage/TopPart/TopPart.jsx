import { IoNotificationsOutline } from "react-icons/io5";
import { PiLineVerticalThin } from "react-icons/pi";
import { AuthContext } from "../../../../../providers/AuthProvider";
import { useContext } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom"; 


const TopPart = () => {

    const { user,logOut } = useContext(AuthContext);
    console.log(user);
    const handleLogOut = () => {
        logOut()
          .then(() => {
            toast.success("User logged out successfully");
            setUser({});
            navigate("/");
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Logout Failed",
              text: "Logout failed. Please try again later.",
            });
            console.error(error);
          });
      };
    return (
        <div className="flex justify-end items-center">
            {/* <div>
                <IoNotificationsOutline className="text-2xl text-gray-600" />
            </div>
            <div>
                <PiLineVerticalThin className="text-4xl text-gray-400" />
            </div> */}
            <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full">
                    <img
    alt="Profile"
    src={user.photourl || "https://multigympremium.com/uploads/nophoto.png"} // Use a fallback if photourl is not defined
/>
                    </div>
                </div>
                <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                   <li>
                        <Link to="/dashboard/userprofile" className="justify-between"> {/* Replaced anchor with Link */}
                            Profile
                            <span className="badge">New</span>
                        </Link>
                    </li>
                    <li><a onClick={handleLogOut}>Logout</a></li>
                </ul>
            </div>
        </div>
    );
};

export default TopPart;