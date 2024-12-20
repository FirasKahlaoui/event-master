import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar";
import EventList from "../eventlist";
import { getEvents } from "../../firebase/events";
import { useAuth } from "../../contexts/authContext";
import { Link } from "react-router-dom";
import { db } from "../../firebase/firebase";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./HomePage.css";

const HomePage = () => {
  const { currentUser, userLoggedIn } = useAuth();
  const [events, setEvents] = useState([]);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventData = await getEvents();
        setEvents(eventData);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (currentUser) {
      const fetchUserTopics = async () => {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userTopics = userDoc.data().topics || [];
            const recommended = events.filter((event) =>
              event.topics.some((topic) => userTopics.includes(topic))
            );
            setRecommendedEvents(recommended.slice(0, 4)); // Show only 4 recommended events
          }
        } catch (error) {
          console.error("Error fetching user topics:", error);
        }
      };

      fetchUserTopics();
    }
  }, [currentUser, events]);

  const fetchCreatedEvents = useCallback(() => {
    const createdEventsQuery = query(
      collection(db, "events"),
      where("creatorId", "==", currentUser.uid)
    );
    const unsubscribeCreatedEvents = onSnapshot(
      createdEventsQuery,
      (snapshot) => {
        const createdEventsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Created Events:", createdEventsList);
        setCreatedEvents(createdEventsList);
      }
    );

    return unsubscribeCreatedEvents;
  }, [currentUser]);

  const fetchJoinedEvents = useCallback(() => {
    const userDocRef = doc(db, "users", currentUser.uid);
    const unsubscribeUserDoc = onSnapshot(userDocRef, (userDoc) => {
      if (userDoc.exists()) {
        const joinedEventIds = userDoc.data().joinedEvents || [];
        if (joinedEventIds.length > 0) {
          const joinedEventsQuery = query(
            collection(db, "events"),
            where("__name__", "in", joinedEventIds)
          );
          const unsubscribeJoinedEvents = onSnapshot(
            joinedEventsQuery,
            (snapshot) => {
              const joinedEventsList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              console.log("Joined Events:", joinedEventsList);
              setJoinedEvents(joinedEventsList);
            }
          );

          return unsubscribeJoinedEvents;
        }
      }
    });

    return unsubscribeUserDoc;
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      const unsubscribeCreatedEvents = fetchCreatedEvents();
      const unsubscribeJoinedEvents = fetchJoinedEvents();

      return () => {
        unsubscribeCreatedEvents();
        unsubscribeJoinedEvents();
      };
    }
  }, [currentUser, fetchCreatedEvents, fetchJoinedEvents]);

  const displayedEvents = events.slice(0, 2);

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const joinedEventDates = joinedEvents.map((event) =>
        new Date(event.date).toDateString()
      );
      const createdEventDates = createdEvents.map((event) =>
        new Date(event.date).toDateString()
      );

      if (joinedEventDates.includes(date.toDateString())) {
        return "react-calendar__tile--highlight-joined";
      }
      if (createdEventDates.includes(date.toDateString())) {
        return "react-calendar__tile--highlight-created";
      }
    }
    return null;
  };

  return (
    <div>
      <Navbar />
      <main className="home-main">
        <div className="left-section">
          <h1>Welcome to EventMaster</h1>
          <p>
            EventMaster brings all the best events directly to you. Discover
            upcoming gatherings, activities, and experiences tailored just for
            you! Dive in to explore detailed event information, personalized
            recommendations, and exciting possibilities.{" "}
            {userLoggedIn
              ? ""
              : "Please log in to access more events and features!"}
          </p>
          {!userLoggedIn && (
            <Link to="/login" className="login-link">
              Log in to explore more events
            </Link>
          )}
        </div>
        <div className="right-section">
          <EventList events={displayedEvents} />
        </div>
      </main>
      {userLoggedIn && recommendedEvents.length > 0 && (
        <div className="recommended-events">
          <h2>Recommended Events</h2>
          <div className="explore-event-list">
            {recommendedEvents.map((event) => (
              <div className="explore-event-item" key={event.id}>
                <img
                  src={event.image || "/assets/default-event.jpg"}
                  alt={event.title}
                  className="explore-event-thumbnail"
                />
                <div className="explore-event-details">
                  <h3>{event.title}</h3>
                  <p>{event.shortDescription}</p>
                  <p className="explore-event-date">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => navigate(`/event/${event.id}`)}
                    className="explore-event-link"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {userLoggedIn && (
        <div className="calendar-section">
          <h2>Your Event Calendar</h2>
          <Calendar
            onChange={setCalendarDate}
            value={calendarDate}
            tileClassName={tileClassName}
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;
