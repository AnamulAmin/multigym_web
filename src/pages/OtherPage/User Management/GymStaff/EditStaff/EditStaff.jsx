import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import MemberRegisterInput from "../../../../../components/partial/MemberRegistration/MemberRegisterInput/MemberRegisterInput";
import MemberRegisterSelect from "../../../../../components/partial/MemberRegistration/MemberRegisterSelect/MemberRegisterSelect";
import UseAxiosSecure from "../../../../../Hook/UseAxioSecure";
import useGetDepartments from "../../../../../Hook/GetDepartments/useGetDepartments";
import ImageUpload from "../../../../../config/Upload/ImageUploadcpanel";
import { useAuth } from "../../../../../providers/AuthProvider";

const religions = ["Islam", "Hindu", "Christian", "Buddhism", "Other"];
const maritalStatuses = ["Single","Married", "Unmarried", "Divorced", "Don't say"];

function EditStaff({ setIsShow, isShow, user_id, setUserId }) {
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const [imageUrl, setImageUrl] = useState("");
  const [previewImageUrl, setPreviewImageUrl] = useState("");

  const {branch} = useAuth();

  const departments = useGetDepartments();
  const axiosSecure = UseAxiosSecure();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (user_id) {
      const fetchUserData = async () => {
        try {
          const response = await axiosSecure.get(`/users/get-id/${user_id}`);
          if (response?.status === 200) {
            const data = response.data;

            Object.keys(data).forEach((fieldName) => {
              setValue(fieldName, data[fieldName]);
            });
          }
        } catch (error) {
          console.log(error);
          toast.error("Failed to load user data");
        }
      };
      fetchUserData();
    }
  }, [user_id, axiosSecure, setValue]);

  const onSubmit = async (data) => {

    data.branch = branch;

    try {
      const response = await axiosSecure.put(`/users/put/${user_id}`, data);
      console.log("response", response);
      if (response?.status === 200 || response.status === 201) {
        toast.success("Staff Update successful!");
        setIsShow(false);
        reset();
        setUserId("");
        return response?.status;
      }
    } catch (error) {
      console.log(error);
      toast.error("Request failed!");
    }
  };

  return (
    <article
      className={`w-full px-2 md:w-[65%] rounded-xl lg:w-[80%] bg-white my-7 transition-all duration-500 ${
        isShow ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <h2 className="px-5 font-medium py-1 mt-1 border-b border-gray-300">
        Edit Member
      </h2>
      <form className="md:px-5 py-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid md:grid-cols-4 gap-3 ">
          <MemberRegisterInput
            type={"text"}
            register={register}
            error={errors}
            name={"full_name"}
            isRequired={false}
            label={"Full Name"}
          />

          <MemberRegisterInput
            type={"text"}
            register={register}
            error={errors}
            name={"nickname"}
            isRequired={false}
            label={"Nickname"}
          />
          <MemberRegisterInput
            type={"email"}
            label={"Email"}
            register={register}
            error={errors}
            name={"email"}
            isRequired={false}
          />
          <MemberRegisterInput
            type={"text"}
            label={"Member Id"}
            register={register}
            error={errors}
            name={"member_id"}
            isRequired={false}
          />

          <MemberRegisterInput
            type={"text"}
            label={"Contact Number"}
            register={register}
            error={errors}
            name={"contact_no"}
            isRequired={false}
          />
          <MemberRegisterSelect
            type={"text"}
            label={"Gender *"}
            register={register}
            error={errors}
            name={"gender"}
            isRequired={false}
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
            isRequired={false}
          />
          <MemberRegisterInput
            type={"date"}
            label={"Date Of Birth"}
            register={register}
            error={errors}
            name={"date_of_birth"}
            isRequired={false}
          />
          <MemberRegisterInput
            type={"text"}
            label={"National ID"}
            register={register}
            error={errors}
            name={"nid_number"}
            isRequired={false}
          />

          <MemberRegisterSelect
            type={"text"}
            label={"Marital Status"}
            register={register}
            error={errors}
            name={"status"}
            isRequired={false}
          >
            <option value={""}>Select Marital Status</option>
            {maritalStatuses.map((status, index) => (
              <option value={status} key={index}>
                {status}
              </option>
            ))}
          </MemberRegisterSelect>

          <MemberRegisterSelect
            type={"text"}
            label={"Religion"}
            register={register}
            error={errors}
            name={"religion"}
            isRequired={false}
          >
            <option value={""}>Select Religion</option>
            {religions.map((item, index) => (
              <option value={item} key={index}>
                {item}
              </option>
            ))}
          </MemberRegisterSelect>

          <MemberRegisterInput
            type={"text"}
            label={"Weight (kg)"}
            register={register}
            error={errors}
            name={"weight"}
            isRequired={false}
          />

          <MemberRegisterSelect
            type={"text"}
            label={"Height"}
            register={register}
            error={errors}
            name={"height"}
            isRequired={false}
          >
            <option value={""}>Select Height</option>
            {Array.from({ length: 5 }, (_, feetIndex) => {
              const feet = feetIndex + 3;
              return Array.from({ length: 12 }, (_, inchIndex) => {
                const inch = inchIndex;
                return (
                  <option value={`${feet} feet ${inch}`} key={`${feet}-${inch}`}>
                    {`${feet} feet ${inch}`}
                  </option>
                );
              });
            })}
          </MemberRegisterSelect>

          <MemberRegisterInput
            type={"text"}
            label={"Card Number"}
            register={register}
            error={errors}
            name={"card_no"}
            isRequired={false}
          />
          <MemberRegisterInput
            type={"text"}
            label={"Emergency Contact Number"}
            register={register}
            error={errors}
            name={"emergency_contact_number"}
            isRequired={false}
          />
          <MemberRegisterInput
            type={"text"}
            label={"Emergency Contact Name"}
            register={register}
            error={errors}
            name={"emergency_contact_name"}
            isRequired={false}
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
          <MemberRegisterSelect
            type={"text"}
            name={"role"}
            label={"Department *"}
            register={register}
            error={errors}
          >
            <option value={""}>Choose Department</option>
            {departments.map((item, index) => (
              <option value={item?.Role} key={index}>
                {item?.Role}
              </option>
            ))}
          </MemberRegisterSelect>

          <ImageUpload setValue={setValue} />
        </div>

        <div className="flex mr-3 md:mr-0 justify-end items-center gap-3 mt-9">
          <button
            type="button"
            onClick={() => {
              setIsShow(false);
              reset();
              setUserId("");
            }}
            className="bg-gray-700 text-white py-2 px-3 rounded-xl shadow hover:bg-gray-800 transition duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-gray-700 text-white py-2 px-3 rounded-xl shadow hover:bg-gray-800 transition duration-300"
          >
            Save
          </button>
        </div>
      </form>
    </article>
  );
}

export default EditStaff;
