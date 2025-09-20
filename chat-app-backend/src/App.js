// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import io from "socket.io-client";
import API from "./api";
import CreateGroup from "./components/CreateGroup";
import GroupChat from "./components/GroupChat";

const socket = io("https://chat-2-2tsj.onrender.com");  // ✅ correct


function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [sender, setSender] = useState("User1"); // ✅ fixed - now we use setSender
  const [room] = useState("general");

  // Load old messages from backend (Postgres)
  useEffect(() => {
    API.get("/messages")
      .then((res) => setMessages(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Listen for new messages via socket.io
  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  // Send message
  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit("sendMessage", { sender, content: message, room });
    setMessage("");
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateGroup />} />
        <Route path="/group/:groupName" element={<GroupChat socket={socket} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const [sender, setSender] = useState("User1"); // ✅ fixed - now we use setSender
//   const [room] = useState("general");

//   // Load old messages from backend (Postgres)
//   useEffect(() => {
//     API.get("/messages")
//       .then((res) => setMessages(res.data))
//       .catch((err) => console.error(err));
//   }, []);

//   // Listen for new messages via socket.io
//   useEffect(() => {
//     socket.on("receiveMessage", (data) => {
//       setMessages((prev) => [...prev, data]);
//     });

//     return () => {
//       socket.off("receiveMessage");
//     };
//   }, []);

//   // Send message
//   const sendMessage = () => {
//     if (!message.trim()) return;
//     socket.emit("sendMessage", { sender, content: message, room });
//     setMessage("");
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h1>💬 Chat App</h1>

//       {/* ✅ sender input (fixes unused setSender warning) */}
//       <input
//         type="text"
//         value={sender}
//         onChange={(e) => setSender(e.target.value)}
//         placeholder="Enter your name"
//         style={{ padding: 10, marginBottom: 10, display: "block", width: "300px" }}
//       />

//       <div
//         style={{
//           border: "1px solid gray",
//           padding: 10,
//           height: 300,
//           overflowY: "scroll",
//           marginBottom: 10,
//         }}
//       >
//         {messages.map((msg, idx) => (
//           <div key={idx}>
//             <b>{msg.sender}:</b> {msg.content}
//           </div>
//         ))}
//       </div>

//       <input
//         type="text"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         placeholder="Type a message..."
//         style={{ padding: 10, width: "300px" }}
//       />
//       <button
//         onClick={sendMessage}
//         style={{ padding: 10, marginLeft: 5 }}
//       >
//         Send
//       </button>
//     </div>
//   );
// }

// export default App;
