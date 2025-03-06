import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import moment from "moment/moment";
import UseAxiosSecure from "../../../../../../Hook/UseAxioSecure";
import MemberRegisterInput from "../../../../../../components/partial/MemberRegistration/MemberRegisterInput/MemberRegisterInput";
import MemberRegisterSelect from "../../../../../../components/partial/MemberRegistration/MemberRegisterSelect/MemberRegisterSelect";
import { useAuth } from "../../../../../../providers/AuthProvider";
import useUniqueId from "../../../../../../Hook/GetUniqeNumber/useUniqueId";
import { Oval } from "react-loader-spinner";

const transactionSchema = z.object({
  transaction_date: z.string().nonempty("Transaction Date is required"), // Adjust this if you're using a different date format
  voucher: z.string().optional(),
  transaction_name: z.string().nonempty("Transaction Type is required"),
  particulars: z.string().optional(),
  amount: z.string().nonempty("Amount is required"),
  payment_method: z.string().nonempty("Payment Method is required"),
});

function AddNewTransaction({ setIsShow, isShow }) {
  const [isNewId, setIsNewId] = useState(false);
  const axiosSecure = UseAxiosSecure();
  const [paymentMethodData, setPaymentMethodData] = useState([]);
  const [transactionTypeData, setTransactionTypeData] = useState([]);
  const [transactionType, setTransactionType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const uniqueId = useUniqueId(isNewId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(transactionSchema),
  });

  useEffect(() => {
    const fetchPaymentMethodData = async () => {
      try {
        const response = await axiosSecure.get(
          `/payment-method?branch=${user?.branch}`
        );
        setPaymentMethodData(response.data);
      } catch (error) {
        console.error("Error fetching payment method data:", error);
      }
    };

    fetchPaymentMethodData();
  }, [axiosSecure, isShow]);

  useEffect(() => {
    const fetchPaymentMethodData = async () => {
      try {
        const response = await axiosSecure.get(
          `/transaction-type?branch=${user?.branch}`
        );
        setTransactionTypeData(response?.data);
      } catch (error) {
        console.error("Error fetching payment method data:", error);
      }
    };

    fetchPaymentMethodData();
  }, [axiosSecure, isShow]);

  console.log("errors 1258", errors);

  const onSubmit = async (data) => {
    setIsLoading(true);
    data.login_email = user?.email;
    data.login_name = user?.full_name || user?.displayName;
    data.branch = user?.branch;
    data.transaction_date = moment(new Date(data.transaction_date)).format(
      "YYYY-MM-DD"
    );
    data.receipt_no = `#${Date.now()}`;

    const single_transaction_type = transactionTypeData.find((item) => {
      item.label === data.transaction_name;
      console.log(
        "item",
        item,
        data.transaction_name,
        item.label === data.transaction_name
      );
      return item.label === data.transaction_name;
    });

    console.log("transaction_type", single_transaction_type);
    data.transaction_type = single_transaction_type.type;
    console.log("data +65465fgsdfg", data);

    try {
      const response = await axiosSecure.post(`/transaction/post`, data);
      console.log("response", response);
      if (response?.status === 200 || response.status === 201) {
        toast.success("Transaction created successfully!");
        setIsShow(false);
        setIsNewId((prev) => !prev);
        reset();
        return response?.status;
      }
    } catch (error) {
      console.log(error);

      toast.error("Request failed!");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const transaction_types = [
    {
      value: "income_service",
      label: "INCOME - SERVICE",
      type: "income",
      branch: "shia",
    },
    {
      value: "salary",
      label: "EXPENSE - SALARY",
      type: "expense",
      branch: "shia",
    },
    { value: "rent", label: "EXPENSE - RENT", type: "expense", branch: "shia" },
    {
      value: "others",
      label: "EXPENSE - OTHERS",
      type: "expense",
      branch: "shia",
    },
    {
      value: "internet_bill",
      label: "EXPENSE - INTERNET BILL",
      type: "expense",
      branch: "shia",
    },
    {
      value: "fitant_monthly_bill",
      label: "EXPENSE - FITANT MONTHLY BILL",
      type: "expense",
      branch: "shia",
    },
    {
      value: "electric_bill",
      label: "EXPENSE - ELECTRIC BILL",
      type: "expense",
      branch: "shia",
    },
    {
      value: "daily_expense",
      label: "EXPENSE - DAILY EXPENSE",
      type: "expense",
      branch: "shia",
    },
    {
      value: "daily_cost",
      label: "EXPENSE - DAILY COST",
      type: "expense",
      branch: "shia",
    },
  ];

  return (
    <article
      className={`w-full rounded-xl py-2 md:w-[65%] lg:w-[80%] bg-white my-7 transition-all duration-500 ${
        isShow ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <h2 className="px-5 py-1  border-b border-gray-300 flex justify-between items-center w-full">
        <span className="font-medium">Add New Invoice</span>
      </h2>
      <form className="px-5 py-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-3">
          <MemberRegisterInput
            type={"date"}
            register={register}
            error={errors}
            name={"transaction_date"}
            isRequired={true}
            label={"Transaction Date *"}
          />
          <MemberRegisterInput
            type={"text"}
            register={register}
            error={errors}
            name={"voucher"}
            isRequired={true}
            label={"Voucher"}
          />

          <MemberRegisterSelect
            label={"Payment Method"}
            register={register}
            error={errors}
            name={"payment_method"}
            isRequired={false}
          >
            <option value={""}>Select Payment Method </option>
            {paymentMethodData.length > 0 &&
              paymentMethodData?.map((item, index) => {
                return (
                  <option value={item?.name} key={index}>
                    {item?.name}
                  </option>
                );
              })}
          </MemberRegisterSelect>
          <MemberRegisterSelect
            label={"Transaction Type"}
            register={register}
            error={errors}
            name={"transaction_name"}
            isRequired={false}
            onChange={(e) => setTransactionType(e.target.value)}
          >
            <option value={""}>Select Type </option>
            {transactionTypeData.length > 0 &&
              transactionTypeData.map((item, index) => {
                return (
                  <option value={item.label} key={index}>
                    {item.label}
                  </option>
                );
              })}
          </MemberRegisterSelect>

          <MemberRegisterInput
            type={"text"}
            label={"Particulars"}
            register={register}
            error={errors}
            name={"particulars"}
            isRequired={false}
          />
          <MemberRegisterInput
            type={"number"}
            label={"Amount"}
            register={register}
            error={errors}
            name={"amount"}
            isRequired={false}
          />
        </div>
        <div className="flex justify-end items-center gap-3 mt-9">
          <div className="flex justify-end">
            <div className="flex gap-2 cursor-pointer items-center bg-gray-700 text-white py-2 px-3 rounded-xl shadow hover:bg-gray-800 transition duration-300">
              <button
                type="button"
                onClick={() => {
                  setIsShow(false);
                  reset();
                  // handleResetAllFields();
                }}
                className="font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="flex gap-2 cursor-pointer items-center bg-gray-700 text-white py-2 px-3 rounded-xl shadow hover:bg-gray-800 transition duration-300">
              <button
                type="submit"
                className="font-semibold flex gap-3"
                disabled={isLoading}
              >
                {isLoading && (
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
          </div>
        </div>
      </form>
    </article>
  );
}

export default AddNewTransaction;
