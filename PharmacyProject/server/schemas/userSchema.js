//Importing neccessary modules
const mongoose = require('mongoose'); // Mongoose for MongoDB interactions


/**
 * User Schema for MongoDB using Mongoose.
 * 
 * Defines the structure for user documents, including:
 * - username: Unique string identifier for the user.
 * - hashedPassword: String for the hashed password.
 * - userType: String specifying the type of user, restricted to 'Admin', 'Pharmacist', or 'Patient'.
 *
 * An index is created on 'username' to facilitate efficient user lookups.
 */

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    userType: { type: String, enum: ['Admin', 'Pharmacist', 'Patient'], required: true },
});

userSchema.index({ username: 1 });
const User = mongoose.model('User', userSchema);
module.exports = User;