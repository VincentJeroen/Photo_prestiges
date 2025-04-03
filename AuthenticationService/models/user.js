import mongoose, { Schema } from 'mongoose'

const userSchema = new mongoose.Schema({
    name: { type: String, required: true }
},
{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

const User = mongoose.model("User", userSchema);

export default User;