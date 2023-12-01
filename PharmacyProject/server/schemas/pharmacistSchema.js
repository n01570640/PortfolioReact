const mongoose = require('mongoose');

const pharmacistSchema = new mongoose.Schema({
    pharmacistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    licenseNumber: { type: String, required: true, unique: true }
  });
  
  pharmacistSchema.index({ pharmacistId: 1 });
  
  const Pharmacist = mongoose.model('Pharmacist', pharmacistSchema);