import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import * as z from "zod";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import logo from "../../../assets/logo.png";
import { useAuth } from "../../../providers/AuthProvider";
import UseAxiosSecure from "../../../Hook/UseAxioSecure";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // Make sure toast is installed and imported

const LoginSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .nonempty("Email is required"),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }) // Only minimum length validation
    .nonempty("Password is required"),
});

function LoginPage({ onCreateAccountClick, onForgotPasswordClick }) {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });
  const defaultEmail = "anamulamin20@gmail.com";
  const defaultPassword = "MULTYGym@1234";
  const axiosSecure = UseAxiosSecure();
  const {
    user,
    setUser,
    loading,
    setLoading,
    signInUser,
    signInWithGoogle,
    signInWithFacebook,
    logOut,
  } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("email") || defaultEmail;
    const savedPassword = localStorage.getItem("password") || defaultPassword;

    if (savedEmail && savedPassword) {
      setValue("email", savedEmail);
      setValue("password", savedPassword);
      setRememberMe(true);
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    const { email, password } = data;
    setLoading(true);
    if (rememberMe) {
      localStorage.setItem("email", email);
      localStorage.setItem("password", password); // Avoid this in production!
    }

    try {
      const result = await signInUser(email, password);
      navigate("/", { replace: true });
    } catch (error) {
      toast.error("Login failed. Please check your Email or Password.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      toast.success("Google login successful!");
    } catch (error) {
      toast.error("Google login failed. Please try again later.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithFacebook();
      toast.success("Facebook login successful!");
    } catch (error) {
      toast.error("Facebook login failed. Please try again later.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md backdrop-blur-md md:rounded-xl md:py-5 py-16 p-5 md:p-8 shadow-lg w-full bg-opacity-80 bg-gray-900">
      <div className="text-center mb-4">
        <img src={logo} alt="Logo" className="w-24 mx-auto" />
      </div>
      <h2 className="text-3xl text-white font-semibold text-center">
        Welcome back
      </h2>
      <p className="text-gray-300 text-sm mb-8 text-center">
        Please enter your account info
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm text-white">Email</label>
          <input
            type="email"
            placeholder="Email"
            className="focus:border-gray-700 mt-1 transition duration-500 appearance-none text-gray-700 text-sm border shadow-sm rounded-xl w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline"
            {...register("email")}
          />
          {errors?.email?.message && (
            <p className="text-red-500 pt-2 pl-2">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4 relative">
          <label className="block text-sm text-white">Password</label>
          <input
            type={isShowPassword ? "text" : "password"}
            placeholder="Password"
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
            <p className="text-red-500 pt-2 pl-2">{errors.password.message}</p>
          )}
        </div>

        <div className="flex justify-between items-center mt-2 mb-4">
          <label className="flex ml-1 items-center text-sm text-white cursor-pointer">
            <input
              type="checkbox"
              className="mr-2"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember Me
          </label>
          <p
            className="text-white text-sm hover:underline cursor-pointer ml-2"
            onClick={onForgotPasswordClick}
          >
            Forgot Password
          </p>
        </div>

        <button
          type="submit"
          className="flex gap-1 font-semibold justify-center items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl shadow transition duration-500 w-full"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="flex gap-3 justify-center mt-4">
        <div
          className="bg-white cursor-pointer rounded-full p-2"
          onClick={handleFacebookSignIn}
        >
          <FaFacebook className="w-7 h-7 text-blue-600" />
        </div>
        <div
          className="bg-white cursor-pointer rounded-full p-2"
          onClick={handleGoogleSignIn}
        >
          <FaGoogle className="w-7 h-7 text-red-600" />
        </div>
      </div>

      <div className="text-center mt-4">
        <p
          className="text-white text-sm hover:underline cursor-pointer"
          onClick={onCreateAccountClick}
        >
          New here? Create an account
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
