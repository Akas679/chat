import React from "react";

export default function OnlineUsers({ users, setReceiver }) {
  return (
    <div>
      <label>Select user for 1-to-1 chat:</label>
      <select onChange={(e) => setReceiver(e.target.value)}>
        <option value="">Group Chat</option>
        {users.map((u, i) => (
          <option key={i} value={u}>
            {u}
          </option>
        ))}
      </select>
    </div>
  );
}
