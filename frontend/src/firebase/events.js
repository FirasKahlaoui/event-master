import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore();

export const getEvents = async () => {
  const eventsCollection = collection(db, "events");
  const eventsSnapshot = await getDocs(eventsCollection);
  const eventsList = eventsSnapshot.docs.map((doc) => doc.data());
  return eventsList;
};
