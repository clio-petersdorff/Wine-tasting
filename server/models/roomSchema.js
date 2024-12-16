// models/Room.js
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  hostName: String,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Participant' }],
  status: {
    type: String,
    enum: ['waiting', 'in-progress', 'finished'], 
    default: 'waiting'
    },
  currentWineNumber: { 
    type: Number, 
    default: 1 
  },  
  createdAt: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('Room', roomSchema);