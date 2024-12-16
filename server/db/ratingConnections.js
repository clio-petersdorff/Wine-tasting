require('dotenv').config({ path: './.env' });

const Rating = require('../models/ratingSchema')
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


// POST new rating
const addNewRating = async (req, res) => {
    const {roomId} = req.params
    const {userId, rating, notes} = req.body

    try {
        // Check if the participant exists
        const participant = await Participant.findOne({ _id: userId });
        if (!participant) {
            return res.status(404).send({ error: "Participant not found." });
        }

        // Get the current wine number from the room
        const room = await Room.findById(participant.roomId);
        if (!room) {
            return res.status(404).send({ error: "Room not found." });
        }
        const currentWineNumber = room.currentWineNumber;  
    
        // Store the rating and mark as "done" for this wine number
        await Rating.updateOne(
            { roomId, userId , wineNumber: currentWineNumber},          // filter
            { rating, notes },           // update
            { upsert: true }             // options
        );

        // Check if all users have rated this wine (similar to before)
        const totalUsers = await Participant.countDocuments({roomId}); // Total number of participants in this room
        const ratingsCount = await Rating.countDocuments({ roomId,  wineNumber: currentWineNumber });

        if (ratingsCount === totalUsers) {
            // All users have rated this wine, move to next wine
            const nextWineNumber = currentWineNumber + 1;

            // Update the current wine number in the room document
            await Room.findByIdAndUpdate(roomId, {
                $set: { currentWineNumber: nextWineNumber }
            });

            // Notify clients to move to the next wine
            pusher.trigger(`room-${roomId}`, "all-rated", {
                nextWineNumber
            });
        }

        res.status(200).json({ message: "Rating submitted successfully." });

    } catch(e){
        res.status(500).send({error: e.message})
    }
}

// const getAllRatings = async (req, res) => {
//     try {
//         const response = await Rating.find()
//         res.status(200).json(response)

//     } catch (error) {
//         res.status(500).json({ message: 'Error retrieving ratings', error });
//     }
// }

// GET final scores
const getFinalScores = async (req, res) => {
    const {roomId} = req.params

    try {
        // test
        const results = await Rating.find({ roomId });
        res.status(200).json(results);

        // Add trasformations to get average rating per wine
        // const result = await Rating.aggregate([
        //     { $match: { roomId: roomId } }, // Filter by roomId (optional)
        //     { 
        //         $group: {
        //             _id: "$wineNumber",
        //             averageScore: { $avg: "$rating" }, // Calculate average score
        //         }
        //     },
        //     { $sort: { _id: 1 } } // Sort by wineNumber (optional)
        // ]);
        // res.status(200).json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error retrieving ratings', error });
    }

}


// GET all ratings by ROOM ID
const getAllRatingsByParticipant = async (req, res) => {
    console.log('getting scores in backend')
    const {userId} = req.params

    try {
        const response = await Rating.find({userId})
        res.status(200).json(response)

    } catch (error) {
        res.status(500).json({ message: 'Error retrieving ratings for participant', error });
    }

}

module.exports = {
    addNewRating, 
    getFinalScores,
    getAllRatingsByParticipant
}
