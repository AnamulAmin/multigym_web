import React, { useState, useEffect } from "react";
import axios from "axios";
import menuItems from "../../../../components/Sidebar/MenuItems";
import PermissionItem from "./permissionItem/permissionItem";
import useGetDepartments from "../../../../Hook/GetDepartments/useGetDepartments";
import IsAllowedRoute from "../../../../Hook/RoutePermission/AllowedRoutes";
import UseAxiosSecure from "../../../../Hook/UseAxioSecure";
import { useAuth } from "../../../../providers/AuthProvider";

const UserPermission = () => {
  const [role, setRole] = useState("admin"); // Default selected role, can be dynamic
  const [permissionData, setPermissionData] = useState([]);

  const [isCollapsed, setIsCollapsed] = useState(false); // For handling collapsible menu

  const departments = useGetDepartments();
  const { user } = useAuth();

  const axiosSecure = UseAxiosSecure();

  const isAllowedRoute = (pathName) => {
    const isAllowed = permissionData.find(
      (item) => item.path === pathName
    )?.isAllowed;

    return isAllowed || false;
  };

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axiosSecure.get(`/permissions/${role}?branch=${user?.branch}`);

        console.log("response", response);

        setPermissionData(response?.data?.routesData);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };
    fetchPermissions();
  }, [role, axiosSecure]);
  return (
    <div className="bg-white md:bg-slate-50">
      <div className="p-6 w-full min-w-[340px] mx-auto md:rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-bold mb-4">Set Permissions for {role}</h2>

        {/* Dropdown to select Role from departments */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Select Role</span>
          </label>
          <select
            className="select select-bordered"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {departments.map((department) => (
              <option key={department._id} value={department.Role}>
                {department.Role}
              </option>
            ))}
          </select>
        </div>

        <nav className="text-base font-normal">
          <ul className="grid md:grid-cols-3 gap-4">
            {menuItems("admin").map((cat) => (
              <li key={cat.title} className="mb-2">
                <div className="collapse rounded-xl">
                  <input
                    type="checkbox"
                    id={`collapsed-${cat.title}`}
                    className="hidden"
                  />
                  <label
                    htmlFor={`collapsed-${cat.title}`}
                    className={`font-medium flex items-center gap-2 cursor-pointer pl-4 bg-yellow-500 text-white ease-in-out duration-300 transition-all p-1 py-3 rounded-xl hover:bg-yellow-600`}
                  >
                    {!isCollapsed && cat.icon}
                    {!isCollapsed && cat.title}
                  </label>
                  <div className="collapse-content px-1 pt-2">
                    {cat.list &&
                      cat.list.map((item, index) => (
                        <PermissionItem
                          item={item}
                          key={index}
                          group_name={cat.title}
                          role={role}
                          path={item?.path}
                          isAllowedRoute={isAllowedRoute}
                        />
                      ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </nav>

        {/* Add more permission checkboxes similarly */}
      </div>
    </div>
  );
};

export default UserPermission;
