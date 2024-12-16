require('dotenv').config({ path: './.env' });

const Participant = require('../models/participantSchema')
const Room = require('../models/roomSchema')

// Connect to DB
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


// POST to participant collection
const addParticipant = async (req, res) => {
    const { name, avatarId, hostId, roomId } = req.body
    console.log(name)

    console.log('Received payload:', { name, avatarId, hostId, roomId });

    try {
        const participant = new Participant({ name, avatarId, roomId });

        try {
            await participant.save();
            console.log('Participant saved:', participant);
        } catch (error) {
            console.error('Error saving participant:', error);
            return res.status(500).json({ error: error.message });
        }

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        console.log('roomId:', roomId);

        // Add the participant to the Room's participants array
        const participantUpdate = await Room.findByIdAndUpdate(
            roomId,
            { $push: { participants: participant._id } },
            { new: true } // Return the updated document
        );
        console.log('Participant added to room:', participantUpdate);


        // If this participant is the host, update hostId and hostName in the Room
        if (hostId) {
            const hostUpdate = await Room.updateOne(
                { _id: roomId },
                { hostName: name }
            );
            console.log('Host name updated:', hostUpdate);
        }

        // Broadcast the update avatar event
        pusher.trigger('avatars', 'avatar-selected', {
            avatarId
        });   
        
        // Call this after a successful avatar selection
        pusher.trigger(`room-${roomId}`, 'participantAdded', {
            id: participant._id,
            name,
            avatarId,
            status: 'choosing avatar',
        });

        // Respond with the participant's unique ID
        res.status(201).json({ participant});

    } catch(e){
        res.status(500).send({error: e.message})
    }
}

//  GET ALL participants
const getParticipant = async (req, res) => {
    try {
        const participants = await Participant.find()
        res.status(200).json(participants) 
    } catch(e){
        res.status(500).send({error: e.message})
    }
}

// GET participant by ID
const getParticipantById = async (req, res) => {
    const { userId } = req.params;

    try {
        const participants = await Participant.findById(userId);
        res.status(200).json(participants); // Return participant that matches the id
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
};

// GET participant by room AND name
const getParticipantRoomName = async (req, res) => {
    const {roomId} = req.params
    const { name } = req.query
    try {
        const participants = await Participant.find({ name , roomId});
        res.status(200).json(participants); // Return participants that match the name
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
}


// GET participants by room
const getParticipantRoom = async (req, res) => {
    const { roomId } = req.params;

    try {
        const participant = await Participant.find({roomId});
        if (!participant) {
            return res.status(404).json({ error: "Participant not found" });
        }

        res.status(200).json(participant); 

    } catch (e) {
        res.status(500).send({ error: e.message });
    }
};

// UPDATE STATUS
const updateParticipantStatus = async (req, res) => {
    const { userId } = req.params; // Extract userId from request parameters
    const { status } = req.body; // Extract status from request body

    try {
        // Update the status of the participant identified by userId
        const updatedParticipant = await Participant.findByIdAndUpdate(
            userId,
            { $set: { status } },
            { new: true } // Return the updated document
        );

        res.status(200).json({ message: `Participant ${userId} updated to ${status}` });

        // Broadcast the status update to the relevant room
        pusher.trigger(`room-${updatedParticipant.roomId}`, 'participantUpdated', {
            id: updatedParticipant._id,
            name: updatedParticipant.name,
            avatarId: updatedParticipant.avatarId,
            status: updatedParticipant.status,
        }); 
        
    } catch (error) {
        console.error('Error updating participant status:', error);
        res.status(500).json({ error: 'Failed to update participant status' });
    }
};

// EVENT to broadcast that TASTING has started
const startTasting = async (req, res) => {
    const { roomId } = req.params;

    try {
        // Update all participants' statuses to 'tasting'
        await Participant.updateMany(
            { roomId },
            { $set: { status: 'tasting' } }
        );

        // Trigger the event to notify all participants to start the tasting
        pusher.trigger(`room-${roomId}`, 'tastingStarted', {
            redirectTo: `/${roomId}/wine-rating`,
        });

        res.status(200).json({ message: 'Tasting has started and participant statuses updated' });
    } catch (error) {
        console.error('Error starting tasting:', error);
        res.status(500).json({ error: 'Failed to start tasting' });
    }
};


// DEL all participants
const delAllParticipants = async (req, res) => {
    try {
        await Participant.deleteMany({})
        res.status(200).send({message: "participants deleted"})
    } catch(e){
        res.status(500).send({error: e.message})
    }
}

module.exports = {
    addParticipant, 
    getParticipant, 
    getParticipantById,
    getParticipantRoomName, 
    updateParticipantStatus, 
    startTasting,
    getParticipantRoom,
    delAllParticipants
}