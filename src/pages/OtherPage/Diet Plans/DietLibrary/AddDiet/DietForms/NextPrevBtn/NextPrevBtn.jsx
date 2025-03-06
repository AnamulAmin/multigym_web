import React from "react";

function NextPrevBtn({
  setFormIndex,
  formIndex,
  formTypes,
  isSubmitBackBtn = false,
  handleAllSubmit = () => {},
}) {
  return (
    <div className="mt-8 flex justify-between items-center w-full col-span-3">
      <button
        className={`${
          formIndex === 0 ? "bg-neutral-300" : "bg-gray-500 hover:bg-gray-600"
        } text-white px-4 py-2 rounded-lg font-semibold`}
        onClick={() => {
          if (isSubmitBackBtn) {
            setTimeout(() => {
              setFormIndex(formIndex - 1);
            }, 100);
            return;
          }
          setFormIndex(formIndex - 1);
        }}
        type={!isSubmitBackBtn ? "button" : "submit"}
        disabled={formIndex === 0}
      >
        Go Back
      </button>
      {formTypes.length === formIndex + 1 ? (
        <button
          className="bg-yellow-500 font-semibold  text-white px-4 py-2 rounded-lg"
          type="button"
          onClick={handleAllSubmit}
        >
          Save Diet Plan
        </button>
      ) : (
        <button
          className="bg-yellow-500 font-semibold hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
          type=""
        >
          Next
        </button>
      )}
    </div>
  );
}

export default NextPrevBtn;
