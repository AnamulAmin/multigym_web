import { useContext, useState } from "react";
import moment from "moment";
import ReportFilter from "./components/ReportFilter/ReportFilter";
import Table from "../../../../components/partial/Table/Table";
import ReportRow from "./components/ReportRow/ReportRow";
import useExportToExcel from "../../../../config/Export/useExportToExcel";
import useInvoiceData from "../../../../Hook/GetInvoiceData/GetInvoiceData";
import { SiMicrosoftexcel } from "react-icons/si";
import Mtitle from "/src/components library/Mtitle";
import { AuthContext } from "../../../../providers/AuthProvider";
const Invoices = () => {
  const [isDeleteInvoice, setIsDeleteInvoice] = useState(false);
  const [isShowAddInvoice, setIsShowAddInvoice] = useState(false);
  const {branch} =useContext(AuthContext);
  const currentDate = moment().format("YYYY-MM-DD");
  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState(currentDate);
  const [isSubmit, setIsSubmit] = useState(false);
  const [receiver, setReceiver] = useState("");
  const [timeFrame, setTimeFrame] = useState("");
  const [search, setSearch] = useState("");
  const [isAddFilterWithSearch, setIsAddFilterWithSearch] = useState(false);

  const { invoiceData, summary, receivers, method_summary, cumulativeBalance } =
    useInvoiceData({
      slashQuery: `/get-filter-invoice`,
      query: `branch=${branch}&start_date=${startDate}&end_date=${endDate}&receiver=${receiver}&time_frame=${timeFrame}&search=${search}&isAddFilterWithSearch=${isAddFilterWithSearch}`,
      isShowAddInvoice,
      isSubmit,
      isDeleteInvoice,
      startDate,
    });

  console.log("invoiceData", invoiceData);

  const exportToExcel = useExportToExcel({ data: invoiceData });
  return (
    <div className="p-3 md:p-1">
      <>
        <Mtitle
          title="Reports"
          rightcontent={
            <button className="font-semibold mt-3 text-sm md:mt-0 text-white bg-yellow-500 p-2 rounded-xl hover:bg-yellow-600 btn" onClick={exportToExcel}>
              Export To Excel <SiMicrosoftexcel />
            </button>
          }
        ></Mtitle>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2  lg:grid-cols-3  relative">
          <ReportFilter
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            setIsSubmit={setIsSubmit}
            setReceiver={setReceiver}
            summary={summary}
            receivers={receivers && receivers[0]}
            setTimeFrame={setTimeFrame}
            setSearch={setSearch}
            setIsAddFilterWithSearch={setIsAddFilterWithSearch}
            search={search}
            isAddFilterWithSearch={isAddFilterWithSearch}
            method_summary={method_summary}
            summary_type={"invoices"}
            cumulativeBalance={cumulativeBalance}
          />

          <div className="col-span-2  bg-white shadow rounded-xl text-xs md:text-base p-4 pt-3">
            <div className=" grid grid-cols-12  justify-between items-center gap-5 border-b border-gray-200 py-2">
              {timeFrame === "monthly" ? (
                <>
                  <p className="col-span-1 font-medium text-center">Date</p>
                  <p className="col-span-3 font-medium text-left ml-3">Admission Fee</p>
                  <p className="col-span-2 font-medium text-left">Package Fee</p>
                  <p className="col-span-2 font-medium text-center">Monthly</p>
                  <p className="col-span-2 font-medium text-center">Discount</p>

                  <p className="col-span-2 font-medium text-center">Total</p>
                </>
              ) : (
                <>
                  <p className="col-span-1 text-sm font-semibold ">Serial</p>
                  <p className="col-span-2 text-sm font-semibold">Txn ID</p>
                  <p className="col-span-2 text-sm font-semibold ">Member</p>
                  <p className="col-span-1 text-sm font-semibold text-center">Date </p>
                  <p className="col-span-1 text-sm font-semibold whitespace-nowrap text-center">Adm Fee</p>
                  <p className="col-span-1 text-sm font-semibold whitespace-nowrap text-center">Pkg Fee</p>
                  <p className="col-span-1 text-sm font-semibold text-center">Disc</p>
                  <p className="col-span-1 text-sm font-semibold whitespace-nowrap text-center">Pay Method</p>
                  <p className="col-span-2 text-sm font-semibold text-right flex gap-6 justify-end">
                    <span>Amt</span> <span>Action</span>
                  </p>
                </>
              )}
            </div>
            <div
              className=" w-full h-[990px] overflow-y-scroll rounded-md"
              style={{
                scrollbarWidth: "none",
                scrollbarColor: "black rgba(255, 255, 255, 0)",
              }}
            >
              <div className="-mt-5">
                <Table>
                  {invoiceData?.length > 0 ? (
                    invoiceData.map((item, index) => (
                      <ReportRow
                        key={index}
                        data={item}
                        setIsDeleteInvoice={setIsDeleteInvoice}
                        index={index}
                        timeFrame={timeFrame}
                      />
                    ))
                  ) : (
                    <div className="flex justify-center items-center h-96">
                      <div className="text-center">
                        <h1 className="text-2xl font-semibold">
                          No Transaction Found
                        </h1>
                        <p className="text-gray-500 mt-2 text-sm">
                          No transaction found with this search criteria.
                        </p>
                      </div>
                    </div>
                  )}
                </Table>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default Invoices;
