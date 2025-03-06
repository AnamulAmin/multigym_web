import React, { useEffect } from "react";
import AddDietInput from "../AddDietInput/AddDietTextArea";
import NextPrevBtn from "./NextPrevBtn/NextPrevBtn";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const dietSchema = z.object({
  roti: z.string().refine((val) => val.trim() !== "", {
    message: "Roti must be provided or left empty",
  }),
  egg: z.string().refine((val) => val.trim() !== "", {
    message: "Egg must be provided or left empty",
  }),
  vegetable: z.string().refine((val) => val.trim() !== "", {
    message: "Vegetable must be provided or left empty",
  }),
  fruit: z.string().refine((val) => val.trim() !== "", {
    message: "Fruit must be provided or left empty",
  }),
});

function MorningPlan({ setFormIndex, formIndex, formTypes, isShowModal }) {
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

  useEffect(() => {
    if (!isShowModal) {
      sessionStorage.removeItem("MorningPlan");
      reset();
    }
  }, [isShowModal, reset]);

  useEffect(() => {
    const data = sessionStorage.getItem("MorningPlan");
    if (data) {
      setValue("roti", JSON.parse(data).roti);
      setValue("egg", JSON.parse(data).egg);
      setValue("vegetable", JSON.parse(data).vegetable);
      setValue("fruit", JSON.parse(data).fruit);
    } else {
      setValue("roti", "");
      setValue("egg", "");
      setValue("vegetable", "");
      setValue("fruit", "");
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    console.log("data", data);
    if (formIndex < formTypes.length - 1 && data) {
      sessionStorage.setItem("MorningPlan", JSON.stringify(data));
      setFormIndex(formIndex + 1);
    }
    return;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3 className=" border-b font-semibold text-gray-600 mb-5 text-lg max-w-max"> Morning :</h3>
      <div className="grid grid-cols-2 gap-4 mt-2">
        <AddDietInput
          title={"Roti"}
          register={register}
          error={errors}
          name={"roti"}
          isRequired={true}
          label={"Roti"}
        />
        <AddDietInput
          title={"Egg"}
          register={register}
          error={errors}
          name={"egg"}
          isRequired={true}
          label={"Egg"}
        />
        <AddDietInput
          title={"Vegetable"}
          register={register}
          error={errors}
          name={"vegetable"}
          isRequired={true}
          label={"Vegetable"}
        />
        <AddDietInput
          title={"Fruit"}
          register={register}
          error={errors}
          name={"fruit"}
          isRequired={true}
          label={"Fruit"}
        />
      </div>
      <NextPrevBtn
        setFormIndex={setFormIndex}
        formIndex={formIndex}
        formTypes={formTypes}
      />
    </form>
  );
}

export default MorningPlan;
