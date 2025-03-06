import React, { useState, useEffect } from 'react';
import "./calender.css"
// Dummy data - replace with your actual data fetching logic
const fetchEvents = () => {
    return [
        { date: '2024-08-01', title: 'Event 1' },
        { date: '2024-08-15', title: 'Event 2' },
        // Add more events
    ];
};

const Calendar = () => {
    const [events, setEvents] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // Current month index (0-11)
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // Current year
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await axiosSecure.get(`/classes/${branch}/get-all`);
            setEvents(response.data);
        } catch (error) {
            console.error('There was an error fetching the classes!', error);
        }
    };
    // useEffect(() => {
    //     const eventsData = fetchEvents();
    //     setEvents(eventsData);
    // }, []);

    // Determine the number of days in the current month
    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

    const daysInMonth = new Array(getDaysInMonth(currentMonth, currentYear)).fill(null).map((_, index) => index + 1);

    // Function to check if there's an event on a specific date
    const hasEvent = (date) => events.some(event => new Date(event.date).getDate() === date);

    // Array of weekdays
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="calendar">
            {/* Weekday Header */}
            <div className="calendar-header grid grid-cols-7 gap-4">
                {weekdays.map((day, index) => (
                    <div key={index} className="weekday-header">{day}</div>
                ))}
            </div>

            {/* Days of the month */}
            <div className="calendar-grid grid grid-cols-7 gap-4 p-4">
                {daysInMonth.map(day => (
                    <DayCard key={day} date={day} hasEvent={hasEvent(day)} />
                ))}
            </div>
        </div>
    );
};

const DayCard = ({ date, hasEvent }) => (
    <div className={`day-card ${hasEvent ? 'event-day' : ''}`}>
        <p>{date}</p>
        {hasEvent && <span className="event-indicator">•</span>}
    </div>
);

export default Calendar;
