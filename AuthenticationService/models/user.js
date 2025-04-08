import mongoose from 'mongoose'
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    isOwner: { type: Boolean},
    uid: { type: String},
    email: { type: String, unique: true, required: true },
    hash: { type: String, required: true },
    salt: { type: String, required: true }
});

// This isnt called due to salt and has not being set in the object???
// userSchema.pre('save', function (next) {
//     if (this.isModified('password')) {
//         this.salt = crypto.randomBytes(16).toString('hex');
//         this.hash = crypto.pbkdf2Sync(this.password, this.salt, 1000, 64, 'sha512').toString('hex');
//         this.password = undefined;
//     }
//     next();
// });

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