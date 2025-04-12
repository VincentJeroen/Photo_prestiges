import mongoose from 'mongoose';

const targetEntrySchema = new mongoose.Schema({
    targetId: { type: String, required: true },
    user: { type: String, required: true }, // EMAIL OF USER
    imageUrl: { type: String }, // Uploaded ImageURL
    score: { type: Number }, // Score of uploaded ImageURL
    rating: { type: Number, default: 0 }, // upvote(+1)/none(0)/downvote(-1)
});

const TargetEntry = mongoose.model('TargetEntry', targetEntrySchema);

export default TargetEntry;