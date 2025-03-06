
import Mtitle from "../../../../../components library/Mtitle";
import MyWorkoutInput from "../MyWorkoutInput/MyWorkoutInput";

function MyWorkoutForm({
  handleSubmit,
  onSubmit,
  loading,
  inputFields,
  radioFields,
  register,
  errors,
  watch,
  setValue,
}) {
  return (
    <div className="p-6 my-10 w-full max-w-[70%] mx-auto bg-white rounded-lg shadow-md">
      <div className="pl-1">
        <Mtitle title="Workout Questions"></Mtitle>
      </div>
      <form
        className="w-full mx-auto p-3 rounded-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-3">
          {inputFields.map((field) => (
            <MyWorkoutInput
              key={field.name}
              register={register}
              error={errors}
              type={field.field_type}
              name={field.name}
              title={field.label}
              placeholder={field.placeholder}
              watch={watch}
              setValue={setValue}
            />
          ))}
        </div>

        <div className="mt-8">
          <div className="grid gap-3 md:grid-cols-1">
            {radioFields?.map((field, index) => (
              <div
                key={field.name}
                className="flex items-center bg-white p-4 rounded-lg"
              >
                <label className="mr-auto">{field.label}</label>
                <div className="flex justify-between flex-col">
                  <div className="flex items-center space-x-2 ">
                    {["yes", "no"].map((option) => (
                      <label
                        key={option}
                        className="flex items-center space-x-4 cursor-pointer p-2  rounded-lg"
                      >
                        <input
                          type="radio"
                          {...register(field.name, {
                            onChange: (e) => {
                              console.log(e.target.checked, option, field.name);

                              // setValue(field.name, option);
                            },
                          })}
                          id={field.name}
                          name={field.name}
                          value={option}
                          checked={watch(field.name) === option} // Use watch to track the selected value
                        // onChange={} // Update the value when changed
                        />
                        <span>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors[field.name] && (
                    <p className="text-red-500">{errors[field.name].message}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-8 flex justify-center items-center gap-3 bg-yellow-500 hover:bg-yellow-600  text-white py-2 text-xl font-semibold rounded-md"
        >
          {loading && (
            <>
              <span className="loading loading-spinner loading-md"></span>
            </>)}
          Submit
        </button>
      </form>
    </div>
  );
}

export default MyWorkoutForm;
