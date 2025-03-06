import { useEffect, useState } from "react";
import UseAxiosSecure from "../UseAxioSecure";
import { useAuth } from "../../providers/AuthProvider";

function useGetPackages() {
  const axiosSecure = UseAxiosSecure();
  const [packageData, setPackageData] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axiosSecure.get(`/package/${user?.branch}/get-all`);

        console.log("res 16561", res?.data?.data);

        setPackageData(res?.data);
        // setCurrentPage(res?.data?.currentPage);
        // setTotalItems(res?.data?.totalItems);
      } catch (error) {
        console.error("res 16561", error);
      }
    }
    fetchData();
  }, [axiosSecure]);
  return packageData;
}

export default useGetPackages;
