import { useContext, useState } from "react";
import Table from "../../../../components/partial/Table/Table";
import { PiMicrosoftExcelLogo } from "react-icons/pi";
import InvoiceTableTopBtn from "./components/InvoiceTableTopBtn/InvoiceTableTopBtn";
import InvoiceFilter from "./components/InvoiceFilter/InvoiceFilter";
import InvoiceRow from "./components/InvoiceRow/InvoiceRow";
import useInvoiceData from "../../../../Hook/GetInvoiceData/GetInvoiceData";
import useExportToExcel from "../../../../config/Export/useExportToExcel";
import { PiInvoice } from "react-icons/pi";
import Modal from "../../../../components/partial/Modal/Modal";
import AddNewTransaction from "./components/AddNewTransaction/AddNewTransaction";
import useGetTransaction from "../../../../Hook/GetTransactions/useGetTransaction";
import Summery from "./components/TransactionSummery/TransactionSummery";
import moment from "moment";
import DashboardTitle from "../../../../components/DashboardTitle/Title";
import Mtitle from "/src/components library/Mtitle";
import ReportFilter from "../Invoices/components/ReportFilter/ReportFilter";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePdfTemplate from "./components/InvoicePdfTemplate/InvoicePdfTemplate";
import MonthlyInvoicePdfTemplate from "./components/InvoicePdfTemplate/MonthlyInvoicePdfTemplate";
import useGetCompanyData from "../../../../Hook/GetCompanyData/useGetCompanyData";
import { AuthContext } from "../../../../providers/AuthProvider";
const Transactions = () => {
  const [isDeleteTransaction, setIsDeleteTransaction] = useState(false);
  const [isShowAddTransaction, setIsShowAddTransaction] = useState(false);

  const currentDate = moment().format("YYYY-MM-DD");
  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState(currentDate);
  const [isSubmit, setIsSubmit] = useState(false);
  const [transactionType, setTransactionType] = useState("");
  const [search, setSearch] = useState("");
  const [isAddFilterWithSearch, setIsAddFilterWithSearch] = useState(false);
  const [timeFrame, setTimeFrame] = useState("");
  const [receiver, setReceiver] = useState("");

  console.log(isDeleteTransaction, "isDeleteTransaction 46654456");
  const {branch} = useContext(AuthContext);
  const {
    transactionData,
    summary,
    receivers,
    method_summary,
    cumulativeBalance,
  } = useGetTransaction({
    query: `branch=${branch}&start_date=${startDate}&end_date=${endDate}&transaction_type=${transactionType}&receiver=${receiver}&time_frame=${timeFrame}&search=${search}&isAddFilterWithSearch=${isAddFilterWithSearch}`,
    isShowAddTransaction,
    isSubmit,
    isDeleteTransaction,
  });

  const profileData = useGetCompanyData();
  console.log(transactionData);

  const exportToExcel = useExportToExcel({ data: transactionData });
  return (
    <div className="p-3">
      <>
        {/* <DashboardTitle title="Invoices And Billing" /> */}
        <Mtitle title="Invoices and billings"></Mtitle>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3   relative">
          {/* <InvoiceFilter
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            setIsSubmit={setIsSubmit}
            setTransactionType={setTransactionType}
            summary={summary}
          /> */}
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
            summary_type={"transactions"}
            cumulativeBalance={cumulativeBalance}
          />

          <div
            className="col-span-2 bg-white min-h-[500px] max-h-[94dvh] overflow-x-hidden overflow-y-scroll  rounded-xl shadow p-4 pt-2"
            style={{
              scrollbarWidth: "none",
              scrollbarColor: "black rgba(255, 255, 255, 0)",
            }}
          >
            <div className=" flex justify-between items-center gap-5  border-b border-gray-200 pb-4 pt-2">
              <h3 className="md:text-lg font-semibold">Invoices Billing</h3>
              <div className="flex items-center gap-5">
                <InvoiceTableTopBtn>
                  <div>
                    {timeFrame === "monthly" ? (
                      <PDFDownloadLink
                        document={
                          <MonthlyInvoicePdfTemplate
                            data={transactionData}
                            summary={summary[0] && summary[0]}
                            cumulativeBalance={
                              cumulativeBalance && cumulativeBalance
                            }
                            method_summary={method_summary && method_summary}
                            profileData={profileData}
                          />
                        }
                        fileName="transactions.pdf"
                      >
                        {({ loading }) =>
                          loading ? "Loading document..." : "Download PDF"
                        }
                      </PDFDownloadLink>
                    ) : (
                      <PDFDownloadLink
                        document={
                          <InvoicePdfTemplate
                            transactions={transactionData}
                            summary={summary[0] && summary[0]}
                            cumulativeBalance={
                              cumulativeBalance && cumulativeBalance
                            }
                            method_summary={method_summary && method_summary}
                            profileData={profileData}
                          />
                        }
                        fileName="transactions.pdf"
                      >
                        {({ loading }) =>
                          loading ? "Loading document..." : "Download PDF"
                        }
                      </PDFDownloadLink>
                    )}
                  </div>

                  <PiMicrosoftExcelLogo size={24} />
                </InvoiceTableTopBtn>
                <InvoiceTableTopBtn>
                  <button
                    id="btnAddMember"
                    type="button"
                    className="font-semibold "
                    onClick={exportToExcel}
                  >
                    Export To Excel
                  </button>

                  <PiMicrosoftExcelLogo size={24} />
                </InvoiceTableTopBtn>
                <InvoiceTableTopBtn>
                  <button
                    id="btnAddMember"
                    type="button"
                    className="font-semibold "
                    onClick={() => setIsShowAddTransaction(true)}
                  >
                    Add New Invoice
                  </button>

                  <PiInvoice size={24} />
                </InvoiceTableTopBtn>
              </div>
            </div>

            <div className="col-span-2 bg-white p-4 pt-2">
              <div className=" grid grid-cols-12 justify-between items-center gap-5 border-b border-gray-200 pb-2">
                {timeFrame === "monthly" ? (
                  <>
                    <b className="col-span-3">Date</b>
                    <b className="col-span-3 text-center">Incomes</b>
                    <b className="col-span-3 text-center">Expenses</b>

                    <b className="col-span-3 text-right">Total</b>
                  </>
                ) : (
                  <>
                    <b className="md:text-base  text-xs font-semibold pt-2    pb-1 col-span-1">SL.No.</b>
                    <b className= " md:text-base  text-xs font-semibold pt-2  ml-2 pb-1 col-span-2">Tran  Type</b>

                    <b className= " md:text-base  text-xs font-semibold pt-2 pb-1 col-span-2  hidden md:block text-center">Tran  No</b>
                    <b className= " md:text-base  text-xs font-semibold pt-2 pb-1 col-span-2 text-center">Tran nam</b>
                    <b className= " md:text-base  text-xs font-semibold pt-2 pb-1 col-span-2 text-center">Pay Method</b>

                    <b className= " md:text-base  text-xs font-semibold pt-2 pb-1 col-span-2 text-center">Amount</b>
                    <b className= " md:text-base  text-xs font-semibold pt-2 pb-1 col-span-1 text-right pr-6">Action</b>
                  </>
                )}
              </div>
              <div
                className="w-full min-h-[600px] max-h-[92dvh] overflow-x-hidden overflow-y-scroll  rounded-md "
                style={{
                  scrollbarWidth: "none",
                  scrollbarColor: "black rgba(255, 255, 255, 0)",
                }}
              >
                <Table>
                  {transactionData?.length > 0 ? (
                    transactionData.map((item, index) => (
                      <InvoiceRow
                        key={index}
                        data={item}
                        setIsDeleteTransaction={setIsDeleteTransaction}
                        timeFrame={timeFrame}
                        index={index}
                      />
                    ))
                  ) : (
                    <div className="flex justify-center items-center h-96">
                      <div className="text-center">
                        <h1 className="text-2xl font-semibold">
                          No Transaction Found
                        </h1>
                        <p className="text-gray-500 text-sm mt-2">
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
        <Modal
          isShowModal={isShowAddTransaction}
          setIsShowModal={setIsShowAddTransaction}
        >
          <AddNewTransaction
            setIsShow={setIsShowAddTransaction}
            isShow={isShowAddTransaction}
          />
        </Modal>
      </>
    </div>
  );
};

export default Transactions;
