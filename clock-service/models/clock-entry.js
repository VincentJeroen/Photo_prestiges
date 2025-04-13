import mongoose from 'mongoose';

const clockEntrySchema = new mongoose.Schema({
    duration: { type: Number, required: true },
});

const ClockEntry = mongoose.model('ClockEntry', clockEntrySchema);
export default ClockEntry;