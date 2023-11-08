import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import './Calendar.css';
import { ReactComponent as ArrowLeft } from './ArrowLeft.svg';
import { ReactComponent as ArrowRight } from './ArrowRight.svg';
import EventDetails from './EventDetails';

function Calendar() {
    const [currentDate, setCurrentDate] = useState(DateTime.local());
    const firstDayOfMonth = currentDate.startOf('month');
    const daysInMonth = currentDate.daysInMonth;

    // State to manage the dropdown visibility and selected month and year
    const [selectedMonth, setSelectedMonth] = useState(currentDate.month);
    const [selectedYear, setSelectedYear] = useState(currentDate.year);
    const [eventsData, setEventsData] = useState([]);
    const [openEventId, setOpenEventId] = useState(null);

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

    useEffect(() => {
    // GitHub personal access token - disabled once code is uploaded to GitHub
    const accessToken = '';

    // GitHub repository information
    const owner = 'lanasavic';
    const repo = 'b2match-Calendar';

    // GitHub API endpoint to fetch commits
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits`;

    // Make an authenticated GET request to the GitHub API
    fetch(apiUrl, {
            headers: {
                Authorization: `token ${accessToken}`,
            },
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`Failed to fetch data: ${response.status} - ${response.statusText}`);
            }
        })
        .then((commits) => {
            // Process and store commits as events in state
            setEventsData(commits.map((commit) => ({
                id: commit.sha,
                date: DateTime.fromISO(commit.commit.author.date).toISODate(), // Format the date
                time: DateTime.fromISO(commit.commit.author.date).toFormat('HH:mm'), // Format the time
                title: commit.commit.message, // Use commit message as event title
                author: commit.commit.author.name, // Use author's name
                username: commit.author.login, // Use author's name
            })));
        })
        .catch((error) => {
            console.error('Error fetching commits:', error);
        });
    });

    // Function to filter events for a specific date
    const getEventsForDate = (date) => eventsData.filter((event) => event.date === date.toISODate());

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
                    className="unset select"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))} >

                    {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                        {DateTime.local(2023, i + 1, 1).toFormat('MMMM')}
                        </option>
                    ))}
                </select>
                <input
                    className="unset input"
                    type="number"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}/>
            </div>

            <div className="calendar-header-buttons">
                <button onClick={goToPreviousMonth}>
                    <ArrowLeft className="btnSvg" />
                </button>
                <button onClick={goToNextMonth}>
                    <ArrowRight className="btnSvg" />
                </button>
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
                    return <div key={day.id} className="empty-cell"></div>;
                }
                const date = firstDayOfMonth.set({ day: day });
                const dayEvents = getEventsForDate(date);

                // Render the events in the calendar
                return (
                <div key={day} className="calendar-day">
                    <div className="day-number">{date.day}</div>
                    <div className="day-events">
                        <ul className="event-list">
                            {dayEvents
                            .slice() // Create a copy of the array to avoid modifying the original
                            .sort((eventA, eventB) => {
                                // Compare the time of the two events
                                const timeA = eventA.time;
                                const timeB = eventB.time;
                                return timeA.localeCompare(timeB);
                            })
                            .map((event) => (
                                <li key={event.id} onClick={() => {
                                    if (openEventId === event.id) {
                                        // If the clicked event is the currently open one, close it
                                        setOpenEventId(null);
                                    } else {
                                        // If it's a different event, open its details
                                        setOpenEventId(event.id);
                                    }
                                }}>
                                    <div className="event-title">{event.title}</div>
                                    <div className="event-time">{event.time}</div>
                                    {openEventId === event.id && (
                                        <EventDetails
                                            event={eventsData.find((e) => e.id === event.id)}
                                            onClose={() => setOpenEventId(null)} // Close the selected event
                                        />
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                );
            })}
        </div>
    </div>
    );
}

export default Calendar;
