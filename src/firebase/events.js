import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export const getEvents = async () => {
  const eventsCollection = collection(db, "events");
  const eventsSnapshot = await getDocs(eventsCollection);
  const eventsList = eventsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return eventsList;
};
