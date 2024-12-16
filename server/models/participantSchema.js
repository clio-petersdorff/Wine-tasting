const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    avatarId: {
        type: Number,
        required: true
    },
    roomId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: ['choosing avatar','waiting', 'tasting', 'finished'], 
        default: 'choosing avatar'
    }
});

const Participant = mongoose.model('Participant', participantSchema);

module.exports = Participant;

