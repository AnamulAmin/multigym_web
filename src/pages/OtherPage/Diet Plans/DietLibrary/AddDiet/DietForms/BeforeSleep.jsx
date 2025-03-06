import React, { useCallback, useEffect, useState } from "react";
import NextPrevBtn from "./NextPrevBtn/NextPrevBtn";

import AddDietInput from "../AddDietInput/AddDietTextArea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import UseAxiosSecure from "../../../../../../Hook/UseAxioSecure";
import { useAuth } from "../../../../../../providers/AuthProvider";

const dietSchema = z.object({
  sleep: z.string().refine((val) => val.trim() !== "", {
    message: "Sleep must be provided or left empty",
  }),
});

function BeforeSleep({
  setFormIndex,
  formIndex,
  formTypes,
  isShowModal,
  setIsShowModal,
  diet_id,
}) {
  const axiosSecure = UseAxiosSecure();
  const {branch} = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(dietSchema),
  });

  console.log("beforeSleep", errors);
  const onSubmit = async (data) => {
    console.log(
      "data submit",
      data,
      formIndex <= formTypes.length - 1,
      formIndex,
      formTypes.length
    );

    if (formIndex <= formTypes.length - 1 && data) {
      sessionStorage.setItem("beforeSleep", JSON.stringify(data));
    }
    return;
  };

  useEffect(() => {
    const data = sessionStorage.getItem("beforeSleep");
    if (data) {
      setValue("sleep", JSON.parse(data).sleep);
    } else {
      setValue("sleep", "");
    }
  }, [setValue]);

  const handleAllSubmit = useCallback(() => {
    async function handleSubmitData() {
      const dinnerData = JSON.parse(sessionStorage.getItem("EveningSnacks"));
      const lunchData = JSON.parse(sessionStorage.getItem("MidMorning"));
      const breakfastData = JSON.parse(sessionStorage.getItem("MorningPlan"));
      const dietName = JSON.parse(sessionStorage.getItem("DietName"));
      
      const healthMetricsData = JSON.parse(
        sessionStorage.getItem("GeneralSuggestion")
      );
      
      const sleepData = getValues("sleep");

      console.log("sleepData", {
        dinnerData,
        lunchData,
        breakfastData,
        healthMetricsData,
        branch,
        sleep: sleepData,
        dietName: dietName.diet_name,
      });
      if (
        sleepData &&
        dinnerData &&
        lunchData &&
        breakfastData &&
        healthMetricsData &&
        branch
      ) {
        const data = {
          sleepData,
          dinnerData,
          lunchData,
          breakfastData,
          healthMetricsData,
          branch: branch,
          dietName: dietName.diet_name,
        };
        console.log("datac545465446", data);
        // onSubmit(data);

        try {
          let response;
          if (diet_id) {
            response = await axiosSecure.put(`/diet-plan/put/${diet_id}`, data);
          } else {
            response = await axiosSecure.post(`/diet-plan/post`, data);
          }
          console.log("response", response);
          if (response?.status === 200 || response.status === 201) {
            toast.success("Diet plan Created successfully!");
            setIsShowModal(false);
            console.log("data", data);
            setFormIndex(0);
          }
        } catch (error) {
          console.log(error);
          toast.error("Request failed!");
        }
      }
    }
    handleSubmitData();
  }, [axiosSecure, diet_id, getValues, setIsShowModal, setFormIndex]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AddDietInput
        title={"Sleep"}
        register={register}
        error={errors}
        name={"sleep"}
        isRequired={true}
        label={"Sleep"}
        // value={sleepData}
        // onChange={(e) => {
        //   console.log("e.target.value", e.target.value);
        // }}
      />

      <NextPrevBtn
        setFormIndex={setFormIndex}
        formIndex={formIndex}
        formTypes={formTypes}
        isSubmitBackBtn={true}
        handleAllSubmit={handleAllSubmit}
      />
    </form>
  );
}

export default BeforeSleep;
