const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Medication = require('./schemas/medicationSchema');
const Patient = require('./schemas/patientSchema');
const Pharmacist = require('./schemas/pharmacistSchema');
const PatientRecord = require('./schemas/patientRecordSchema');
const User = require('./schemas/userSchema');

/**
 * Inserts mock data into the specified Mongoose model from a given file.
 * This function reads the file, converts specific fields to their appropriate data types
 * (e.g., ObjectId, Date), and then inserts the data into the database if the collection is empty.
 * 
 * @param {Mongoose.Model} Model - The Mongoose model into which data is to be inserted.
 * @param {string} filePath - The path to the JSON file containing mock data.
 * @param {string} logMessage - Message to log upon successful data insertion.
 */

async function insertData(Model, filePath, logMessage) {
    const count = await Model.countDocuments();
    if (count === 0) {
        const mockData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        mockData.forEach(item => {
            // Convert ObjectId fields
            ['_id', 'patientId', 'pharmacistId', 'medication'].forEach(field => {
                if (item[field] && item[field]['$oid']) {
                    item[field] = new ObjectId(item[field]['$oid']);
                }
            });

            // Handle embedded documents (like prescriptionDetails in PatientRecord)
            if (item.prescriptionDetails) {
                item.prescriptionDetails.forEach(detail => {
                    if (detail.medication && detail.medication['$oid']) {
                        detail.medication = new ObjectId(detail.medication['$oid']);
                    }
                });
            }

            // Process date fields
            Object.keys(item).forEach(key => {
                if (item[key] && item[key]['$date']) {
                    item[key] = new Date(item[key]['$date']);
                }
            });
        });
        await Model.insertMany(mockData);
        console.log(logMessage);
    }
}

/**
 * Orchestrates the insertion of mock data into various collections in the database.
 * It calls the `insertData` function for each type of mock data (users, patients, pharmacists, etc.),
 * passing the respective model and file path. If an error occurs during insertion, it logs the error.
 */

async function insertMockData() {
    try {
        await insertData(User, path.join(__dirname, 'mockData', 'mockUsers.json'), 'Mock users inserted');
        await insertData(Patient, path.join(__dirname, 'mockData', 'mockPatients.json'), 'Mock patients inserted');
        await insertData(Pharmacist, path.join(__dirname, 'mockData', 'mockPharmacists.json'), 'Mock pharmacists inserted');
        await insertData(Medication, path.join(__dirname, 'mockData', 'mockMedications.json'), 'Mock medications inserted');
        await insertData(PatientRecord, path.join(__dirname, 'mockData', 'mockPatientRecords.json'), 'Mock patient records inserted');
    } catch (error) {
        console.error("Error inserting mock data: ", error);
    }
}

module.exports = insertMockData;
