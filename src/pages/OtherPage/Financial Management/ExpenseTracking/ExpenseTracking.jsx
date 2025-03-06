import { useState, useEffect } from "react";
import Mtitle from "/src/components library/Mtitle";
import ExpenseTrackingTable from "./components/ExpenseTrackingTable";
import ExpenseTrackingChart from "./components/ExpenseTrackingChart";
import moment from "moment";
import { useAuth } from "../../../../providers/AuthProvider";
import InputDateFilter from "../../Overview/InitialPage/InputDateFilter/InputDateFilter";
import useGetExpense from "../../../../Hook/GetExpense/useGetExpense";

const ExpenseTracking = () => {
  const { user } = useAuth();
  const currentDate = moment().format("YYYY-MM-DD");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [selectType, setSelectType] = useState("last30Days");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const expenseData = useGetExpense({
    query: `branch=${user.branch}&year=${year}&month=${month}`,
  });

  useEffect(() => {
    setLoading(!expenseData);  // Adjust loading based on data presence
    setError(null);            // Reset error on new request
  }, [expenseData]);

  return (
    <div>
      <Mtitle title={`Expense Tracking ${selectType ? `- ${selectType}` : ''}`} />
      <div className="p-5 w-full">
        <InputDateFilter
          year={year}
          setYear={setYear}
          month={month}
          setMonth={setMonth}
          selectType={selectType}
          setSelectType={setSelectType}
        />

        <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 justify-start min-h-[750px]">
          {loading ? (
            <div className="col-span-2 flex justify-center items-center h-96">
              <p>Loading...</p>
            </div>
          ) : error ? (
            <div className="col-span-2 flex justify-center items-center h-96 text-red-500">
              <p>Failed to load data: {error.message}</p>
            </div>
          ) : (
            <>
              <ExpenseTrackingTable arrayData={expenseData} />
              <ExpenseTrackingChart expenseData={expenseData} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracking;
