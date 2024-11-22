import { db } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export const getEvents = async () => {
  const eventsCollection = collection(db, "events");
  const eventsSnapshot = await getDocs(eventsCollection);
  const eventsList = eventsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return eventsList;
};

export const getEventsByDate = async (date) => {
  const eventsCollection = collection(db, "events");
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  const eventsQuery = query(
    eventsCollection,
    where("date", ">=", startOfDay),
    where("date", "<=", endOfDay)
  );

  const eventsSnapshot = await getDocs(eventsQuery);
  const eventsList = eventsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return eventsList;
};
