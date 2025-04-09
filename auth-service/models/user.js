import mongoose from 'mongoose';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    uid: { type: String},
    email: { type: String, unique: true, required: true },
    hash: { type: String, required: true },
    salt: { type: String, required: true }
});

userSchema.virtual('password')
    .set(function(password) {
        this._password = password; // Optional: store in memory
        this.salt = crypto.randomBytes(16).toString('hex');
        this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    })
    .get(function() {
        return this._password;
    });

const User = mongoose.model('User', userSchema);
export default User;