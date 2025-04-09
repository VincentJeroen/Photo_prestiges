import mongoose from 'mongoose';

const targetSchema = new mongoose.Schema({
    owner: { type: String, required: true },
    imageUrl: { type: String, required: true },
    longitude: { type: Number },
    latitude: { type: Number },
    start: { type: Date },
    end: { type: Date },
    description: { type: String },
    upVotes: { type: Number, default: 0 },
    downVotes: { type: Number, default: 0 },
});

const Target = mongoose.model('Target', targetSchema);

export default Target;