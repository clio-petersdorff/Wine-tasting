require('dotenv').config({ path: './.env' });

const Room = require('../models/roomSchema')

const mongoose = require('mongoose')

// connect to pusher
const Pusher = require("pusher");

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: "eu",
    useTLS: true
  });


// GET all rooms

const getRooms = async(req,res)=>{
  try{
    const rooms = await Room.find()
    res.status(200).json(rooms) 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }    
}

// POST to room collection
const createRoom = async (req, res) => {
    try {
        const tempHostId = new mongoose.Types.ObjectId();  // Generate a temporary host ID
        const room = new Room({ hostId: tempHostId, participants: [tempHostId] });
        
        await room.save();
        res.status(201).json({ roomId: room._id, tempHostId });  // Return roomId and tempHostId to the frontend        
    } catch (error) {
        res.status(500).json({ error: error.message });
      }    
  }; 

// GET room id
const getRoomId = async (req, res) => {
    try {
        const room = await Room.findById(req.params.roomId)
        if (room) res.status(200).json(room);
      else res.status(404).json({ error: 'Room not found' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }    
}

// DEL all rooms
const delAllRooms = async (req, res) => {
  try {
      await Room.deleteMany({})
      res.status(200).send({message: "All games deleted"})
  } catch(e){
      res.status(500).send({error: e.message})
  }
}

module.exports = {
    getRooms,
    createRoom,
    getRoomId,
    delAllRooms,
}