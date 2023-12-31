const express = require('express');
const router = express.Router();
const Pharmacist = require('../schemas/pharmacistSchema');
const Medication = require('../schemas/medicationSchema');
const User = require('../schemas/userSchema'); 

const authenticateToken = require('./authMiddleware');

/**
 * Endpoint to fetch all pharmacists from the database.
 * It uses the Pharmacist model to query and return all pharmacist records.
 * The function includes error handling to catch and respond to any issues during the fetch operation.
 *
 * @param {object} req - Express.js request object.
 * @param {object} res - Express.js response object, used to send back the fetched pharmacists or error message.
 */
router.get('/pharmacists', authenticateToken, async (req, res) => {
  try {
    const pharmacists = await Pharmacist.find({});
    res.json(pharmacists);
  } catch (error) {
    res.status(500).send("Error fetching pharmacists");
  }
});


/**
 * Endpoint to add a new pharmacist or edit an existing pharmacist's details.
 * Based on the 'actionType' in the request body, it either creates a new Pharmacist record or updates an existing one.
 * It handles errors and returns the created or updated pharmacist data.
 *
 * @param {object} req - Express.js request object containing pharmacist data and action type.
 * @param {object} res - Express.js response object for sending back the response.
 */
router.post('/pharmacists', authenticateToken, async (req, res) => {
  const { pharmacistData, actionType } = req.body; // 'actionType' could be 'add' or 'edit'

  try {
    let pharmacist;
    if (actionType === 'add') {
      const user = new User({
        username: pharmacistData.username, // Assuming username is passed in pharmacistData
        hashedPassword: 'onetwothree', // Hardcoded password
        userType: 'Pharmacist'
      });
      await user.save();

      // Create a Pharmacist with the newly created user's ID
      pharmacist = new Pharmacist({ ...pharmacistData, pharmacistId: user._id });
      await pharmacist.save();
    } else if (actionType === 'edit') {
      // Update the Pharmacist record
      const updatedPharmacist = await Pharmacist.findByIdAndUpdate(pharmacistData._id, pharmacistData, { new: true });

      // Update the corresponding User record
      await User.findByIdAndUpdate(updatedPharmacist.pharmacistId, { username: pharmacistData.username });

      res.status(200).json(updatedPharmacist);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error processing request', error });
  }
});

  
 /**
 * Endpoint to manage medication records, either adding or editing them.
 * The action ('add' or 'edit') is determined by the 'actionType' parameter in the request body.
 * If 'add', a new Medication record is created and saved. If 'edit', an existing record is updated.
 * Responses include the saved medication data or error messages.
 *
 * @param {object} req - Express.js request object containing medication data and action type.
 * @param {object} res - Express.js response object for sending back the response or error message.
 */
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