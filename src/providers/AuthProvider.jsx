import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  FacebookAuthProvider,
  sendPasswordResetEmail,
  updatePassword,
  sendEmailVerification,
} from "firebase/auth";

import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";
import auth from "../firebase/firebase.config";
import UseAxiosSecure from "../Hook/UseAxioSecure";
import Swal from "sweetalert2";

export const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser === "undefined" || storedUser == null
      ? null
      : JSON.parse(storedUser);
  });
  const [branch, setBranch] = useState("");
  const [loading, setLoading] = useState(false);
  const axiosSecure = UseAxiosSecure();
  const [isAddPackageBtn, setIsAddPackageBtn] = useState(false);
  const [isEmailVarified, setIsEmailVarified] = useState(false);

  const showAlert = (title, text, icon) => {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonText: "OK",
    });
  };

  const createUser = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Send email verification
      try {
        await sendEmailVerification(user);
        showAlert(
          "Verification Email Sent",
          "Please check your email to verify your account.",
          "success"
        );
      } catch (verificationError) {
        console.error("Error sending email verification:", verificationError);
        showAlert(
          "Verification Error",
          "Failed to send verification email. Please try again later.",
          "error"
        );
      }

      // Log out the user after sending verification email
      await logOut();
    } catch (error) {
      console.error("Error creating user:", error);
      showAlert("Sign-up Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const checkUserExistenceAndRole = async (userEmail) => {
    setLoading(true);
    try {
      const response = await axiosSecure.get(
        `/users/user_by_email/${userEmail}`
      );

      // if (!response.data.isExistUser) {
      //   showAlert(
      //     "User not found",
      //     "You are not registered in our system. Please contact support.",
      //     "error"
      //   );
      //   return null;
      // }

      const userData = response.data;
      // if (!(userData.card_no && userData.member_id)) {
      //   showAlert(
      //     "Registration Successful",
      //     "Your membership registration was successful. Please visit our office or call our office for updates.",
      //     "success"
      //   );
      //   await logOut();
      //   return null;
      // }

      // Set user and store in localStorage
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Error during user existence and role check:", error);
      showAlert("Sign-in Error", error.message, "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signInUser = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        showAlert(
          "Email not verified",
          "Please verify your email before signing in.",
          "error"
        );
        await logOut();
        setLoading(false);
        return null;
      }

      return await checkUserExistenceAndRole(user.email);
    } catch (error) {
      console.error("Error during sign-in:", error);
      localStorage.removeItem("email");
      localStorage.removeItem("password");
      showAlert(
        "Login Faild !!!",
        "Incorrect Email or password. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return await checkUserExistenceAndRole(result.user.email);
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      showAlert("Google Sign-in Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const signInWithFacebook = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      return await checkUserExistenceAndRole(result.user.email);
    } catch (error) {
      console.error("Error during Facebook sign-in:", error);
      showAlert("Facebook Sign-in Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const resetPasswordWithEmail = (email) => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email).finally(() => setLoading(false));
  };

  const handleSetNewPassword = (newPassword) => {
    setLoading(true);
    const authUser = auth?.currentUser;
    console.log(authUser, "authUser");
    return updatePassword(authUser, newPassword).finally(() =>
      setLoading(false)
    );
  };
  const getUserRole = async () => {
    try {
      const userEmail = auth?.currentUser?.email;
      if (userEmail) {
        const userData = await checkUserExistenceAndRole(userEmail);
        if (userData) {
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      showAlert(
        "Role Fetch Error",
        "Failed to determine user role. Please try again.",
        "error"
      );
    }
  };
  const logOut = () => {
    setLoading(true);
    return signOut(auth)
      .then(() => {
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("currentUser", currentUser);
      setLoading(false);

      if (currentUser) {
        getUserRole();
      } else {
        localStorage.removeItem("user");
        setUser(null);
      }
    });
    return () => {
      unSubscribe();
    };
  }, [axiosSecure, branch]);

  useEffect(() => {
    if (user) setBranch(user?.branch);
  }, [user]);

  const authInfo = {
    user,
    setUser,
    loading,
    setLoading,
    createUser,
    signInUser,
    signInWithGoogle,
    signInWithFacebook,
    resetPasswordWithEmail,
    handleSetNewPassword,
    logOut,
    isAddPackageBtn,
    setIsAddPackageBtn,
    branch,
    auth,
    setIsEmailVarified,
    isEmailVarified,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
