import React, { useEffect } from "react";
import AddDietInput from "../AddDietInput/AddDietTextArea";
import NextPrevBtn from "./NextPrevBtn/NextPrevBtn";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const dietSchema = z.object({
  diet_name: z.string().refine((val) => val.trim() !== "", {
    message: "Diet Name must be provided or left empty",
  }),
});

function SetDietName({
  setFormIndex,
  formIndex,
  formTypes,
  isShowModal,
  dietName,
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

  const onSubmit = async (data) => {
    console.log("data", data);
    if (formIndex < formTypes.length - 1 && data) {
      sessionStorage.setItem("DietName", JSON.stringify(data));
      setFormIndex(formIndex + 1);
    }
    return;
  };

  useEffect(() => {
    if (!isShowModal) {
      sessionStorage.removeItem("DietName");
      reset();
    }
  }, [isShowModal, reset]);

  useEffect(() => {
    if (dietName) {
      setValue("diet_name", dietName);
    }
    const data = sessionStorage.getItem("DietName");
    if (data) {
      setValue("diet_name", JSON.parse(data).diet_name);
    } else {
      setValue("diet_name", "");
    }
  }, [setValue, isShowModal, dietName]);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid  gap-4 mt-2">
        <AddDietInput
          title={"Diet Name"}
          register={register}
          error={errors}
          name={"diet_name"}
          isRequired={true}
          label={"Diet Name"}
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

export default SetDietName;
