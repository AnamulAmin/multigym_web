import { useContext, useEffect, useState } from "react";
import UseAxiosSecure from "../UseAxioSecure";
import { AuthContext } from "../../providers/AuthProvider";

function useGetDepartments() {
  const axiosSecure = UseAxiosSecure();
  const [departments, setDepartments] = useState([]);
  const {branch} = useContext(AuthContext);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axiosSecure.get(`/departments/${branch}/get-all`);

        console.log("res 16561", res?.data?.data);

        setDepartments(res?.data);
        // setCurrentPage(res?.data?.currentPage);
        // setTotalItems(res?.data?.totalItems);
      } catch (error) {
        console.error("res 16561", error);
      }
    }
    fetchData();
  }, [axiosSecure]);
  return departments;
}

export default useGetDepartments;
