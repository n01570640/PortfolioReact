const mongoose = require('mongoose');

/**
 * Patient Record Schema for MongoDB using Mongoose.
 * 
 * Structure for patient record documents, including:
 * - patientId: ObjectId reference to Patient.
 * - pharmacistId: ObjectId reference to Pharmacist.
 * - prescriptionDetails: Array of prescription details including medication, quantity, dosage, refill count, and direction.
 * - prescriptionDate: Date when the prescription was issued.
 * - lastRefillDate: Date of the last medication refill.
 *
 * Indexes are created on 'patientId' and 'pharmacistId' for enhanced query performance.
 */

const patientRecordSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  pharmacistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacist' },
  prescriptionDetails: [{
    medication: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication' },
    quantity: Number,
    dosage: String,
    refillCount: Number,
    direction: String
  }],
  prescriptionDate: Date,
  lastRefillDate: Date
});

  
  patientRecordSchema.index({ patientId: 1, pharmacistId: 1 });
  
  const PatientRecord = mongoose.model('PatientRecord', patientRecordSchema);
  module.exports = PatientRecord;