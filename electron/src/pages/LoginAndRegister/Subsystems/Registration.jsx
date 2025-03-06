import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import logo from "../../../assets/logo.png";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; // Assuming you are using react-router-dom for navigation
import { useAuth } from "../../../providers/AuthProvider";
import { getAuth, sendEmailVerification } from "firebase/auth";
import moment from "moment";
import UseAxiosSecure from "../../../Hook/UseAxioSecure";
import Swal from "sweetalert2";

const RegistrationSchema = z
  .object({
    email: z
      .string()
      .email({ message: "Please enter a valid email address" })
      .nonempty("Email is required"),
    full_name: z
      .string()
      .min(4, { message: "Full name must be more than 4 characters" })
      .nonempty("Full name is required"),
    contact_no: z
      .string()
      .regex(/^\d+$/, { message: "Contact number must be numeric" })
      .min(11, { message: "Contact number must be at least 11 digits long" })
      .nonempty("Contact number is required"),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])/, {
        message:
          "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
      })
      .nonempty("Password is required"),
    confirmPassword: z.string().nonempty("Confirm password is required"),
    branch: z.string().nonempty("Branch is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function Registration({ handleBackToLogin }) {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(RegistrationSchema),
  });
  const navigate = useNavigate();
  const axiosSecure = UseAxiosSecure();
  const { loading, setLoading, createUser } = useAuth();

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const response = await axiosSecure.post("/users/registration", data);
      if (response.status === 201) {
        const resGoogle = await createUser(data.email, data.password);
        Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          text: "Welcome! Your registration is complete. Please verify your email before signing in.",
          confirmButtonText: "OK",
        }).then(() => {
          handleBackToLogin();
        });
      }
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status) {
        const status = error.response.status;
        switch (status) {
          case 401:
            Swal.fire({
              icon: "error",
              title: "Unauthorized",
              text: "You are not authorized to perform this action. Please check your credentials and try again.",
              confirmButtonText: "OK",
            });
            break;
          case 402:
            setError("email", {
              type: "manual",
              message: "Email already exists.",
            });
            setError("contact_no", {
              type: "manual",
              message: "Mobile number already exists.",
            });
            Swal.fire({
              icon: "error",
              title: "Duplicate Entry",
              text: "Both email and mobile number already exist for this branch.",
              confirmButtonText: "OK",
            });
            break;
          case 403:
            setError("email", {
              type: "manual",
              message: "Email already exists.",
            });
            Swal.fire({
              icon: "error",
              title: "Duplicate Email",
              text: "This email already exists for this branch.",
              confirmButtonText: "OK",
            });
            break;
          case 404:
            setError("contact_no", {
              type: "manual",
              message: "Mobile number already exists.",
            });
            Swal.fire({
              icon: "error",
              title: "Duplicate Mobile Number",
              text: "This mobile number already exists for this branch.",
              confirmButtonText: "OK",
            });
            break;
          case 400:
            Swal.fire({
              icon: "error",
              title: "Registration Failed",
              text: "Branch cannot be empty.",
              confirmButtonText: "OK",
            });
            break;
          default:
            Swal.fire({
              icon: "error",
              title: "Registration Failed",
              text: "An unexpected error occurred. Please try again later.",
              confirmButtonText: "OK",
            });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: "An unexpected error occurred. Please try again later.",
          confirmButtonText: "OK",
        });
      }
      console.error("Registration error:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-xl backdrop-blur-md md:rounded-xl md:py-5 py-16 p-5 md:p-8 shadow-lg w-full bg-opacity-80 bg-gray-900">
      <div className="text-center mb-2">
        <img src={logo} alt="Logo" className="w-24 mx-auto" />
      </div>
      <h2 className="text-3xl text-white font-semibold text-center">
        Create an account
      </h2>
      <p className="text-gray-300 text-sm mb-8 text-center">
        Provide your details to continue
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name Field */}
          <div className="mb-2">
            <label className="block text-sm text-white">Full Name</label>
            <input
              placeholder="Full name"
              type="text"
              className="focus:border-gray-700 mt-1 transition duration-500 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline"
              {...register("full_name")}
            />
            {errors?.full_name?.message && (
              <p className="text-red-500 pt-2 pl-2">
                {errors.full_name.message}
              </p>
            )}
          </div>

          {/* Branch Selection */}
          <div className="mb-2">
            <label className="block text-sm text-white">Branch</label>
            <select
              className="focus:border-gray-700 mt-1 transition duration-500 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline"
              {...register("branch", { required: "Branch is required" })}
            >
              <option value="">Select Branch</option>
              <option value="shia">Shia Masjid Branch</option>
              <option value="lalmatia">Lalmatia Branch</option>
            </select>
            {errors?.branch?.message && (
              <p className="text-red-500 pt-2 pl-2">{errors.branch.message}</p>
            )}
          </div>

          {/* Mobile Number Field */}
          <div className="mb-2">
            <label className="block text-sm text-white">Mobile Number</label>
            <input
              placeholder="Mobile"
              type="text"
              className="focus:border-gray-700 mt-1 transition duration-500 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline"
              {...register("contact_no")}
            />
            {errors?.contact_no?.message && (
              <p className="text-red-500 pt-2 pl-2">
                {errors.contact_no.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="mb-2">
            <label className="block text-sm text-white">Email</label>
            <input
              placeholder="Email"
              type="email"
              className="focus:border-gray-700 mt-1 transition duration-500 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline"
              {...register("email")}
            />
            {errors?.email?.message && (
              <p className="text-red-500 pt-2 pl-2">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-2 relative">
            <label className="block text-sm text-white">Password</label>
            <input
              placeholder="Password"
              type={isShowPassword ? "text" : "password"}
              className="focus:border-gray-700 mt-1 transition duration-500 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setIsShowPassword(!isShowPassword)}
              className="absolute right-2 top-7 p-2 text-2xl"
            >
              {isShowPassword ? <FiEyeOff /> : <FiEye />}
            </button>
            {errors?.password?.message && (
              <p className="text-red-500 pt-2 pl-2">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="mb-2">
            <label className="block text-sm text-white">Confirm Password</label>
            <input
              placeholder="Confirm password"
              type={isShowPassword ? "text" : "password"}
              className="focus:border-gray-700 mt-1 transition duration-500 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline"
              {...register("confirmPassword")}
            />
            {errors?.confirmPassword?.message && (
              <p className="text-red-500 pt-2 pl-2">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="flex gap-1 font-semibold justify-center items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl shadow transition duration-500 w-full"
          disabled={loading}
        >
          {loading && (
            <span className="loading loading-spinner loading-md"></span>
          )}
          Register
        </button>
      </form>

      <div className="text-center mt-4">
        <p
          className="text-white text-sm hover:underline cursor-pointer"
          onClick={handleBackToLogin}
        >
          Already have an account? Sign in
        </p>
      </div>
    </div>
  );
}

export default Registration;
