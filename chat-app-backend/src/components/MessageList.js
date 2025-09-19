import React from "react";

export default function MessageList({ messages, currentUser }) {
  return (
    <div style={{ border: "1px solid #ccc", height: "300px", overflowY: "scroll", margin: "10px 0", padding: "10px" }}>
      {messages.map((msg, i) => (
        <div key={i} style={{ textAlign: msg.sender === currentUser ? "right" : "left" }}>
          <b>{msg.sender}:</b> {msg.text}
        </div>
      ))}
    </div>
  );
}
