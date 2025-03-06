import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import logo from "../../../assets/logo.png";
import { useAuth } from "../../../providers/AuthProvider";
import Swal from "sweetalert2";

const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .nonempty("Email is required"),
});

function ForgotPasswordPage({ onBackToLogin }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const { user, setLoading, resetPasswordWithEmail, loading } = useAuth();

  const onSubmit = (data) => {
    const { email } = data;
    setLoading(true);
    resetPasswordWithEmail(email)
      .then((result) => {
        console.log("result", result);

        if (result?.error) {
          throw new Error(result.error);
        }

        Swal.fire(
          "Password Reset",
          "Please check your email for password reset instructions.",
          "success"
        );
      })
      .catch((err) => {
        Swal.fire(
          "Error",
          "There was an error resetting your password. Please try again later.",
          "error"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="max-w-md backdrop-blur-md md:rounded-xl md:py-5 py-16 p-5 md:p-8 shadow-lg w-full bg-opacity-80 bg-gray-900">
      <div className="text-center mb-4">
        <img src={logo} alt="Logo" className="w-24 mx-auto" />
      </div>
      <h2 className="text-3xl text-white font-semibold text-center">
        Forgot Password
      </h2>
      <p className="text-gray-300 text-sm mb-8 text-center">
        Enter your email to reset your password
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm text-white">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="focus:border-gray-700 mt-1 transition duration-500 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline"
            {...register("email")}
          />
          {errors?.email?.message && (
            <p className="text-red-500 pt-2 pl-2">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="flex gap-1 font-semibold justify-center items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl shadow transition duration-500 w-full"
          disabled={loading}
        >
          {loading && (
            <span className="loading loading-spinner loading-md"></span>
          )}
          Reset Password
        </button>
      </form>

      <div className="text-center mt-4">
        <p
          className="text-white text-sm hover:underline cursor-pointer"
          onClick={onBackToLogin}
        >
          Back to Login
        </p>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
