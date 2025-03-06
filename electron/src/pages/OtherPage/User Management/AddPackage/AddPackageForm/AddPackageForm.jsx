import React, { useCallback, useContext, useEffect, useState } from "react";
import UserProfileCard from "../../../../../components/partial/UserProfileCard/UserProfileCard";
import PackageInput from "./PackageInput/PackageInput";
import { z } from "zod";
import UseAxiosSecure from "../../../../../Hook/UseAxioSecure";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import PackageSelect from "./PackageSelect/PackageSelect";
import CustomPackageArea from "./CustomPackageArea/CustomPackageArea";
import PaymentReceived from "./PaymentReceived/PaymentReceved";
import ChosePackage from "./ChosePackage/ChosePackage";
import moment from "moment";
import { AuthContext, useAuth } from "../../../../../providers/AuthProvider";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Oval } from "react-loader-spinner";

const schema = z.object({
  receipt_no: z
    .string()
    .nonempty({ message: "Please enter your Receipt Number" }),
  transaction_date: z
    .string()
    .nonempty({ message: "Please enter your transaction date" }),
  // amount: z.string(),
  start_date: z.string().nonempty({ message: "Please enter your start_date" }),
  end_date: z.string().nonempty({ message: "Please enter your end_date" }),
  receipt_Tk: z.number().int().min(0, "Receipt number must be 0 or greater"),
});

