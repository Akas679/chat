// models/Message.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db");

// Use 'content' instead of 'text' to match backend code
const Message = sequelize.define("Message", {
  sender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: { // ✅ field name matches server.js and frontend
    type: DataTypes.TEXT,
    allowNull: false,
  },
  room: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Message;
