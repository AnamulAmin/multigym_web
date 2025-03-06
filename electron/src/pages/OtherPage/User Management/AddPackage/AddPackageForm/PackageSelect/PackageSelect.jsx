import React from "react";

function PackageSelect({
  label,
  type = "select",
  children,
  register,
  error,
  name,
  isRequired = false,
  ...res
}) {
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-center pt-2">
      <label
        htmlFor={label}
        className="capitalize font-bold text-[1.2rem]"
      >
        {label}
      </label>
      <select
        type={type}
        id={label}
        className={`w-full p-2 bg-slate-50 border border-gray-300 focus:border-black focus:ring-2 focus:ring-black rounded-md`}
        {...register(name, { required: isRequired })}
        aria-required={isRequired}
        aria-invalid={error?.[name] ? "true" : "false"}
        {...res}
      >
        {children}
      </select>
      {error?.[name]?.message && (
        <p className="text-red-500 text-sm pt-1 pl-2">
          {error?.[name]?.message}
        </p>
      )}
    </div>
  );
}

export default PackageSelect;
