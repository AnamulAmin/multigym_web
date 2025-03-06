import React, { useEffect } from "react";
import AddDietInput from "../AddDietInput/AddDietTextArea";
import NextPrevBtn from "./NextPrevBtn/NextPrevBtn";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const dietSchema = z.object({
  mid_morning_lunch_rice: z.string().refine((val) => val.trim() !== "", {
    message: "Lunch (Rice) must be provided or left empty",
  }),
  mid_morning_fish_meat: z.string().refine((val) => val.trim() !== "", {
    message: "Fish/Meat must be provided or left empty",
  }),
  mid_morning_pulse: z.string().refine((val) => val.trim() !== "", {
    message: "Pulse must be provided or left empty",
  }),
  mid_morning_shack: z.string().refine((val) => val.trim() !== "", {
    message: "Shack must be provided or left empty",
  }),
  mid_morning_vegetable: z.string().refine((val) => val.trim() !== "", {
    message: "Vegetable must be provided or left empty",
  }),
  mid_morning_salad: z.string().refine((val) => val.trim() !== "", {
    message: "Salad must be provided or left empty",
  }),
});

function MidMorning({ setFormIndex, formIndex, formTypes, isShowModal }) {
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

  const onSubmit = async (data) => {
    console.log("data", data);
    if (formIndex < formTypes.length - 1 && data) {
      sessionStorage.setItem("MidMorning", JSON.stringify(data));
      setFormIndex(formIndex + 1);
    }
    return;
  };

  useEffect(() => {
    if (!isShowModal) {
      sessionStorage.removeItem("MidMorning");
      reset();
    }
  }, [isShowModal, reset]);

  useEffect(() => {
    const data = sessionStorage.getItem("MidMorning");
    if (data) {
      setValue("lunch_rice", JSON.parse(data).lunch_rice);
      setValue("fish_meat", JSON.parse(data).fish_meat);
      setValue("pulse", JSON.parse(data).pulse);
      setValue("shack", JSON.parse(data).shack);
      setValue("vegetable", JSON.parse(data).vegetable);
      setValue("salad", JSON.parse(data).salad);
    } else {
      setValue("lunch_rice", "");
      setValue("fish_meat", "");
      setValue("pulse", "");
      setValue("shack", "");
      setValue("vegetable", "");
      setValue("salad", "");
    }
  }, [setValue]);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3 className="border-b font-semibold text-gray-600 mb-5 text-lg max-w-max">Mid-Morning : </h3>
      <div className="grid grid-cols-3 gap-4 mt-2">
        <AddDietInput
          title={"Lunch (Rice)"}
          register={register}
          error={errors}
          name={"lunch_rice"}
          isRequired={true}
          label={"Lunch (Rice)"}
        />
        <AddDietInput
          title={"Fish/Meat"}
          register={register}
          error={errors}
          name={"fish_meat"}
          isRequired={true}
          label={"Fish/Meat"}
        />
        <AddDietInput
          title={"Pulse"}
          register={register}
          error={errors}
          name={"pulse"}
          isRequired={true}
          label={"Pulse"}
        />
        <AddDietInput
          title={"Shack"}
          register={register}
          error={errors}
          name={"shack"}
          isRequired={true}
          label={"Shack"}
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
          title={"Salad"}
          register={register}
          error={errors}
          name={"salad"}
          isRequired={true}
          label={"Salad"}
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

export default MidMorning;
