import mongoose from 'mongoose';

const targetSchema = new mongoose.Schema({
    owner: { type: String, required: true },
    imageUrl: { type: String },
    longitude: { type: Number },
    latitude: { type: Number },
    start: { type: Date },
    duration: { type: Number },
    description: { type: String },
    canRegister: { type: Boolean, default: false },
});

const Target = mongoose.model('Target', targetSchema);

export default Target;