function AddPackageForm({
  isShow = false,
  setIsShow,
  userId,
  setPrintData,
  setPrintType,
  handleGetPrintData = () => {},
}) {
  const axiosSecure = UseAxiosSecure();
  const [selectedPackage, setSelectedPackage] = useState("");
  const [packageDetails, setPackageDetails] = useState([]);
  const [member_details, setMember_details] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [receipt_Tk, setReceipt_Tk] = useState(0);
  const [amount, setAmount] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("nogod");
  const [loading, setLoading] = useState(false);

  const [calendarMinDate, setCalendarMinDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  console.log(packageDetails?.duration, packageDetails);

  const { user, branch } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    const start_date = moment(new Date(data?.start_date));
    const end_date = moment(new Date(data?.end_date));

    // Calculate the duration
    const duration = moment.duration(end_date.diff(start_date));

    if (
      data?.start_date == "Invalid date" ||
      data?.end_date == "Invalid date"
    ) {
      setError("start_date", {
        type: "custom",
        message: "Please enter a valid start date",
      });
      setError("end_date", {
        type: "custom",
        message: "Please enter a valid end date",
      });
      return;
    }
    // Get the duration in days, hours, minutes, etc.
    const days = duration.asDays();
    console.log("duration", duration);

    data.duration = days || packageDetails?.duration;
    data.login_email = user?.email;
    data.login_name = user?.full_name || user?.displayName;
    data.member_email = member_details.email;
    data.member_name = member_details.full_name;
    data.member_id = member_details?.member_id;
    data.packageFee = packageDetails.packageFee;
    data.package_name = packageDetails.name;
    data.admissionFee = packageDetails.admissionFee;
    data.amount = packageDetails.amount;
    data.member_doc_id = member_details._id;
    data.discount = discount;
    data.branch = branch;
    data.receipt_Tk = receipt_Tk;
    data.payment_method = paymentMethod;

    console.log("Main data : ", data);

    try {
      setLoading(true);
      const response = await axiosSecure.post(`/invoice/post`, data);
      if (response?.status === 200 || response.status === 201) {
        toast.success("Package added successfully!");
        setIsShow(false);
        console.log("response rsultt", response?.data?.result);
        console.log("data", data);
        setPrintData(response?.data?.result);
        // setIsShowPrint(true);

        handleGetPrintData(response?.data?.result?._id, "");
        setLoading(false);
        return handleReset();
      }
      setLoading(false);
    } catch (error) {
      console.log(error?.response?.data?.error);
      // toast.error(`${error?.response?.data?.error}`);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `${error?.response?.data?.error}`,
      });
      setLoading(false);
    }
  };

  const handleStartEndDate = (value) => {
    if (value) {
      const date = moment(new Date(value)).format("YYYY-MM-DD");
      const expireDate = moment(new Date(value))
        .add(parseInt(packageDetails?.duration), "days")
        .format("YYYY-MM-DD");

      console.log("date", date);
      console.log("expireDate", expireDate);

      setValue("start_date", date);
      setStartDate(date);
      setValue("end_date", expireDate);
    }

    if (selectedPackage === "custom") {
      setValue("package_name", "custom");
    }
  };

  function handleReceiptTk(e) {
    if (e?.target?.value) {
      // setReceipt_Tk(amount);
      setValue("receipt_Tk", parseInt(e.target.value) - discount);
      return;
    }
    // setReceipt_Tk(packageDetails?.amount);
    setValue("receipt_Tk", packageDetails?.amount - discount);
  }

  useEffect(() => {
    if (selectedPackage === "custom") {
      setValue("package_name", "custom");
      setValue("start_date", "");
      setStartDate("");
      setValue("end_date", "");
      console.log("member_details custom", member_details);
      setValue("receipt_Tk", amount - discount);
    } else {
      const packageStartDate =
        startDate == "Invalid date" &&
        new Date(member_details?.expiredate).getTime() < new Date().getTime()
          ? moment(new Date()).format("YYYY-MM-DD")
          : startDate == "Invalid date"
          ? member_details?.expiredate
          : startDate;

      console.log("packageStartDate", packageStartDate);

      const date = moment(new Date(packageStartDate)).format("YYYY-MM-DD");
      const expireDate = moment(new Date(packageStartDate))
        .add(parseInt(packageDetails?.duration), "days")
        .format("YYYY-MM-DD");

      console.log("expireDate", expireDate, date);

      setValue("start_date", date);
      setStartDate(date);
      setValue("end_date", expireDate);
      setValue("receipt_Tk", packageDetails?.amount - discount);
    }
  }, [
    selectedPackage,
    packageDetails,
    discount,
    setValue,
    startDate,
    member_details,
    isShow,
    amount,
  ]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axiosSecure.get(
          `/users/get-id/${userId}?branch=${branch}`
        );

        console.log("res 16561", res?.data?.data);

        setMember_details(res?.data);

        const minDate =
          new Date(res?.data?.expiredate).getTime() < new Date().getTime()
            ? new Date().toISOString().split("T")[0]
            : new Date(res?.data?.expiredate).toISOString().split("T")[0];
        setCalendarMinDate(minDate);
        // setCurrentPage(res?.data?.currentPage);
        // setTotalItems(res?.data?.totalItems);
      } catch (error) {
        console.error("res 16561", error);
      }
    }

    if (userId) {
      fetchData();
    }

    console.log("userId", userId, "isShow", isShow, "branch", branch);
  }, [axiosSecure, userId, isShow, branch]);

  const handleReset = () => {
    setCalendarMinDate(new Date().toISOString().split("T")[0]);
    setIsShow(false);
    setStartDate("");
    setSelectedPackage("");
    setAmount(0);
    setDiscount(0);
    setReceipt_Tk(0);
    setMember_details(null);
    reset();
  };

  return (
    <article
      className={`w-full md:w-[65%] lg:w-[80%] bg-white my-7  transition-all duration-500 ${
        isShow ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-6 px-10 mt-6">
        <div className="col-span-2">
          <UserProfileCard userData={member_details} />
          <ChosePackage
            selectedPackage={selectedPackage}
            setSelectedPackage={setSelectedPackage}
            setPackageDetails={setPackageDetails}
            handleStartEndDate={handleStartEndDate}
            handleReceiptTk={handleReceiptTk}
            calendarMinDate={calendarMinDate}
          />
        </div>

        <div className="col-span-4 min-h-[400px] ">
          {selectedPackage !== "" && (
            <form
              className="px-5 py-3 col-span-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <CustomPackageArea
                errors={errors}
                register={register}
                isCustom={selectedPackage === "custom"}
                packageDetails={packageDetails}
                setReceipt_Tk={setReceipt_Tk}
                setAmount={setAmount}
                amount={amount}
                handleReceiptTk={handleReceiptTk}
                calendarMinDate={calendarMinDate}
              />
              <PaymentReceived
                errors={errors}
                register={register}
                setValue={setValue}
                getValues={getValues}
                discount={discount}
                setDiscount={setDiscount}
                receipt_Tk={receipt_Tk}
                setReceipt_Tk={setReceipt_Tk}
                selectedPackage={selectedPackage}
                handleStartEndDate={handleStartEndDate}
                setStartDate={setStartDate}
                calendarMinDate={calendarMinDate}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />

              <div className="flex justify-end items-center gap-4 mt-10">
                <button
                  type="submit"
                  className="py-2 px-4 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-200 transition duration-300 gap-3"
                  onClick={() => {
                    setPrintType("A4Print");
                  }}
                  disabled={loading}
                >
                  {loading && (
                    <Oval
                      visible={true}
                      height="15"
                      width="15"
                      color="#000"
                      ariaLabel="oval-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  )}
                  Save & A4 Print
                </button>

                <button
                  type="submit"
                  className="py-2 px-4 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-200 transition duration-300 flex gap-2"
                  onClick={() => {
                    setPrintType("thermal");
                  }}
                  disabled={loading}
                >
                  {loading && (
                    <Oval
                      visible={true}
                      height="15"
                      width="15"
                      color="#000"
                      ariaLabel="oval-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  )}
                  Save & Thermal Print
                </button>

                <button
                  type="button"
                  className="py-2 px-4 rounded-md border border-gray-400 text-gray-700 hover:bg-red-200 hover:text-red-600 transition duration-300"
                  onClick={() => {
                    setIsShow(false);
                    handleReset();
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="py-2 px-4 rounded-md bg-green-600 text-white hover:bg-green-700 transition duration-300 flex gap-3"
                  disabled={loading}
                >
                  {loading && (
                    <Oval
                      visible={true}
                      height="15"
                      width="15"
                      color="#000"
                      ariaLabel="oval-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  )}
                  Save
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </article>
  );
}

export default AddPackageForm;
