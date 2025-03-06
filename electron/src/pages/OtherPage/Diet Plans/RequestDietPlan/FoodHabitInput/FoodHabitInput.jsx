import React from "react";

function FoodHabitInput({
  title,
  placeholder,
  error,
  name,
  type,
  value,
  onChange,
  formValues,
  onClick,
}) {
  return (
    <div>
      <label className="mr-auto capitalize font-semibold">
        {type === "option" ? title.split(":")[0] : title}:
      </label>
      <div className="mt-1">
        {type === "textarea" ? (
          <>
            <textarea
              name={name}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              className="w-full p-2 border border-gray-200 resize-none rounded-xl outline-none focus:border-gray-300"
            />
            {error && <p className="text-red-500">{error}</p>}
          </>
        ) : type === "option" ? (
          <div className="w-full">
            <select
              className="select select-bordered w-full  transition duration-150 ease-in-out hover:border-gray-400 focus:outline-none focus:border-blue-500 "
              value={value}
              onChange={(e) => onChange({ target: { value: e.target.value } })}
            >
              <option value="" disabled>
                Select a Package
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
            <input
              type={type}
              name={name}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              className="w-full p-2 border border-gray-200 rounded-xl outline-none focus:border-gray-300"
            />
            {error && <p className="text-red-500">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}

export default FoodHabitInput;
