import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../../../../../providers/AuthProvider";
import UseAxiosSecure from "../../../../../Hook/UseAxioSecure";
import { IoClose } from "react-icons/io5";
import { set } from "react-hook-form";

function EditRequestDietPlanQuestion({
  setIsShowModal,
  isShowModal,
  targetId,
}) {
  const { user } = useAuth();
  const axiosSecure = UseAxiosSecure();
  const [nameField, setNameField] = useState("");
  const [field_type, setField_type] = useState("");
  const [options, setOptions] = useState([]);
  const [labelField, setLabelField] = useState("");
  const [optionField, setOptionField] = useState("");
  const [loading, setLoading] = useState(false);

  const surveyFields = [
    { name: "text_question", field_type: "text", label: "Text Question" },
    { name: "number", field_type: "number", label: "Numeric Answer" },
    { name: "textarea", field_type: "textarea", label: "Detailed Answer" }, // For longer responses
    { name: "Option", field_type: "option", label: "Option Answer" },
    {
      name: "radio",
      field_type: "radio",
      label: "Yes or No",
      options: ["Yes", "No"],
    },
  ];

  useEffect(() => {
    const labelField = document.getElementById("label");

    const fetchPaymentMethodData = async () => {
      try {
        const response = await axiosSecure.get(
          `/diet-plan/food-habit-question/get-single/${targetId}?branch=${user?.branch}`
        );

        if (response.data?.field_type === "option") {
          const labelValue = response.data?.label.split(":");

          labelField.value = labelValue[0];
          setLabelField(labelValue[0]);
          setOptions(labelValue[1].split(","));
        } else {
          labelField.value = response.data?.label;
          setLabelField(response.data?.label);
        }

        setField_type(response.data?.field_type);
        setNameField(response.data?.name);

        console.log("response.data?.options", response.data);
      } catch (error) {
        console.error("Error fetching payment method data:", error);
      }
    };

    fetchPaymentMethodData();
  }, [axiosSecure, isShowModal, targetId]);

  function sanitizeInput(input) {
    // Regular expression to match spaces and special characters
    const sanitizedInput = input.replace(/[^a-zA-Z0-9]/g, "_");
    setNameField(sanitizedInput);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const name = nameField;
    let label = labelField;

    if (field_type === "option") {
      const strOptions = options.join(",");
      // console.log("strOptions", strOptions);
      label = label + ":" + strOptions;
    }

    console.log("handleSubmit", { name, label, field_type });

    try {
      const response = await axiosSecure.put(
        `/diet-plan/food-habit-question/update/${targetId}?branch=${user?.branch}`,
        {
          name,
          field_type,
          label,
          branch: user?.branch || "shia",
        }
      );
      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: "Success",
          text: "Request Diet Plan updated successfully",
          icon: "success",
          confirmButtonText: "Ok",
        });
        setIsShowModal(false);

        setNameField("");
        setLabelField("");
        setField_type("");
        setOptions([]);
        setOptionField("");
      }
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      Swal.fire({
        title: "Error",
        text: `Something went wrong`,
        icon: "error",
        confirmButtonText: "Ok",
      });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleOptions = (e) => {
    e.preventDefault();
    setOptions((prev) => [...prev, optionField]);
    setOptionField("");
  };

  return (
    <div className="bg-white p-5 w-[90%] md:p-8 rounded-xl md:w-[40%]">
      <h3 className="text-2xl font-semibold mb-7 mt-3 text-nowrap">
        Edit  Request Diet Plan
      </h3>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col gap-3">
          <label htmlFor="label" className="text-xl font-semibold">
            Label
          </label>
          <input
            type="text"
            id="label"
            name="label"
            className="outline-none border p-2 rounded-xl focus:border-gray-300"
            onChange={(e) => setLabelField(e.target.value)}
            value={labelField}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label htmlFor="name" className="text-xl font-semibold">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={nameField}
            onChange={(e) => sanitizeInput(e.target.value)}
            className="outline-none border p-2 rounded-xl focus:border-gray-300"
          />
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleOptions}>
          {field_type === "option" && (
            <div className="flex flex-col gap-4">
              <label htmlFor="field_type" className="text-xl font-semibold">
                Options
              </label>
              <input
                type="text"
                name="options"
                id="options"
                value={optionField}
                onChange={(e) => setOptionField(e.target.value)}
                className="outline-none border p-2 rounded-xl focus:border-gray-300"
              />
            </div>
          )}

          <ol className="list-outside pl-4" style={{ listStyle: "auto" }}>
            {options?.length > 0 &&
              options.map((item, index) => (
                <li
                  key={index}
                  className="text-gray-500 border-b border-gray-300 py-2 px-4"
                >
                  <div className="flex items-center gap-2 justify-between">
                    <span className="font-semibold">{item}</span>
                    <span
                      className="hover:bg-blue-100 text-white p-1 rounded bg-red-100"
                      onClick={() => {
                        setOptionField("");
                        setOptions((prev) => {
                          const newOptions = prev.filter((opt) => opt !== item);
                          console.log("newOptions", newOptions);
                          return newOptions;
                          // return prev
                        });
                      }}
                    >
                      <IoClose className="text-red-500 text-xl" />
                    </span>
                  </div>
                </li>
              ))}
          </ol>
        </form>
        <div className="flex flex-col gap-3">
          <label htmlFor="field_type" className="text-xl font-semibold">
            Field Type
          </label>
          <select
            type="text"
            id="field_type"
            name="field_type"
            value={field_type}
            onChange={(e) => setField_type(e.target.value)}
            className="outline-none border p-2 rounded-xl focus:border-gray-300"
          >
            {surveyFields.map((item, index) => (
              <option key={index} value={item.field_type}>
                {item.field_type}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="font-semibold flex justify-center items-center gap-2 bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-lg ml-auto  w-fit mt-12"
        disabled={loading}
      >
        {loading && (
          <span className="loading loading-spinner loading-md"></span>
        )}
        Update
      </button>
    </div>
  );
}

export default EditRequestDietPlanQuestion;
