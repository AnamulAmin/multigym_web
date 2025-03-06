import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import Photo1 from "../../assets/background.jpg";
import Login from './Subsystems/Login';
import ForgetPassword from './Subsystems/ForgetPassword';
import Registration from './Subsystems/Registration';

const Login_Registration = () => {
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [isRegistration, setIsRegistration] = useState(false);
  const [isForget, setIsForget] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);




  const handleBackToLogin = () => {
    setIsLogin(true);
    setIsForget(false);
    setIsRegistration(false);
  };

  const handleBackToRegistation = () => {
    setIsLogin(false);
    setIsForget(false);
    setIsRegistration(true);
  };

  const handleBackToForget = () => {
    setIsLogin(false);
    setIsForget(true);
    setIsRegistration(false);
  };

  const animationVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${Photo1})`,
      }}
    >
      {loading ? (
        <LoadingSpinner isLoading={loading} />
      ) : (
        <div className="w-full max-w-md">
          {isLogin && (
            <motion.div
              key="login"
              className="w-full" 
              initial="initial"
              animate="animate"
              exit="exit"
              variants={animationVariants}
              transition={{ duration: 0.5 }}
            >
              <Login
                onCreateAccountClick={handleBackToRegistation}
                onForgotPasswordClick={handleBackToForget}
              />
            </motion.div>
          )}
          {isForget && (
            <motion.div
              key="forget"
              className="w-full"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={animationVariants}
              transition={{ duration: 0.5 }}
            >
              <ForgetPassword onBackToLogin={handleBackToLogin} />
            </motion.div>
          )}
          {isRegistration && (
            <motion.div
              key="registration"
              className="w-full"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={animationVariants}
              transition={{ duration: 0.5 }}
            >
              <Registration handleBackToLogin={handleBackToLogin} />
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default Login_Registration;
