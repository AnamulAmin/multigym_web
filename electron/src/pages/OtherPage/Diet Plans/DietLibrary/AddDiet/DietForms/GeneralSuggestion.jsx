import React, { useEffect } from "react";
import AddDietInput from "../AddDietInput/AddDietTextArea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import NextPrevBtn from "./NextPrevBtn/NextPrevBtn";

const dietSchema = z.object({
  weight: z
    .string()
    .nonempty({ message: "Weight must be provided or Enter none" }),
  height: z.string().refine((val) => val.trim() !== "", {
    message: "Height must be provided or Enter none",
  }),
  ideal_weight: z.string().refine((val) => val.trim() !== "", {
    message: "Ideal Weight must be provided or Enter none",
  }),
  extra_weight: z.string().refine((val) => val.trim() !== "", {
    message: "Extra Weight must be provided or Enter none",
  }),
  bp: z.string().refine((val) => val.trim() !== "", {
    message: "Blood Pressure (B.P.) must be provided or Enter none",
  }),
  calorie: z.string().refine((val) => val.trim() !== "", {
    message: "Calorie count must be provided or Enter none",
  }),
  water: z.string().refine((val) => val.trim() !== "", {
    message: "Water intake must be provided or Enter none",
  }),
  sugar: z.string().refine((val) => val.trim() !== "", {
    message: "Sugar intake must be provided or Enter none",
  }),
  oil: z.string().refine((val) => val.trim() !== "", {
    message: "Oil intake must be provided or Enter none",
  }),
  suggestion: z.string().refine((val) => val.trim() !== "", {
    message: "Suggestion must be provided or Enter none",
  }),
});

function GeneralSuggestion({
  setFormIndex,
  formIndex,
  formTypes,
  isShowModal,
}) {
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
      console.log("isShowModal", isShowModal);
      sessionStorage.removeItem("GeneralSuggestion");
      reset();
    }
  }, [isShowModal, reset]);

  const onSubmit = async (data) => {
    if (formIndex < formTypes.length - 1 && data) {
      sessionStorage.setItem("GeneralSuggestion", JSON.stringify(data));
      setFormIndex(formIndex + 1);
    }
    return;
  };

  useEffect(() => {
    const data = sessionStorage.getItem("GeneralSuggestion");
    if (data) {
      setValue("weight", JSON.parse(data).weight);
      setValue("height", JSON.parse(data).height);
      setValue("ideal_weight", JSON.parse(data).ideal_weight);
      setValue("extra_weight", JSON.parse(data).extra_weight);
      setValue("bp", JSON.parse(data).bp);
      setValue("calorie", JSON.parse(data).calorie);
      setValue("water", JSON.parse(data).water);
      setValue("sugar", JSON.parse(data).sugar);
      setValue("oil", JSON.parse(data).oil);
      setValue("suggestion", JSON.parse(data).suggestion);
    } else {
      setValue("weight", "");
      setValue("height", "");
      setValue("ideal_weight", "");
      setValue("extra_weight", "");
      setValue("bp", "");
      setValue("calorie", "");
      setValue("water", "");
      setValue("sugar", "");
      setValue("oil", "");
      setValue("suggestion", "");
    }
  }, [setValue]);

  return (
    <form className="grid grid-cols-3 gap-6" onSubmit={handleSubmit(onSubmit)}>
      <AddDietInput
        title="Weight"
        register={register}
        error={errors}
        name={"weight"}
        isRequired={true}
        label={"Weight"}
      />

      <AddDietInput
        title="Height"
        register={register}
        error={errors}
        name={"height"}
        isRequired={true}
        label={"Height"}
      />
      <AddDietInput
        title="Ideal Weight"
        register={register}
        error={errors}
        name={"ideal_weight"}
        isRequired={true}
        label={"Ideal Weight"}
      />
      <AddDietInput
        title="Extra Weight"
        register={register}
        error={errors}
        name={"extra_weight"}
        isRequired={true}
        label={"Extra Weight"}
      />
      <AddDietInput
        title="B.P."
        register={register}
        error={errors}
        name={"bp"}
        isRequired={true}
        label={"Blood Pressure (B.P.)"}
      />
      <AddDietInput
        title="Calorie"
        register={register}
        error={errors}
        name={"calorie"}
        isRequired={true}
        label={"Calorie count"}
      />
      <AddDietInput
        title="Water"
        register={register}
        error={errors}
        name={"water"}
        isRequired={true}
        label={"Water intake"}
      />
      <AddDietInput
        title="Sugar"
        register={register}
        error={errors}
        name={"sugar"}
        isRequired={true}
        label={"Sugar intake"}
      />
      <AddDietInput
        title="Oil"
        register={register}
        error={errors}
        name={"oil"}
        isRequired={true}
        label={"Oil intake"}
      />

      <div className="col-span-3">
        <label className="block text-gray-700 font-semibold mb-2">
          Suggestion:
        </label>
        <textarea
          className="w-full p-2 border border-gray-200   rounded-xl focus:outline-none  resize-none focus:border-gray-300"
          {...register("suggestion", { required: true })}
        ></textarea>
        <p>
          {errors.suggestion && (
            <span className="text-red-500">{errors.suggestion.message}</span>
          )}
        </p>
      </div>

      <NextPrevBtn
        setFormIndex={setFormIndex}
        formIndex={formIndex}
        formTypes={formTypes}
      />
    </form>
  );
}

export default GeneralSuggestion;
