const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  userEmail: {type: String, required: true},
  messages: Array,
  isFinished: {type: Boolean, required: true}
})

module.exports = mongoose.model("Chats", schema)