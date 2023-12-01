const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Medication = require('./schemas/medicationSchema');
const Patient = require('./schemas/patientSchema');
const Pharmacist = require('./schemas/pharmacistSchema');
const PatientRecord = require('./schemas/patientRecordSchema');
const User = require('./schemas/userSchema');

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
