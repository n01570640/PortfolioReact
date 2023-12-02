const express = require('express');
const router = express.Router();
const Pharmacist = require('../schemas/pharmacistSchema');
const Medication = require('../schemas/medicationSchema');
const authenticateToken = require('./authMiddleware');


router.post('/pharmacists', authenticateToken, async (req, res) => {
  const { pharmacistData, actionType } = req.body; // 'actionType' could be 'add' or 'edit'

  try {
    let pharmacist;
    if (actionType === 'add') {
      pharmacist = new Pharmacist(pharmacistData);
      await pharmacist.save();
    } else if (actionType === 'edit') {
      pharmacist = await Pharmacist.findByIdAndUpdate(pharmacistData._id, pharmacistData, { new: true });
    }

    res.status(200).json(pharmacist);
  } catch (error) {
    res.status(500).json({ message: 'Error processing request', error });
  }
});

  
  // Endpoint to manage medications
  router.post('/medications', authenticateToken, async (req, res) => {
    const { medicationData, actionType } = req.body;
    console.log(req.body);
    try {
      let medication;
      if (actionType === 'add') {
        medication = new Medication(medicationData);
        await medication.save();
      } else if (actionType === 'edit') {
        console.log(medication);
        medication = await Medication.findByIdAndUpdate(medicationData._id, medicationData, { new: true });
      }
  
      res.status(200).json(medication);
    } catch (error) {
      res.status(500).json({ message: 'Error processing request', error });
    }
  });

  module.exports = router;