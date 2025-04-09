import mongoose from 'mongoose';

const targetEntrySchema = new mongoose.Schema({
    targetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Target', required: true },
    user: { type: String, required: true }, // EMAIL OF USER
    imageUrl: { type: String }, // Uploaded ImageURL
    score: { type: Number }, // Score of uploaded ImageURL
});

const TargetEntry = mongoose.model('TargetEntry', targetEntrySchema);

export default TargetEntry;