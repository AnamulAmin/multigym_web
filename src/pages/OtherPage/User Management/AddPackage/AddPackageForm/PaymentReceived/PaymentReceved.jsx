import { useContext, useEffect, useState } from "react";
import MemberRegisterInput from "../../../../../../components/partial/MemberRegistration/MemberRegisterInput/MemberRegisterInput";
import useUniqueId from "../../../../../../Hook/GetUniqeNumber/useUniqueId";
import moment from "moment";
import UseAxiosSecure from "../../../../../../Hook/UseAxioSecure";
import { AuthContext } from "../../../../../../providers/AuthProvider";

function PaymentReceived({
  errors,
  register,
  setValue,
  discount,
  setDiscount,
  selectedPackage,
  setStartDate,
  handleStartEndDate,
  calendarMinDate,
  setPaymentMethod,
}) {
  const date = moment(new Date()).format("YYYY-MM-DD");

  const uniqueId = "#" + `${Date.now()}`.slice(-6);
  setValue("receipt_no", uniqueId);
  const { branch } = useContext(AuthContext);

  const [paymentMethodData, setPaymentMethodData] = useState([]);
  const [activeMethod, setActiveMethod] = useState(0);

  const minDate =
    new Date(calendarMinDate).getTime() < new Date().getTime()
      ? new Date().toISOString().split("T")[0]
      : calendarMinDate;

  const axiosSecure = UseAxiosSecure();

  useEffect(() => {
    const fetchPaymentMethodData = async () => {
      try {
        const response = await axiosSecure.get(
          `/payment-method?branch=${branch}`
        );
        setPaymentMethodData(response.data);
      } catch (error) {
        console.error("Error fetching payment method data:", error);
      }
      setValue("transaction_date", date);
    };

    fetchPaymentMethodData();
  }, [axiosSecure, setValue, date, branch]);

  return (
    <div className="border-2 border-gray-300 rounded-lg mt-10 shadow-lg">
      <h2 className="px-6 py-4 border-b border-gray-200 bg-gray-100 rounded-t-lg flex justify-between items-center font-semibold text-2xl text-gray-700">
        <span>PAYMENT RECEIVED</span>
      </h2>

      <div className="p-6 grid grid-cols-2 gap-4">
        <MemberRegisterInput
          type="date"
          register={register}
          error={errors}
          name="transaction_date"
          isRequired={false}
          label="Transaction Date"
          onChange={{
            onChange: (e) => setValue("transaction_date", e.target.value),
          }}
        />
        {selectedPackage === "custom" ? (
          <MemberRegisterInput
            type="text"
            register={register}
            error={errors}
            name="receipt_no"
            isRequired={false}
            label="Money Receipt Number"
          />
        ) : (
          <>
            <MemberRegisterInput
              type="date"
              register={register}
              error={errors}
              name="start_date"
              isRequired={false}
              label="Package Starts On"
              // min={minDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                handleStartEndDate(e.target.value);
              }}
            />
            <MemberRegisterInput
              type="date"
              register={register}
              error={errors}
              name="end_date"
              isRequired={false}
              label="Package Ends On"
            />
          </>
        )}
      </div>

      <div className="p-6 grid grid-cols-3 gap-4">
        {paymentMethodData?.length > 0 ? (
          paymentMethodData.map((item, index) => (
            <button
              className={`rounded-md py-2 px-3 text-center flex items-center justify-center border border-gray-300 transition duration-300 ${
                activeMethod === index
                  ? "bg-gray-900 text-white font-bold"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => {
                setPaymentMethod(item?.name);
                setActiveMethod(index);
              }}
              title={item?.name}
              type="button"
              key={index}
            >
              <img src={item?.image} alt="logo" className="w-10 h-10 mr-2" />
              <span>{item?.name}</span>
            </button>
          ))
        ) : (
          <div className="flex justify-center items-center col-span-3 py-12">
            <div className="text-center">
              <h1 className="text-xl font-semibold text-gray-700">
                No Payment Method Found
              </h1>
              <p className="text-gray-500 text-sm">
                No payment method found with this search criteria.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto p-6">
        <table className="w-full table-auto border-collapse border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-100 text-gray-700 text-lg font-semibold">
            <tr>
              <th className="border border-gray-200 py-2 px-4">Type</th>
              <th className="border border-gray-200 py-2 px-4"></th>
              <th className="border border-gray-200 py-2 px-4">
                Discount (Tk)
              </th>
              <th className="border border-gray-200 py-2 px-4">
                Received (Tk)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-gray-700">
              <td
                colSpan={2}
                className="border border-gray-200 py-3 px-4 font-semibold"
              >
                Subscription Fee
              </td>
              <td className="border border-gray-200 py-3 px-4">
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </td>
              <td className="border border-gray-200 py-3 px-4">
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("receipt_Tk", { required: true })}
                />
                {errors?.receipt_Tk?.message && (
                  <p className="text-red-500 text-sm pt-1 pl-2">
                    {errors?.receipt_Tk?.message}
                  </p>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PaymentReceived;
