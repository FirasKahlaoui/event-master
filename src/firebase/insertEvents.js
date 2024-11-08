// firebase/insertEvents.js
const { db } = require("./admin");

const events = [
  {
    title: "Event 1",
    description: "Description for Event 1",
    date: "2023-10-01",
    location: "Location 1",
  },
  {
    title: "Event 2",
    description: "Description for Event 2",
    date: "2023-10-02",
    location: "Location 2",
  },
  {
    title: "Event 3",
    description: "Description for Event 3",
    date: "2023-10-03",
    location: "Location 3",
  },
];

const insertEvents = async () => {
  const batch = db.batch();
  events.forEach((event) => {
    const eventRef = db.collection("events").doc();
    batch.set(eventRef, event);
  });

  try {
    await batch.commit();
    console.log("Events inserted successfully");
  } catch (error) {
    console.error("Error inserting events:", error);
  }
};

insertEvents();
