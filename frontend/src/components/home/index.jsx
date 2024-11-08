import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import EventList from './EventList'; 
import { getEvents } from '../../../firebase/events'; 
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [events, setEvents] = useState([]);
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch events when the component is mounted
        const fetchEvents = async () => {
            try {
                const eventData = await getEvents();
                setEvents(eventData);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
        fetchEvents();
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to logout", error);
        }
    };

    return (
        <div>
            <Navbar />
            <main className="home-main">
                <div className='text-2xl font-bold pt-14'>
                    Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}, you are now logged in.
                    <button onClick={handleLogout} className='ml-4 p-2 bg-red-500 text-white rounded'>Logout</button>
                </div>
                <EventList events={events} />
            </main>
        </div>
    );
};

export default HomePage;