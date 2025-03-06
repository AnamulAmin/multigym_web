<div className="flex gap-2 cursor-pointer min-h-10 items-center bg-yellow-500 text-white  px-8 rounded-xl shadow hover:bg-yellow-700 transition duration-300 text-lg">
  {loading ? (
    <>
      <span className="loading loading-spinner loading-md"></span>
    </>
  ) : (
    <>
      <button
        type="submit"
        className="font-semibold"
        disabled={loading}
      >
        Save
      </button>
    </>
  )}
</div>