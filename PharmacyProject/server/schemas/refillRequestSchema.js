const mongoose = require('mongoose');

const refillRequestSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    medicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication' },
    requestDate: Date,
    status: { type: String, enum: ['Submitted', 'Filling', 'Ready for Pickup'] },
    pharmacistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacist' }
  });
  
  refillRequestSchema.index({ patientId: 1, status: 1 });
  
  const RefillRequest = mongoose.model('RefillRequest', refillRequestSchema);
  