const mongoose = require('mongoose');

const patientRecordSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  pharmacistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacist' },
  prescriptionDetails: [{
    medication: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication' },
    quantity: Number,
    dosage: String,
    refillCount: Number
  }],
  prescriptionDate: Date,
  lastRefillDate: Date
});

  
  patientRecordSchema.index({ patientId: 1, pharmacistId: 1 });
  
  const PatientRecord = mongoose.model('PatientRecord', patientRecordSchema);
  