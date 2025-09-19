// GroupChat.js
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

function GroupChat({ socket }) {
  const { groupName } = useParams();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [sender, setSender] = useState("");
  const [nameSet, setNameSet] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (groupName) {
      socket.emit("joinRoom", groupName);
    }
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.off("receiveMessage");
    };
  }, [groupName, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSetName = (e) => {
    e.preventDefault();
    if (sender.trim()) {
      setNameSet(true);
    }
  };

  const sendMessage = () => {
    if (!content.trim() || !sender.trim()) return;
    socket.emit("sendMessage", {
      sender,
      content,
      room: groupName,
    });
    setContent("");
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #a777e3, #6e8efb)"
    }}>
      <div style={{
        background: "#fff",
        padding: "32px 28px",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        width: "400px",
        minHeight: "500px"
      }}>
        <h2 style={{ color: "#a777e3", marginBottom: 18 }}>Group: {groupName}</h2>
        {!nameSet ? (
          <form onSubmit={handleSetName} style={{ marginBottom: 24 }}>
            <input
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="Enter your name"
              style={{
                padding: "12px",
                width: "100%",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginBottom: "18px",
                fontSize: "16px"
              }}
              required
            />
            <button
              type="submit"
              style={{
                padding: "12px 0",
                width: "100%",
                borderRadius: "8px",
                border: "none",
                background: "linear-gradient(90deg, #a777e3, #6e8efb)",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "16px",
                cursor: "pointer"
              }}
            >
              Join Chat
            </button>
          </form>
        ) : (
          <>
            <div style={{
              border: "1px solid #eee",
              borderRadius: "8px",
              height: "260px",
              overflowY: "auto",
              marginBottom: "18px",
              background: "#f7f7fa",
              padding: "12px"
            }}>
              {messages.length === 0 && (
                <div style={{ color: "#aaa", textAlign: "center", marginTop: "100px" }}>
                  No messages yet. Start the conversation!
                </div>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} style={{
                  marginBottom: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: msg.sender === sender ? "flex-end" : "flex-start"
                }}>
                  <span style={{
                    background: msg.sender === sender
                      ? "linear-gradient(90deg, #6e8efb, #a777e3)"
                      : "#e0e0e0",
                    color: msg.sender === sender ? "#fff" : "#333",
                    padding: "8px 14px",
                    borderRadius: "16px",
                    maxWidth: "70%",
                    wordBreak: "break-word",
                    fontSize: "15px"
                  }}>
                    <b>{msg.sender}:</b> {msg.content}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type a message"
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "16px"
                }}
                onKeyDown={e => { if (e.key === "Enter") sendMessage(); }}
              />
              <button
                onClick={sendMessage}
                style={{
                  padding: "12px 18px",
                  borderRadius: "8px",
                  border: "none",
                  background: "linear-gradient(90deg, #a777e3, #6e8efb)",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "16px",
                  cursor: "pointer"
                }}
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default GroupChat;