import './Calendar.css';

function EventDetails({ event }) {
    return (
        <div className="event-details">
            <div className="event-author">Author: {event.author}</div>
            <div className="event-username">Username: {event.username}</div>
        </div>
    );
}

export default EventDetails;
