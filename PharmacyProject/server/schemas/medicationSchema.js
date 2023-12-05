//Importing neccessary modules
const mongoose = require('mongoose'); // Mongoose for MongoDB interactions


/**
 * Medication Schema Definition for MongoDB using Mongoose.
 * 
 * The schema defines the structure and data types of documents within the Medication collection.
 * Fields include:
 * - name: (String) The name of the medication, marked as required.
 * - description: (String) A brief description of the medication.
 * - price: (Number) The price of the medication.
 * - quantityAvailable: (Number) The available quantity in stock.
 * - reorderThreshold: (Number) The threshold quantity at which reorder is required.
 * - dosage: (String) The dosage information for the medication.
 * - requiresPrescription: (Boolean) Indicator if the medication requires a prescription.
 * - isActive: (Boolean) Status indicating if the medication is currently active/available.
 *
 * An index is created on the 'name' field to improve query performance for searches based on the medication name.
 */

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