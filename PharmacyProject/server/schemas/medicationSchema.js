//Importing neccessary modules
const mongoose = require('mongoose'); // Mongoose for MongoDB interactions


//Patient schema
const medicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: Number,
    quantityAvailable: Number,
    reorderThreshold: Number,
    dosage: String,
    requiresPrescription: Boolean
});
medicationSchema.index({ name: 1 }); // Index on name

const Medication = mongoose.model('Medication', medicationSchema);
module.exports = Medication;