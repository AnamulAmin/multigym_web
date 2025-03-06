import React, { useContext, useEffect, useState } from "react";
import UseAxiosSecure from "../../../../../Hook/UseAxioSecure";
import moment from "moment";
import { AuthContext } from "../../../../../providers/AuthProvider";

const UpcomingBirthdays = () => {
  const [birthdays, setBirthdays] = useState([]);
  const axiosSecure = UseAxiosSecure();
  const {branch} = useContext(AuthContext);
  const getColor = (daysUntilBirthday) => {
    if (daysUntilBirthday <= 7) {
      return "text-red-500"; // Very soon
    } else if (daysUntilBirthday <= 14) {
      return "text-yellow-500"; // Soon
    } else {
      return "text-green-500"; // Later
    }
  };

  const getRemainingDays = (date) => {
    const today = moment().startOf('day');
    const birthDate = moment(date).year(today.year()).startOf('day');

    // Move birthday to next year if it has already passed this year
    if (birthDate.isBefore(today)) {
      birthDate.add(1, 'year');
    }

    const diffInDays = birthDate.diff(today, 'days');
    
    // Return both the label and numeric value for color logic
    return {
      days: diffInDays,
      label: diffInDays === 0 ? "Today" : diffInDays === 1 ? "Tomorrow" : `In ${diffInDays} days`
    };
  };

  const getRemainingYears = (date) => moment().diff(moment(date), "years");

  useEffect(() => {
    const fetchData = async () => {
      const res = await axiosSecure.get(`/users/upcoming-birthday?branch=${branch}`);
      setBirthdays(res.data);
    };

    fetchData();
  }, [axiosSecure]);

  return (
    <section style={{ scrollbarWidth: "thin" }} className="w-full px-4 border-t max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      {birthdays?.length > 0 &&
        birthdays.map((person, index) => {
          const { days, label } = getRemainingDays(person.date_of_birth);
          return (
            <div
              key={index}
              className={`py-2 flex justify-between items-center ${
                index !== birthdays.length - 1 ? "border-b" : ""
              }`}
            >
              <div className="text-sm">
                <p className="font-medium">{person.full_name}</p>
                <p className="text-gray-500">Birthday: {person.date_of_birth}</p>
              </div>
              <div className="text-right">
                <p className={getColor(days)}>
                  {label}
                </p>
                <p className="font-semibold text-gray-800">
                  {getRemainingYears(person.date_of_birth)} years
                </p>
              </div>
            </div>
          );
        })}
    </section>
  );
};

export default UpcomingBirthdays;
