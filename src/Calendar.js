import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import './Calendar.css';
import {ReactComponent as ArrowLeft} from './ArrowLeft.svg';
import {ReactComponent as ArrowRight} from './ArrowRight.svg';

function Calendar() {
    const [currentDate, setCurrentDate] = useState(DateTime.local());
    const firstDayOfMonth = currentDate.startOf('month');
    const daysInMonth = currentDate.daysInMonth;

    // State to manage the dropdown visibility and selected month and year
    const [selectedMonth, setSelectedMonth] = useState(currentDate.month);
    const [selectedYear, setSelectedYear] = useState(currentDate.year);
    
    useEffect(() => {
        setCurrentDate(DateTime.local(selectedYear, selectedMonth, 1));
    }, [selectedYear, selectedMonth]);

    const goToPreviousMonth = () => {
        setCurrentDate((prevDate) => prevDate.minus({ months: 1 }));
        setSelectedMonth(currentDate.minus({ months: 1 }).month);
        setSelectedYear(currentDate.minus({ months: 1 }).year);
    };

    const goToNextMonth = () => {
        setCurrentDate((prevDate) => prevDate.plus({ months: 1 }));
        setSelectedMonth(currentDate.plus({ months: 1 }).month);
        setSelectedYear(currentDate.plus({ months: 1 }).year);
    };

    // Simulated event data
    const events = [
    { date: '2023-11-05', title: 'Event 1', time_from: '15:00', time_to: '18:00' },
    { date: '2023-11-15', title: 'Event 2', time_from: '14:30', time_to: '15:00' },
    { date: '2023-11-20', title: 'Event 3', time_from: '14:00', time_to: '16:00' },
    ];

    // Function to filter events for a specific date
    const getEventsForDate = (date) => events.filter((event) => event.date === date.toISODate());

    // Create an array of weekday names
    const weekdayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Create an array of day names for calendar headers
    const dayNames = [];
    for (let i = 1; i < firstDayOfMonth.weekday; i++) {
        dayNames.push('');
    }
    for (let day = 1; day <= daysInMonth; day++) {
        dayNames.push(day);
    }

    return (
    <div className="calendar">
        <div className="calendar-header">
            <div className="calendar-dropdown">
                <select
                    className='unset select'
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}>
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {DateTime.local(2023, i + 1, 1).toFormat('MMMM')}
                            </option>
                        ))}
                </select>
                <input
                    className='unset input'
                    type="number"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}/>
            </div>
            
            <div className="calendar-header-buttons">
                <button onClick={goToPreviousMonth}><ArrowLeft className='btnSvg'/></button>
                <button onClick={goToNextMonth}><ArrowRight className='btnSvg'/></button>
            </div>
        </div>
        
        <div className="calendar-day-names">
            {weekdayNames.map((weekday) => (
                <div key={weekday.id} className="weekday-name">
                    {weekday}
                </div>
            ))}
        </div>
        <div className="calendar-grid">
            {dayNames.map((day) => {
            if (day === '') {
                return (
                <div key={day.id} className="empty-cell"></div>
                );
            }
            const date = firstDayOfMonth.set({ day: day });
            const dayEvents = getEventsForDate(date);

                return (
                <div key={day} className="calendar-day">
                    <div className="day-number">{date.day}</div>
                    <ul className="event-list">
                        {dayEvents.map((event) => (
                            <li key={event.id}>
                                <div className="event-title">{event.title}</div>
                                <div className="event-time">
                                {event.time_from} - {event.time_to}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                );
            })}
        </div>
    </div>
    )
}

export default Calendar;
