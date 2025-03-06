import React, { useEffect } from "react";
import AddDietInput from "../AddDietInput/AddDietTextArea";
import NextPrevBtn from "./NextPrevBtn/NextPrevBtn";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const dietSchema = z.object({
  evening_dinner_rice_roti: z.string().refine((val) => val.trim() !== "", {
    message: "Dinner (Rice/Roti) must be provided or left empty",
  }),
  evening_fish_meat: z.string().refine((val) => val.trim() !== "", {
    message: "Fish/Meat must be provided or left empty",
  }),
  evening_pulse: z.string().refine((val) => val.trim() !== "", {
    message: "Pulse must be provided or left empty",
  }),
  evening_shack: z.string().refine((val) => val.trim() !== "", {
    message: "Shack must be provided or left empty",
  }),
  evening_vegetable: z.string().refine((val) => val.trim() !== "", {
    message: "Vegetable must be provided or left empty",
  }),
  evening_salad: z.string().refine((val) => val.trim() !== "", {
    message: "Salad must be provided or left empty",
  }),
});

function EveningSnacks({ setFormIndex, formIndex, formTypes, isShowModal }) {
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
      sessionStorage.removeItem("EveningSnacks");
      reset();
    }
  }, [isShowModal, reset]);

  const onSubmit = async (data) => {
    console.log("data", data);
    if (formIndex < formTypes.length - 1 && data) {
      sessionStorage.setItem("EveningSnacks", JSON.stringify(data));
      setFormIndex(formIndex + 1);
    }
    return;
  };

  useEffect(() => {
    const data = sessionStorage.getItem("EveningSnacks");
    if (data) {
      setValue("dinner_rice_roti", JSON.parse(data).dinner_rice_roti);
      setValue("fish_meat", JSON.parse(data).fish_meat);
      setValue("pulse", JSON.parse(data).pulse);
      setValue("shack", JSON.parse(data).shack);
      setValue("vegetable", JSON.parse(data).vegetable);
      setValue("salad", JSON.parse(data).salad);
    } else {
      setValue("dinner_rice_roti", "");
      setValue("fish_meat", "");
      setValue("pulse", "");
      setValue("shack", "");
      setValue("vegetable", "");
      setValue("salad", "");
    }
  }, [setValue]);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3 className="border-b font-semibold text-gray-600 mb-5 max-w-max text-lg">Evening Snacks : </h3>
      <div className="grid grid-cols-2 gap-4 mt-2">
        <AddDietInput
          title={"Dinner (Rice/Roti)"}
          register={register}
          error={errors}
          name={"evening_dinner_rice_roti"}
          isRequired={true}
          label={"Dinner (Rice/Roti)"}
        />
        <AddDietInput
          title={"Fish/Meat"}
          register={register}
          error={errors}
          name={"evening_fish_meat"}
          isRequired={true}
          label={"Fish/Meat"}
        />
        <AddDietInput
          title={"Pulse"}
          register={register}
          error={errors}
          name={"evening_pulse"}
          isRequired={true}
          label={"Pulse"}
        />
        <AddDietInput
          title={"Shack"}
          register={register}
          error={errors}
          name={"evening_shack"}
          isRequired={true}
          label={"Shack"}
        />
        <AddDietInput
          title={"Vegetable"}
          register={register}
          error={errors}
          name={"evening_vegetable"}
          isRequired={true}
          label={"Vegetable"}
        />
        <AddDietInput
          title={"Salad"}
          register={register}
          error={errors}
          name={"evening_salad"}
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

export default EveningSnacks;
