import React from "react";

function MyWorkoutInput({
  title,
  placeholder,
  register,
  error,
  name,
  type,
  watch,
  setValue,
}) {
  console.log("watch", watch(name));
  return (
    <div className="">
      <label className=" mr-auto capitalize font-semibold">
        {type === "option" ? title.split(":")[0] : title}:
      </label>
      <div className="mt-1">
        {type === "number" || type === "text" || type === "date" ? (
          <>
            <input
              type={type}
              placeholder={placeholder}
              className="w-full p-2 border border-gray-200 rounded-xl outline-none focus:border-gray-300"
              {...register(name, { required: true })}
            />
            {error[name] && (
              <p className="text-red-500">{error[name]?.message}</p>
            )}
          </>
        ) : type === "option" ? (
          <div className="w-full">
            <select
              className="select select-bordered w-full  transition duration-150 ease-in-out hover:border-gray-400 focus:outline-none focus:border-blue-500 "
              value={watch(name)}
              onChange={(e) => setValue(name, e.target.value)}
            >
              <option value="" disabled>
                Select One
              </option>
              <option value="custom">Custom</option>
              {title
                .split(":")[1]
                .split(",")
                ?.map((item, index) => (
                  <option value={item} key={index}>
                    {item}
                  </option>
                ))}
            </select>
          </div>
        ) : (
          <>
            <textarea
              placeholder={placeholder}
              className="w-full p-2 border border-gray-200 resize-none rounded-xl outline-none focus:border-gray-300"
              {...register(name, { required: true })}
            />
            {error[name] && (
              <p className="text-red-500">{error[name]?.message}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default MyWorkoutInput;
