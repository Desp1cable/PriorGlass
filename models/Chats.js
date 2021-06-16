const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  message: Array,
  isUser: { type: Boolean, required: true }
})

module.exports = mongoose.model("Chats", schema)