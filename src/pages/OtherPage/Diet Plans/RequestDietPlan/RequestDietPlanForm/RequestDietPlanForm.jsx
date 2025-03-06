import React, { useEffect, useState } from "react";
import FoodHabitInput from "../FoodHabitInput/FoodHabitInput";
import Mtitle from "../../../../../components library/Mtitle";

function RequestDietPlanForm({
  inputFields,
  radioFields,
  onSubmit,
  foodHabitUserAnswer,
  setFoodHabitUserAnswer,
}) {
  // Local state to store form values and errors
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle input change for text fields
  const handleInputChange = (name, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Handle radio button selection
  const handleRadioChange = (name, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(formValues);
      setLoading(false);
    } else {
      setErrors(validationErrors);
      setLoading(false);
    }
    setLoading(false);
  };

  // Simple validation
  const validateForm = () => {
    const newErrors = {};
    inputFields.forEach((field) => {
      if (!formValues[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });
    radioFields.forEach((field) => {
      if (formValues[field.name] === undefined) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });
    return newErrors;
  };

  useEffect(() => {
    // foodHabitUserAnswer.forEach((key) => {
    //   setFormValues((prevValues) => ({
    //     ...prevValues,
    //     [key.name]: key.value,
    //   }));
    // });

    for (let key in foodHabitUserAnswer) {
      setFormValues((prevValues) => ({
        ...prevValues,
        [key]: foodHabitUserAnswer[key],
      }));
    }
    // setFormValues(foodHabitUserAnswer);
  }, [foodHabitUserAnswer]);

  return (
    <div className="px-2">
      <div className="pl-1">
        <Mtitle title="Food Habits" />
      </div>

      <form className="w-full mx-auto p-3 rounded-lg" onSubmit={handleSubmit}>
        {/* Input Fields Section */}
        <div className="space-y-3">
          {inputFields.map((field) => (
            <FoodHabitInput
              key={field.name}
              value={formValues[field.name] || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              onClick={(value) => handleInputChange(field.name, value)}
              error={errors[field.name]}
              type={field.field_type}
              name={field.name}
              title={field.label}
              placeholder={field.placeholder}
              formValues={formValues}
            />
          ))}
        </div>

        {/* Radio Fields Section */}
        <div className="mt-8">
          <h2 className="text-3xl font-semibold mb-4">Additional Questions</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {radioFields.map((field) => (
              <div
                key={field.name}
                className="flex items-center bg-white p-4 rounded-lg"
              >
                <label className="mr-auto">{field.label}</label>
                <div className="flex space-x-4">
                  {/* Yes/No Radio Options with Boolean Values */}
                  {[
                    { label: "Yes", value: true },
                    { label: "No", value: false },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg"
                    >
                      <input
                        type="radio"
                        name={field.name}
                        value={option.value}
                        checked={formValues[field.name] === option.value}
                        onChange={() =>
                          handleRadioChange(field.name, option.value)
                        }
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
                {errors[field.name] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-8 bg-yellow-500 hover:bg-yellow-600 text-white py-2 text-xl font-semibold rounded-md"
          disabled={loading}
        >
          {loading && (
            <span className="loading loading-spinner loading-md"></span>
          )}
          Submit
        </button>
      </form>
    </div>
  );
}

export default RequestDietPlanForm;
