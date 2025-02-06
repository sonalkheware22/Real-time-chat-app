import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { database, auth } from "../firebaseConfig";
import { ref, onValue, push, update } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import dayjs from "dayjs";
import "./stylessheet/Chat.css";

const socket = io("http://localhost:5000"); // Ensure your server runs on port 5000

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [user, setUser] = useState(null);

  const typingTimeoutRef = useRef(null); // Use useRef to store the timeout ID

  // Socket listeners
  useEffect(() => {
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    socket.on("userTyping", (username) => {
      setTypingUser(username);
    });

    socket.on("stopTyping", () => {
      setTypingUser(null);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("userTyping");
      socket.off("stopTyping");
    };
  }, []);

  // Firebase listener for messages
  useEffect(() => {
    const messagesRef = ref(database, "messages");
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setMessages(Object.values(data));
    });
  }, []);

  // Firebase authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        socket.emit("join", currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  // Send message
  const sendMessage = () => {
    if (message.trim() !== "" && user) {
      const username = user.displayName || user.email.split("@")[0];
      const newMessage = {
        userId: user.uid,
        username: username,
        text: message,
        timestamp: Date.now(),
        readBy: [], // Initialize as empty array
      };

      socket.emit("sendMessage", newMessage);
      push(ref(database, "messages"), newMessage);
      setMessage("");
    }
  };

  // Handle typing event
  const handleTyping = () => {
    if (user) {
      socket.emit("typing", user.displayName || user.email.split("@")[0]);

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set a new timeout
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stopTyping");
      }, 2000); // Stops typing after 2 seconds of no activity
    }
  };

  // Mark messages as read
  useEffect(() => {
    if (user && messages.length > 0) {
      const unreadMessages = messages.filter(
        (msg) => Array.isArray(msg.readBy) && !msg.readBy.includes(user.uid)
      );
      unreadMessages.forEach((msg) => {
        const messageRef = ref(database, `messages/${msg.id}`);
        update(messageRef, { readBy: [...msg.readBy, user.uid] }).catch(
          (error) => console.error("Error updating read receipt:", error)
        );

        // Emit the 'readReceipt' event to the server
        socket.emit("readReceipt", { messageId: msg.id, userId: user.uid });
      });
    }
  }, [messages, user]);

  // Render ticks based on message status
  const renderTick = (message) => {
    if (message.readBy.includes(user?.uid)) {
      return <span style={{ color: "blue" }}> ✓</span>;
    }
    return null; // No ticks for unread message
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        <h1 className="chat-title">Chat Room</h1>
        {typingUser && (
          <p className="typing-notification">{typingUser} is typing...</p>
        )}
        <div className="message-container">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`message ${
                msg.userId === user?.uid ? "sent" : "received"
              }`}
            >
              <p className="message-text">
                {msg.username}: {msg.text}
                <br />
                <span className="message-time">
                  {dayjs(msg.timestamp).format("HH:mm")} {/* Display time */}
                </span>
                {msg?.readBy?.includes(user?.uid) && (
                  <span className="read-receipt">✓</span>
                )}
              </p>
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleTyping}
            className="message-input"
          />
          <button onClick={sendMessage} className="send-button">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
