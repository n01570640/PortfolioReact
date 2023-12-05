//Importing neccessary modules
const mongoose = require('mongoose'); // Mongoose for MongoDB interactions


/**
 * Patient Schema for MongoDB using Mongoose.
 * 
 * Defines the structure for patient documents, comprising:
 * - patientId: ObjectId reference to User.
 * - groupId: String representing the patient's group ID.
 * - insName: String for the name of the patient's insurance.
 * - dateOfBirth: Date of birth of the patient.
 * - firstName: Patient's first name.
 * - lastName: Patient's last name.
 * - telephoneNumber: Patient's contact number.
 *
 * An index is created on 'patientId' for improved search performance.
 */

const patientSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    groupId: String,
    insName: String,
    dateOfBirth: Date,
    firstName: String,
    lastName: String,
    telephoneNumber: String
  });
  
  patientSchema.index({ patientId: 1 });
  
  module.exports = mongoose.model('Patient', patientSchema);