import { useEffect, useState } from "react";
import UseAxiosSecure from "../UseAxioSecure";
import { useAuth } from "../../providers/AuthProvider";

function AllowedRoutes(role, dashboardChildrenRoutes) {
  const [permissionData, setPermissionData] = useState([]);
  const axiosSecure = UseAxiosSecure();
  const {branch} = useAuth();

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axiosSecure.get(`/permissions/${role}?${branch}`);

        console.log("response", response);

        const permissionRoutesArray = response?.data?.routesData.map(
          (item) => item.path
        );

        const filterRouteItems = dashboardChildrenRoutes.filter((item) =>
          permissionRoutesArray.includes(item.path)
        );
        setPermissionData(filterRouteItems);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };
    fetchPermissions();
  }, [role, axiosSecure, dashboardChildrenRoutes]);

  return permissionData;
}

export default AllowedRoutes;
