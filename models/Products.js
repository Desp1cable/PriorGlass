const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {type: String, required: true},
  category: Array,
  price: {type: Number, required: true},
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