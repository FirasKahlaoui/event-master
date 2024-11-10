const { db } = require("./admin");

const events = [
  {
    title: "Bowling Tournament",
    shortDescription: "Join our exciting bowling tournament!",
    description:
      "Get ready to compete in an intense bowling tournament at La Marsa. This event is open for all skill levels, offering an exciting opportunity to test your bowling skills, make new friends, and enjoy a fun atmosphere. Prizes await the top performers!",
    date: "2024-11-30",
    location: "La Marsa, Tunisia",
    image: "/assets/images/bowling.avif",
  },
  {
    title: "Live Concert Night",
    shortDescription: "An unforgettable night of live music!",
    description:
      "Experience an amazing evening with live performances by popular artists at Gammarth. Enjoy a diverse lineup of music genres, from jazz to pop, and indulge in the vibrant energy of the crowd. Don't miss out on this musical extravaganza!",
    date: "2024-12-15",
    location: "Gammarth, Tunisia",
    image: "/assets/images/concert.webp",
  },
  {
    title: "Billiards Championship",
    shortDescription: "Test your skills at the billiards championship!",
    description:
      "Join us at Lac 2 for a thrilling billiards championship. Whether you're a pro or just love the game, this competition will offer a chance to showcase your skills, meet fellow enthusiasts, and compete for the championship title!",
    date: "2024-12-20",
    location: "Lac 2, Tunisia",
    image: "/assets/images/billiards.webp",
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
