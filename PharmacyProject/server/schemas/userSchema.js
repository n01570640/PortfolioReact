//Importing neccessary modules
const mongoose = require('mongoose'); // Mongoose for MongoDB interactions


//User schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    userType: { type: String, enum: ['Admin', 'Pharmacist', 'Patient'], required: true },
});


const User = mongoose.model('User', userSchema);
module.exports = User;