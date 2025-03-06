import axios from "axios";
import { useContext, useMemo } from "react";
import { AuthContext } from "./../providers/AuthProvider";

const UseAxiosSecure = () => {
  const { user } = useContext(AuthContext) || {};
  const role = user?.role === "admin" ? "1" : "0"; 

  if (role === "0") {
    const axiosSecure = useMemo(
      () =>
        axios.create({
          baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/`,
        }),
      []
    );
    return axiosSecure;
  }


  const axiosSecure = useMemo(() => {
    const instance = axios.create({
      baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
    });

    instance.interceptors.request.use(
      (config) => {
        const url = new URL(config.url, config.baseURL);
        config.method = config.method?.toLowerCase();


        if (config.method !== "get") {
          return {
            ...config,
            baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/`,
          };
        }

 
        if (config.method === "get") {
          url.searchParams.set("db", role);
        }

        config.url = `/api/` + url.pathname + url.search; 
        return config;
      },
      (error) => Promise.reject(error)
    );

    return instance;
  }, [role]);

  return axiosSecure;
};

export default UseAxiosSecure;
