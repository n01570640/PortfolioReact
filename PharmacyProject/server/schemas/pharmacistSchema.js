const mongoose = require('mongoose');

/**
 * Pharmacist Schema for MongoDB using Mongoose.
 * 
 * Structuring pharmacist documents, including:
 * - pharmacistId: ObjectId reference to User.
 * - licenseNumber: String for the pharmacist's unique license number.
 * - isActive: Boolean indicating the active status of the pharmacist.
 *
 * An index is established on 'pharmacistId' to enhance query efficiency.
 */

const pharmacistSchema = new mongoose.Schema({
    pharmacistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    licenseNumber: { type: String, required: true, unique: true },
    isActive: Boolean
  });
  
  pharmacistSchema.index({ pharmacistId: 1 });
  
  const Pharmacist = mongoose.model('Pharmacist', pharmacistSchema);
  module.exports = mongoose.model('Pharmacist', pharmacistSchema);