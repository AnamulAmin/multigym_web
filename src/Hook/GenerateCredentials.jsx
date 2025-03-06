import React, { useState, useContext } from "react";
import { FaLock } from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../providers/AuthProvider";
import UseAxiosSecure from "./UseAxioSecure";


function GenerateCredentials({ email }) {
  const axiosSecure = UseAxiosSecure();
  const { resetPasswordWithEmail, branch } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const generatePassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%&*_+?';
    let password = '';
    password += uppercase[Math.floor(Math.random() * uppercase.length)]; 
    password += lowercase[Math.floor(Math.random() * lowercase.length)]; 
    const repeatChar = lowercase[Math.floor(Math.random() * lowercase.length)];
    password += repeatChar.repeat(3);
    password += lowercase[Math.floor(Math.random() * lowercase.length)]; 
    password += symbols[Math.floor(Math.random() * symbols.length)]; 
    const randomDigits = Array.from({ length: 4 }, () => numbers[Math.floor(Math.random() * numbers.length)]);
    password += randomDigits.join('');
  
    return password;
  };

  const handleGetIdAndPass = async () => {
    if (!email) {
      Swal.fire({
        title: 'Invalid Email',
        text: 'Please provide a valid email to generate credentials.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    const password = generatePassword();
    setLoading(true);

    try {
      const response = await axiosSecure.post(`/users/createFirebaseUser?branch=${branch}`, { email, password });

      if (response.status === 201) {
        Swal.fire({
          title: 'User Created Successfully!',
          html: `<p><strong>Email:</strong> ${email}</p><p><strong>Password:</strong> ${password}</p>`,
          icon: 'success',
        });
      }
    } catch (error) {
      handleFirebaseError(error, email);
    } finally {
      setLoading(false);
    }
  };

  const handleFirebaseError = (error, email) => {
    if (error.response && error.response.data.error) {
      const { code } = error.response.data.error;
      if (code === "auth/email-already-exists") {
        resetPasswordWithEmail(email).then(() => {
          Swal.fire({
            title: 'Password Reset Email Sent!',
            text: `A password reset email has been sent successfully to ${email}`,
            icon: 'success',
          });
        }).catch(() => {
          Swal.fire({
            title: 'Error',
            text: 'Failed to send password reset email. Please try again later.',
            icon: 'error',
          });
        });
      } else if (code === "auth/invalid-email") {
        Swal.fire({
          title: 'Invalid Email Format',
          text: 'The email address is improperly formatted. Please enter a valid email.',
          icon: 'error',
        });
      } else if (code === "auth/too-many-requests") {
        Swal.fire({
          title: 'Too Many Requests',
          text: 'You have made too many requests in a short period. Please try again later.',
          icon: 'warning',
        });
      } else {
        Swal.fire({
          title: 'An Error Occurred',
          text: 'Please try again later.',
          icon: 'error',
        });
      }
    } else {
      Swal.fire({
        title: 'Network Error',
        text: 'Please check your connection and try again.',
        icon: 'error',
      });
    }
  };

  return (
 

<button
  onClick={handleGetIdAndPass}
  disabled={loading}
  className={`flex items-center gap-2 border rounded-full px-4 py-1 transition-all duration-300
    ${loading ? "bg-gray-200 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"}`}
>
  {loading ? (
    <span className="flex items-center gap-2">
      <span className="loading loading-spinner loading-sm text-blue-600"></span>
    </span>
  ) : (
    <>
      <FaLock className="text-white text-lg" />
      <span className="font-semibold">Get Pass</span>
    </>
  )}
</button>
  );
}

export default GenerateCredentials;
