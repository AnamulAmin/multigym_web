import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FiArrowRightCircle } from "react-icons/fi";
import doorImage from "../../../../../assets/door.png";
import user from "../../../../../assets/user.png";
import UseAxiosSecure from "../../../../../Hook/UseAxioSecure";
import { socket } from "../../../../../socket";
import { AuthContext } from "../../../../../providers/AuthProvider";

const Door_log = () => {
  const {branch} = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = UseAxiosSecure();
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [socketData, setSocketData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosSecure.get(`/device-logs/${branch}/latest`);
        console.log("response", response);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching the data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [branch, axiosSecure]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      console.log("socket connected");

      socket.on("visitor-data", (visitorData) => {
        console.log(visitorData, "socketData");
        setSocketData(visitorData);
      });
    }

    socket.on("connect", onConnect);

    let timeout = setTimeout(() => {
      socket.disconnect(true);
    }, 300000);

    socket.on("activity", () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        socket.disconnect(true);
      }, 300000);
    });

    socket.on("disconnect", () => {
      clearTimeout(timeout);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("visitor-data");
      socket.off("activity");
      socket.off("disconnect");
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (socketData) {
      setData((prevData) => {
        console.log("prevData", [...prevData, socketData]);
        const sortData = [...prevData, socketData].sort((a, b) => {
          const dataA = new Date(a.punchTime);
          const dataB = new Date(b.punchTime);

          return dataB - dataA;
        });
        return sortData;
      });
    }
  }, [socketData]);
  console.log("isConnected", isConnected, data, socketData);

  const isValidImage = (url) => {
    return url && url.trim() !== "" && /\.(jpg|jpeg|png|gif)$/.test(url);
  };

  return (
    <section style={{ scrollbarWidth: "thin" }} className="w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent border-t px-4 h-full ">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <span className="loading loading-spinner loading-lg"></span>{" "}
          {/* Custom loading spinner */}
        </div>
      ) : (
        data.map((item, index) => (
          <div
            key={index}
            className={`py-3 flex justify-between items-center ${
              index !== data.length - 1 ? "border-b" : ""
            }`}
          >
            <div className="text-xs md:text-sm">
              {item.deviceLogType === 3 ? (
                <>
                  <div className="flex items-center gap-2">
                    <FiArrowRightCircle className="text-blue-500" size={24} />
                    <p className="font-bold">Push-Out Front Door</p>
                  </div>
                  <p className="font-semibold">
                    {new Date(item.punchTime).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    at {new Date(item.punchTime).toLocaleTimeString("en-US")}
                  </p>
                </>
              ) : (
                <>
                  <div className="flex gap-2">
                    <p className="font-medium ">
                      {item.memberName || "Unknown"}
                    </p>
                    <p>
                      (ID: {item.deviceLogId} ({item.memberID || "N/A"}))
                    </p>
                  </div>
                  <p>
                    <span
                      className={`${
                        item.deviceLogType === 1
                          ? "text-green-500"
                          : "text-red-500"
                      } font-medium`}
                    >
                      {item.deviceLogType === 1 ? "Punched-in" : "Punched-out"}
                    </span>
                    <span> </span>
                    Door
                  </p>
                  <div className="flex gap-2">
                    <p>Card: {item.cardNumber || "N/A"}</p>
                    <p>
                      on
                      <span className="font-semibold">
                        {" "}
                        {new Date(item.punchTime).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                  <p className="font-semibold">
                    {new Date(item.punchTime).toLocaleTimeString()}
                  </p>
                </>
              )}
            </div>
            <div>
              <img
                src={
                  item.deviceLogType === 3
                    ? doorImage
                    : isValidImage(item.memberPic)
                    ? item.memberPic
                    : user
                }
                className="md:w-20 md:h-20 w-16 h-16 rounded-full"
                alt={`${
                  item.deviceLogType === 3
                    ? "Door Image"
                    : item.memberName || "Unknown"
                }`}
              />
            </div>
          </div>
        ))
      )}
      
    </section>
  );
};

export default Door_log;
