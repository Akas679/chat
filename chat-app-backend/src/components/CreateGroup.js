// CreateGroup.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const navigate = useNavigate();

  const handleCreate = (e) => {
    e.preventDefault();
    if (groupName.trim()) {
      navigate(`/group/${groupName}`);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #6e8efb, #a777e3)"
    }}>
      <div style={{
        background: "#fff",
        padding: "40px 32px",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        width: "350px",
        textAlign: "center"
      }}>
        <h2 style={{ marginBottom: 24, color: "#6e8efb" }}>Create a Group Chat</h2>
        <form onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
            style={{
              padding: "12px",
              width: "100%",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginBottom: "18px",
              fontSize: "16px"
            }}
          />
          <button
            type="submit"
            style={{
              padding: "12px 0",
              width: "100%",
              borderRadius: "8px",
              border: "none",
              background: "linear-gradient(90deg, #6e8efb, #a777e3)",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
          >
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateGroup;