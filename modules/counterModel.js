const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, default: 0 },
  lastReset: { type: Date, default: new Date() }, 
});

module.exports = mongoose.model("Counter", counterSchema);
