const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  id: Number,
  products: Array,
  date: Date,
  userEmail: String,
  userPhone: String
})

module.exports = mongoose.model("Orders", schema)