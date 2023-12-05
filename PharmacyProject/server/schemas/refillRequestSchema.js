const mongoose = require('mongoose');

/**
 * Refill Request Schema for MongoDB using Mongoose.
 * 
 * Schema for refill request documents, containing:
 * - patientId: ObjectId reference to Patient.
 * - medicationId: ObjectId reference to Medication.
 * - fillQuantity: Number indicating the quantity to be refilled.
 * - requestDate: Date when the refill request was made.
 * - status: String status of the request, limited to 'Filling' or 'Ready for Pickup'.
 *
 * Indexes are created on 'patientId' and 'status' for optimal querying.
 */

const refillRequestSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    medicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication' },
    fillQuantity: Number,
    requestDate: Date,
    status: { type: String, enum: [ 'Filling', 'Ready for Pickup'] },
  });
  
  refillRequestSchema.index({ patientId: 1, status: 1 });
  
  const RefillRequest = mongoose.model('RefillRequest', refillRequestSchema);
  module.exports = RefillRequest;