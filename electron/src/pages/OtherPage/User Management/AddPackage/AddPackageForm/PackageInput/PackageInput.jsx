import React from "react";

function PackageInput({
  label,
  type,
  readOnly,
  register,
  error,
  name,
  isRequired = true,
  onChange = { onChange: () => {} },
  ...res
}) {
  return (
    <div
      className={
        "w-full grid grid-cols-1 lg:grid-cols-2 gap-4 space-y-2 pt-2 items-center"
      }
    >
      <label
        htmlFor={label}
        className="capitalize font-bold text-[0.9rem] text-[1.2rem]"
      >
        {label}
      </label>
      <div className="w-full">
        <input
          type={type}
          id={label}
          className={`w-full p-1 bg-slate-50 border border-gray-300 focus:border-black input input-bordered ${
            readOnly && "cursor-not-allowed bg-[#eee]"
          }`}
          readOnly={readOnly}
          {...register(name, { required: isRequired, ...onChange })}
          {...res}
        />

        {error?.[name]?.message && (
          <p className="text-red-500 pt-2 pl-2">{error?.[name]?.message}</p>
        )}
      </div>
    </div>
  );
}

export default PackageInput;
