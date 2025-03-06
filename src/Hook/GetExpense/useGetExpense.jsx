import { useEffect, useState } from "react";
import UseAxiosSecure from "../UseAxioSecure";

function useGetExpense({
  query = "",
  id = "",
  slashQuery = "",
}) {
  const [expenseData, setExpenseData] = useState([]);

  const axiosSecure = UseAxiosSecure();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axiosSecure.get(
          `/transaction/expense${(slashQuery && "/" + slashQuery) || ""}${
            (id && "/" + id) || ""
          }${(query && "?" + query) || ""}`
        );

        if (res.status === 200 || res.status === 201) {
          setExpenseData(res?.data?.data);
          console.log("res 16561", res?.data, res?.data?.data);
          
        }

        // setCurrentPage(res?.data?.currentPage);
        // setTotalItems(res?.data?.totalItems);
      } catch (error) {
        console.error("res 16561", error);
      }
    }
    fetchData();
  }, [
    axiosSecure,
    id,
    query,
    slashQuery,
  ]);
  return expenseData
}

export default useGetExpense;
