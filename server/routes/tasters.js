const express = require('express');
const router = express.Router();

const { 
    getRooms,
    createRoom,
    getRoomId,
    delAllRooms
 } = require('../db/roomConnections.js');

const { 
    addNewRating, 
    getFinalScores,
    getAllRatingsByParticipant
 } = require('../db/ratingConnections.js');

const { 
    addParticipant,
    getParticipant,
    getParticipantById,
    updateParticipantStatus,
    startTasting,
    delAllParticipants,
    getParticipantRoom,
    getParticipantRoomName,
 } = require('../db/participantConnections.js');

// Test route
router.post('/test', (req, res) => {
    console.log('Test route hit!');
    res.status(200).send({ message: 'Test successful' });
});

// Participants routes
router.get('/participants', getParticipant); // GET all participants
router.post('/participants', addParticipant); // POST to participants
router.delete('/participants', delAllParticipants); // DEL all participants
router.get('/participants/room/:roomId/name', getParticipantRoomName); // GET participant room name
router.get('/participants/room/:roomId', getParticipantRoom); // GET participants by room
router.get('/participants/:userId', getParticipantById); // GET participant by id
router.put('/participants/:userId', updateParticipantStatus); // UPDATE participant status by id

// Rooms routes
router.get('/rooms', getRooms); // GET all rooms
router.post('/rooms', createRoom); // POST to room
router.get('/rooms/:roomId', getRoomId); // GET room by id
router.delete('/rooms', delAllRooms); // DEL all rooms

// Ratings routes
router.get('/ratings/:userId', getAllRatingsByParticipant)
router.post('/:roomId', addNewRating); // POST to ratings
router.get('/:roomId', getFinalScores); // GET all ratings by room

// router.get('/', getAllRatings); // GET all ratings

// Room-specific action
router.post('/room/:roomId/start-tasting', startTasting); // START TASTING

module.exports = router;
