import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useAuth } from "../../contexts/authContext";
import Navbar from "../navbar";
import "./EventsDetails.css";

const EventsDetails = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [event, setEvent] = useState(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [eventLikes, setEventLikes] = useState(0);
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [joinedUsersCount, setJoinedUsersCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventDoc = await getDoc(doc(db, "events", id));
        if (eventDoc.exists()) {
          const eventData = eventDoc.data();
          setEvent({
            ...eventData,
            likedBy: eventData.likedBy || [],
            comments:
              eventData.comments?.map((comment) => ({
                ...comment,
                likedBy: comment.likedBy || [],
              })) || [],
          });
          setComments(
            eventData.comments?.map((comment) => ({
              ...comment,
              likedBy: comment.likedBy || [],
            })) || []
          );
          setEventLikes(eventData.likes || 0);
          setUserHasLiked(
            eventData.likedBy?.includes(currentUser.uid) || false
          );
          setJoinedUsersCount(eventData.joinedUsers?.length || 0);
        } else {
          console.error("Event not found");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    const checkIfJoined = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const joinedEvents = userDoc.data().joinedEvents || [];
          setIsJoined(joinedEvents.includes(id));
        }
      } catch (error) {
        console.error("Error checking if joined:", error);
      }
    };

    fetchEvent();
    checkIfJoined();
  }, [id, currentUser.uid]);

  const handleJoinEvent = async () => {
    setIsJoining(true);
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, { joinedEvents: arrayUnion(id) }, { merge: true });
      const eventRef = doc(db, "events", id);
      await updateDoc(eventRef, { joinedUsers: arrayUnion(currentUser.uid) });

      // Add user to the joined collection for the event
      const joinedRef = doc(db, "events", id, "joined", currentUser.uid);
      await setDoc(joinedRef, {
        userId: currentUser.uid,
        email: currentUser.email,
      });

      setIsJoined(true);
      setJoinedUsersCount(joinedUsersCount + 1);
    } catch (error) {
      console.error("Error joining event:", error);
    } finally {
      setIsJoining(false);
    }
  };
  const handleAddComment = async () => {
    if (newComment.trim() === "") return;
    const comment = {
      id: Date.now(),
      text: newComment,
      userId: currentUser.uid,
      likes: 0,
      likedBy: [],
    };
    try {
      const eventRef = doc(db, "events", id);
      await updateDoc(eventRef, { comments: arrayUnion(comment) });
      setComments([...comments, comment]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const updatedComments = comments.filter(
      (comment) => comment.id !== commentId
    );
    try {
      const eventRef = doc(db, "events", id);
      await updateDoc(eventRef, { comments: updatedComments });
      setComments(updatedComments);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleLikeComment = async (commentId) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        const hasLiked = comment.likedBy.includes(currentUser.uid);
        const updatedLikes = hasLiked ? comment.likes - 1 : comment.likes + 1;
        const updatedLikedBy = hasLiked
          ? comment.likedBy.filter((uid) => uid !== currentUser.uid)
          : [...comment.likedBy, currentUser.uid];
        return { ...comment, likes: updatedLikes, likedBy: updatedLikedBy };
      }
      return comment;
    });
    try {
      const eventRef = doc(db, "events", id);
      await updateDoc(eventRef, { comments: updatedComments });
      setComments(updatedComments);
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleLikeEvent = async () => {
    try {
      const eventRef = doc(db, "events", id);
      if (userHasLiked) {
        await updateDoc(eventRef, {
          likes: eventLikes - 1,
          likedBy: arrayRemove(currentUser.uid),
        });
        setEventLikes(eventLikes - 1);
        setUserHasLiked(false);
      } else {
        await updateDoc(eventRef, {
          likes: eventLikes + 1,
          likedBy: arrayUnion(currentUser.uid),
        });
        setEventLikes(eventLikes + 1);
        setUserHasLiked(true);
      }
    } catch (error) {
      console.error("Error liking event:", error);
    }
  };

  const handleShareEvent = () => {
    const eventLink = window.location.href;
    navigator.clipboard.writeText(eventLink).then(() => {
      alert("Event link copied to clipboard!");
    });
  };

  if (!event) {
    return <p>Loading event details...</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="edetails-event-details-page">
        <div className="edetails-event-details-left">
          <h2>{event.title}</h2>
          <img src={event.image} alt={event.title} className="edetails-event-image" />
          <p>{event.description}</p>
          <p>Date: {new Date(event.date).toLocaleDateString()}</p>
          <p>Location: {event.location}</p>
          <div className="edetails-event-topics">
            {event.topics.map((topic, index) => (
              <span key={index} className="edetails-event-topic">
                {topic}
              </span>
            ))}
          </div>
          <p>Joined Users: {joinedUsersCount}</p>
        </div>
        <div className="edetails-event-details-right">
          <button onClick={handleJoinEvent} disabled={isJoining || isJoined}>
            {isJoining ? "Joining..." : isJoined ? "Joined" : "Join Event"}
          </button>
          <button onClick={handleLikeEvent}>
            {userHasLiked ? "Unlike Event" : "Like Event"} ({eventLikes})
          </button>
          <button onClick={handleShareEvent}>Share Event</button>
          {isJoined && (
            <button onClick={() => navigate("/my-events")}>
              View My Events
            </button>
          )}
          <div className="edetails-comments-section">
            <h3>Comments ({comments.length})</h3>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment"
            />
            <button onClick={handleAddComment}>Add Comment</button>
            <ul>
              {comments.map((comment) => (
                <li key={comment.id}>
                  <p>{comment.text}</p>
                  <button onClick={() => handleLikeComment(comment.id)}>
                    {comment.likedBy.includes(currentUser.uid)
                      ? "Unlike"
                      : "Like"}{" "}
                    ({comment.likes})
                  </button>
                  {comment.userId === currentUser.uid && (
                    <button onClick={() => handleDeleteComment(comment.id)}>
                      Delete
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsDetails;