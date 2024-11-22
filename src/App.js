import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";
import Register from "./components/auth/register";
import Login from "./components/auth/login";
import Home from "./components/home";
import EventsDetails from "./components/eventsdetails";
import SelectTopics from "./components/selecttopics";
import MyEvents from "./components/myevents";
import CreateEvent from "./components/createevent";
import Explore from "./components/explore";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/event/:id" element={<EventsDetails />} />
          <Route path="/select-topics" element={<SelectTopics />} />
          <Route path="/my-events" element={<MyEvents />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
