import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import API from "../api";
import MessageList from "./MessageList";
import OnlineUsers from "./OnlineUsers";
import MessageInput from "./MessageInput";

const socket = io("http://localhost:5000");

export default function ChatWindow({ username }) {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [receiver, setReceiver] = useState("");

  // Load old messages from Postgres
  useEffect(() => {
    API.get("/messages").then((res) => setMessages(res.data));
  }, []);

  // Connect user
  useEffect(() => {
    socket.emit("register", username);

    socket.on("privateMessage", ({ sender, message }) => {
      setMessages((prev) => [...prev, { sender, text: message }]);
    });

    socket.on("groupMessage", ({ sender, message }) => {
      setMessages((prev) => [...prev, { sender, text: message }]);
    });

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users.filter((u) => u !== username));
    });

    return () => socket.off();
  }, [username]);

  const sendMessage = (text) => {
    if (!text.trim()) return;

    if (receiver) {
      socket.emit("privateMessage", { sender: username, receiver, message: text });
    } else {
      socket.emit("groupMessage", { sender: username, message: text });
    }
    setMessages((prev) => [...prev, { sender: username, text }]);
  };

  return (
    <div>
      <h2>Logged in as {username}</h2>
      <OnlineUsers users={onlineUsers} setReceiver={setReceiver} />
      <MessageList messages={messages} currentUser={username} />
      <MessageInput onSend={sendMessage} />
    </div>
  );
}
