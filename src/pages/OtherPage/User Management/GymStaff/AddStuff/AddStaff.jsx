import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import useGetDepartments from "../../../../../Hook/GetDepartments/useGetDepartments";
import MemberRegisterInput from "../../../../../components/partial/MemberRegistration/MemberRegisterInput/MemberRegisterInput";
import MemberRegisterSelect from "../../../../../components/partial/MemberRegistration/MemberRegisterSelect/MemberRegisterSelect";
import ImageUpload from "../../../../../config/Upload/ImageUploadcpanel";
import moment from "moment/moment";
import UseAxiosSecure from "../../../../../Hook/UseAxioSecure";
import { AuthContext } from "../../../../../providers/AuthProvider";

const schema = z.object({
  full_name: z.string().nonempty({ message: "Please enter your full name" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  contact_no: z
    .string()
    .regex(/^\d{11}$/, { message: "Please enter a valid phone number" }),
  date_of_birth: z.string().optional(),
  nid_number: z.string().nonempty({ message: "Please enter your NID number" }),
  address: z.string().optional(),
  gender: z.string().nonempty({ message: "Please select your gender" }),
  blood_group: z.string().optional(),
  nickname: z.string().optional(),
  religion: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  profession: z.string().optional(),
  photourl: z.string().optional(),
  member_id: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_number: z.string().optional(),
  admission_date: z
    .string()
    .nonempty({ message: "Please enter your admission date" }),
  card_no: z.string().nonempty({ message: "Please enter your card number" }),
  role: z.string().nonempty({ message: "Please select a department" }),
});

function AddStaff({ setIsShow, isShow }) {
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const religions = ["Islam", "Hindu", "Christian", "Buddhism", "Other"];
  const maritalStatuses = [
    "Single",
    "Married",
    "Unmarried",
    "Divorced",
    "Don't say",
  ];
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [previewImageUrl, setPreviewImageUrl] = useState("");

  const departments = useGetDepartments();
  const axiosSecure = UseAxiosSecure();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const { branch } = useContext(AuthContext);

  const onSubmit = async (data) => {
    setLoading(true);
    data.branch = branch;
    if (!data.role) {
      setError("role", {
        type: "custom",
        message: "Please select a department",
      });
      return;
    }

    if (isAdvanced) {
      const advancedFields = [
        "emergency_contact_number",
        "emergency_contact_name",
        "height",
        "weight",
        "blood_group",
        "religion",
      ];
      let hasError = false;

      advancedFields.forEach((field) => {
        if (!data[field]) {
          setError(field, {
            type: "custom",
            message: `Please enter your ${field.replace("_", " ")}!`,
          });
          hasError = true;
        }
      });

      if (hasError) return;
    }

    try {
      const response = await axiosSecure.post(`/users/staff`, data);
      if (response?.status === 200 || response.status === 201) {
        toast.success("Registration successful!");
        setIsShow(false);
        reset();
        setLoading(false);
        return response?.status;
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      if (error?.response?.status === 409) {
        const errorMessage = error?.response?.data?.message;
        if (errorMessage.includes("email") && errorMessage.includes("mobile")) {
          setError("email", {
            type: "manual",
            message: "Email already exists.",
          });
          setError("contact_no", {
            type: "manual",
            message: "Mobile number already exists.",
          });
        } else if (errorMessage.includes("email")) {
          setError("email", {
            type: "manual",
            message: "Email already exists.",
          });
        } else if (errorMessage.includes("mobile")) {
          setError("contact_no", {
            type: "manual",
            message: "Mobile number already exists.",
          });
        }
      } else {
        toast.error("Request failed!");
      }
    }
  };

  const handleAdmissionDate = (e) => {
    const date = moment(new Date(e.target.value)).format("YYYY-MM-DD");
    setValue("date_of_birth", date);
    setValue("expiredate", moment(date).add(5, "years").format("YYYY-MM-DD"));
  };

  useEffect(() => {
    const date = moment(new Date()).format("YYYY-MM-DD");
    setValue("admission_date", date);
    setValue("expiredate", moment(date).add(5, "years").format("YYYY-MM-DD"));
  }, [isShow]);

  return (
    <article
      className={`w-full px-2 rounded-xl md:px-0 py-2 md:w-[65%] lg:w-[80%] bg-white my-7 transition-all duration-500 ${
        isShow ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <h2 className="md:px-5 px-4 py-1 border-b border-gray-300 flex justify-between items-center w-full">
        <span className="font-medium">Add Staff</span>
        <label className="capitalize font-bold text-[0.9rem] select-none">
          Advanced
          <input
            type={"checkbox"}
            className={`p-1 bg-slate-50 border border-gray-300 focus:border-black ml-3`}
            checked={isAdvanced}
            onChange={() => setIsAdvanced(!isAdvanced)}
          />
        </label>
      </h2>
      <form className="md:px-5 py-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid md:grid-cols-4 gap-3">
          <MemberRegisterInput
            type={"text"}
            register={register}
            error={errors}
            name={"full_name"}
            isRequired={true}
            label={"Full Name"}
          />

          <MemberRegisterInput
            type={"text"}
            register={register}
            error={errors}
            name={"nickname"}
            label={"Nickname"}
          />

          <MemberRegisterInput
            type={"email"}
            label={"Email"}
            register={register}
            error={errors}
            name={"email"}
          />

          <MemberRegisterInput
            type={"text"}
            label={"Employee Id"}
            register={register}
            error={errors}
            name={"member_id"}
          />

          <MemberRegisterInput
            type={"text"}
            label={"Contact Number"}
            register={register}
            error={errors}
            name={"contact_no"}
          />

          <MemberRegisterSelect
            label={"Gender *"}
            register={register}
            error={errors}
            name={"gender"}
          >
            <option value={""}>Select Gender</option>
            <option value={"Male"}>Male</option>
            <option value={"Female"}>Female</option>
          </MemberRegisterSelect>

          <MemberRegisterInput
            type={"text"}
            label={"Address"}
            register={register}
            error={errors}
            name={"address"}
          />

          <MemberRegisterInput
            type={"date"}
            label={"Date Of Birth"}
            register={register}
            error={errors}
            name={"date_of_birth"}
          />

          <MemberRegisterSelect
            type={"text"}
            label={"Blood Group *"}
            register={register}
            error={errors}
            name={"blood_group"}
            isRequired={false}
          >
            <option value={""} selected>
              Choose..
            </option>
            {bloodGroups.map((item, index) => (
              <option value={item} key={index}>
                {item}
              </option>
            ))}
          </MemberRegisterSelect>

          <MemberRegisterInput
            type={"text"}
            label={"NID Number"}
            register={register}
            error={errors}
            name={"nid_number"}
          />

          <MemberRegisterSelect
            label={"Department"}
            register={register}
            error={errors}
            name={"role"}
          >
            <option value={""}>Select Department</option>
            {departments?.map((dpt, i) => (
              <option key={i} value={dpt.Role}>
                {dpt?.Role}
              </option>
            ))}
          </MemberRegisterSelect>

          <MemberRegisterInput
            type={"text"}
            label={"Emergency Contact Name"}
            register={register}
            error={errors}
            name={"emergency_contact_name"}
          />

          <MemberRegisterInput
            type={"text"}
            label={"Emergency Contact Number"}
            register={register}
            error={errors}
            name={"emergency_contact_number"}
          />

          <MemberRegisterInput
            type={"text"}
            label={"Card No"}
            register={register}
            error={errors}
            name={"card_no"}
          />
          <MemberRegisterInput
            type={"text"}
            label={"Photo Url"}
            minLength={0}
            register={register}
            error={errors}
            name={"photourl"}
            isRequired={true}
          />

          {isAdvanced && (
            <>
              {/* Marital Status */}
              <MemberRegisterSelect
                label={"Marital Status"}
                register={register}
                error={errors}
                name={"status"}
              >
                <option value={""}>Select Marital Status</option>
                {maritalStatuses.map((status, i) => (
                  <option key={i} value={status}>
                    {status}
                  </option>
                ))}
              </MemberRegisterSelect>

              {/* Religion */}
              <MemberRegisterSelect
                label={"Religion"}
                register={register}
                error={errors}
                name={"religion"}
              >
                <option value={""}>Select Religion</option>
                {religions.map((item, index) => (
                  <option value={item} key={index}>
                    {item}
                  </option>
                ))}
              </MemberRegisterSelect>

              {/* Weight */}
              <MemberRegisterInput
                type={"text"}
                label={"Weight (kg)"}
                register={register}
                error={errors}
                name={"weight"}
              />

              {/* Height */}
              <MemberRegisterSelect
                label={"Height"}
                register={register}
                error={errors}
                name={"height"}
              >
                <option value={""}>Select Height</option>
                {Array.from({ length: 5 }, (_, feetIndex) => {
                  const feet = feetIndex + 3;
                  return Array.from({ length: 12 }, (_, inchIndex) => {
                    const inch = inchIndex;
                    return (
                      <option
                        value={`${feet} feet ${inch}`}
                        key={`${feet}-${inch}`}
                      >
                        {`${feet} feet ${inch}`}
                      </option>
                    );
                  });
                })}
              </MemberRegisterSelect>
            </>
          )}

          <ImageUpload setValue={setValue} />
        </div>
        <div className="flex md:mr-0 mr-3 justify-end items-center gap-3 mt-9">
          <button
            type="button"
            onClick={() => {
              setIsShow(false);
              reset();
            }}
            className="bg-gray-700 text-white font-semibold py-2 px-3 rounded-xl shadow hover:bg-gray-800 transition duration-300"
          >
            Cancel
          </button>
          <div className="flex gap-2 cursor-pointer items-center bg-gray-700 text-white py-2 px-3 rounded-xl shadow hover:bg-gray-800 transition duration-300">
            {loading ? (
              <>
                <span className="loading loading-spinner loading-md"></span>
              </>
            ) : (
              <>
                <button
                  type="submit"
                  className="font-semibold"
                  disabled={loading}
                >
                  Save
                </button>
              </>
            )}
          </div>
        </div>
      </form>
    </article>
  );
}

export default AddStaff;
