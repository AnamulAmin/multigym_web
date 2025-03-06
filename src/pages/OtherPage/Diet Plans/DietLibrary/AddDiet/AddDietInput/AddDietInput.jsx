import React from "react";

function AddDietInput({
  title,
  register = () => {},
  error = {},
  name,
  isRequired,
  label,
  onChange,
  type = "text",
  unit = "",
  placeholder = "",
  isUnit = false,
  options = [],
  unitChange = () => {},
}) {
  return (
    <div className="flex relative">
      <label className=" text-gray-700 font-semibold py-4 pl-4 w-52 text-lg bg-gray-300 flex items-center gap-4">
        {label}
        {isUnit && (
          <select
            className="select select-bordered w-full max-w-xs transition duration-150 ease-in-out hover:border-gray-400 focus:outline-none focus:border-blue-500 "
            onChange={(e) => unitChange(e.target.value)}
            value={unit}
          >
            {options.map((item, index) => (
              <option value={item} key={index}>
                {item}
              </option>
            ))}
          </select>
        )}
      </label>
      <input
        type={type}
        className="w-full p-2 border border-gray-200 focus:outline-none focus:border-gray-300"
        {...register(name, { required: isRequired, ...onChange })}
        placeholder={placeholder}
      />
      <p className="absolute bottom-0 right-3">
        {error[name]?.message && (
          <span className="text-red-500">{error[name]?.message}</span>
        )}
      </p>
      <p className="absolute bottom-1/2 translate-y-1/2 right-3">
        {unit && <span className="text-gray-500">{unit}</span>}
      </p>
    </div>
  );
}

export default AddDietInput;
