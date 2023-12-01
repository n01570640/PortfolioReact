//Importing neccessary modules
const mongoose = require('mongoose'); // Mongoose for MongoDB interactions


//Medication schema
const medicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: Number,
    quantityAvailable: Number,
    reorderThreshold: Number,
    dosage: String,
    requiresPrescription: Boolean,
    isActive: Boolean
});
medicationSchema.index({ name: 1 }); // Index on name

module.exports = mongoose.model('Medication', medicationSchema);