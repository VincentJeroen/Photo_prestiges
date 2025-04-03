import mongoose from 'mongoose'
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    isOwner: {type: Boolean},
    uid: {type: String},
    email: {type: String, unique: true, required: true},
    hash: {type: String, required: true},
    salt: {type: String, required: true}
});

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.salt = crypto.randomBytes(16).toString('hex');
        this.hash = crypto.pbkdf2Sync(this.password, this.salt, 1000, 64, 'sha512').toString('hex');
        this.password = undefined;
    }
    next();
});

const User = mongoose.model('User', userSchema);
export default User;