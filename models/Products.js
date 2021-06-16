const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: String,
  category: Array,
  price: Number,
  photoPath:  String,
  type: String,
  width: String,
  height: String,
  shape: String,
  edge: String,
  hardening: String,
  facet: String,
  cutouts: String,
  holes: String,
  draw: String
})

module.exports = mongoose.model("Products", schema)