import mongoose from 'mongoose';

const targetSchema = new mongoose.Schema({
    owner: { type: String, required: true },
    imageUrl: { type: String },
    longitude: { type: Number },
    latitude: { type: Number },
    start: { type: Date },
    duration: { type: Number },
    description: { type: String },
    upVotes: { type: Number, default: 0 },
    downVotes: { type: Number, default: 0 },
    canRegister: { type: Boolean, default: false },
});

const Target = mongoose.model('Target', targetSchema);

export default Target;