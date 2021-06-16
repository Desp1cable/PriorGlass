const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  category: Array,
  price: { type: Number, required: true },
  photoPath:  String,
  type: String,
  width: String,
  height: String,
  shape: String,
  Edge: String,
  Hardening: String,
  facet: String,
  cutouts: String,
  Holes: String,
  Draw: String
})

module.exports = mongoose.model("Products", schema)