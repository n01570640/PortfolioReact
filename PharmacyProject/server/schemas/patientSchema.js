//Importing neccessary modules
const mongoose = require('mongoose'); // Mongoose for MongoDB interactions


//Patient schema
const patientSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    groupId: String,
    insName: String,
    dateOfBirth: Date,
    firstName: String,
    lastName: String,
    telephoneNumber: String
});


const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;