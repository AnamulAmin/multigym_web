import React from "react";

function AddDietTextArea({
  title,
  register = () => {},
  error = {},
  name,
  isRequired,
  label,
  ...rest
}) {
  return (
    <div className="flex relative">
        <label className="block text-gray-700 font-semibold py-4 pl-4 w-52 text-lg bg-gray-300">
          {label}
        </label>
          <textarea
        className="w-full p-2 border min-h-[150px] border-gray-200 focus:outline-none focus:border-gray-300"
        {...register(name, { required: isRequired })}
          ></textarea>
        <p className="absolute bottom-0 right-3">
          {error[name]?.message && (
            <span className="text-red-500">{error[name]?.message}</span>
          )}
        </p>
      </div>
  );
}

export default AddDietTextArea;
