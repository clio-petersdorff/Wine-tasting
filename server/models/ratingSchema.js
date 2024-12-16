const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    wineNumber: {
        type: Number,
        required: true,
        default:1
    },
    roomId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Participant',
        required: true
    },    
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    notes: String,
});

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
