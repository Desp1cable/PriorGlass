const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  products: Array,
  date: Date,
  userEmail: String,
  userPhone: String
})

module.exports = mongoose.model("Orders", schema)