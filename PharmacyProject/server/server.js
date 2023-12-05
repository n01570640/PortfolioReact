//Importing neccessary modules
const express = require('express');
const mongoose = require('mongoose'); // Mongoose for MongoDB interactions
const bcrypt = require('bcryptjs'); // bcryptjs for password hashing
const passport = require('passport'); // Passport for user authentication
const LocalStrategy = require('passport-local').Strategy; // Local strategy for passport
const session = require('express-session'); // Session middleware for Express
const cors = require('cors');
const jwt = require('jsonwebtoken');

//Constants
const PORT = 3001;
const Medication = require('./schemas/medicationSchema');
const Notification = require('./schemas/notificationSchema');
const Patient = require('./schemas/patientSchema');
const PatientRecord = require('./schemas/patientRecordSchema');
const Pharmacist = require('./schemas/pharmacistSchema');
const RefillRequest = require('./schemas/refillRequestSchema');
const User = require('./schemas/userSchema');
const insertMockData = require('./loadMockData');
const authenticateToken = require('./server_subcomponents/authMiddleware');
const adminRoutes = require('./server_subcomponents/serverAdmin');

//creating an express application
const app = express();
// Enable All CORS Requests
app.use(cors({
    origin: "http://localhost:3000"
}));
app.use(express.json());

/** Express session middleware configuration
Sessions are used to keep users logged in between HTTP requests.*/
app.use(session({
    secret: 'secret', 
    resave: false, 
    saveUninitialized: false 
  }));
  
// Initializing Passport for user authentication and integrating it with Express sessions
app.use(passport.initialize());
app.use(passport.session());
// Use the admin routes
app.use('/admin', adminRoutes);


//Estabilishing a connection to Mongodb
mongoose.connect('mongodb://127.0.0.1:27017/pharmacy',{
  useNewUrlParser: true,
  useUnifiedTopology: true  
  }).then(async () => {
  {
    console.log('MongoDB Connected');
  await insertMockData();
};
  })
  .catch(err => console.log(err));


// Passport Local Strategy configuration for authentication
// This strategy uses a username and password for authentication
passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        // Attempt to find the user by their username
        const user = await User.findOne({ username });
        if (!user) {
          return done(null, false); // If user not found, return false
        }
  
        // If user is found, compare the provided password with the hashed password in database
        if (await bcrypt.compare(password, user.hashedPassword)) {
            
          return done(null, user); // If password matches, authenticate the user
        } else {
          return done(null, false); // If password doesn't match, return false
        }
      } catch (err) {
        done(err); // Handle errors
      }
    }
  ));

  // Serialize user to decide which data of the user object should be stored in the session
// Here, we are storing only the user id in the session
passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  
  // Deserialize user to retrieve the user data from the session using the user id
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user); // The user object is attached to the request object as req.user
    });
  });


//Registeration endpoint for new Patients
app.post('/register' , async (req, res) => {
    try{
        const { username, password, userType } = req.body;
        // const userType = ""
        console.log(req.body);
        //Check if the user already exists
        const userExists = await User.findOne({ username });
        if(userExists) {
            return res.status(400).send('User already exists');
        }

        //Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //Create a new user
        const user = new User({
            username,
            hashedPassword,
            userType
        });

        await user.save();
        res.status(201).send('Patient is registered successfully');
    } catch (error) {
        res.status(500).send('Error registering new Patient');
        console.log(error);
    }
});


//Login endpoint for new Patients
app.post('/login', async(req, res, next) => {
    //passport.authenticate middleware handles user fetching and validation
    passport.authenticate('local', { session: false }, async (err, user, info) => {
        const { username, password } = req.body;
        console.log(user);
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).send({ error: "Invalid username or password" });
        }
        var userType = user.userType;
        console.log(`${username}, ${password}, ${userType}`);
        // Create a JWT token
        const token = jwt.sign({ userId: user._id, userType: user.userType  }, '3cV7y6UzqR8w0xG4pJ2lL5oN1aM8fI3j', { expiresIn: '1h' });
        res.send({ token });
    })(req, res, next);
});


// Endpoint to Upsert Patient Info 
app.post('/api/upsertPatientInfo', authenticateToken, async (req, res) => {
  try {
    const { groupId, insName, dateOfBirth, firstName, lastName, telephoneNumber } = req.body;
    
    // Upsert operation
    const updatedPatient = await Patient.findOneAndUpdate(
      { patientId: req.userId },
      { 
        groupId, 
        insName, 
        dateOfBirth, 
        firstName, 
        lastName, 
        telephoneNumber 
      },
      { 
        new: true, // return the updated document
        upsert: true // create a new document if one doesn't exist
      }
    );

    res.status(200).json(updatedPatient);
  } catch (error) {
    console.error("Server Error: ", error);
    res.status(500).send("Server error updating patient info");
  }
});

//Endpoint to get single patient data
app.get('/api/patientinfo', authenticateToken, async (req, res) => {
  try {
      const patientInfo = await Patient.findOne({ patientId: req.userId });

      res.json(patientInfo);
  } catch (error) {
      res.status(500).send("Server Error fetching patient info");
      console.log(error);
  }
});

//Endpoint to get patients data
app.get('/api/patients',authenticateToken, async (req, res) => {
  try{
    const patients = await Patient.find({});
    res.json(patients);
    // console.log("Patients fetched:", patients);
  }catch (error) {
    res.status(500).send("Server Error fetching patients data");
    console.log(error);
  }
});

// Endpoint to add a new patient
app.post('/api/addPatient', authenticateToken, async (req, res) => {
  try {
    // Extract patient and user data from the request body
    console.log("weeeeee" + req.body);
    const { username, firstName, lastName, dateOfBirth, groupId, insName, telephoneNumber } = req.body;
   
    // Check if the user already exists
    const userExists = await User.findOne({ username: username });
    if (userExists) {
      return res.status(400).send('User already exists');
    }

    // Hash the predefined password 'onetwothree'
    const hashedPassword = await bcrypt.hash('onetwothree', 10);

    // Create a new user
    const newUser = new User({
      username: username,
      hashedPassword: hashedPassword,
      userType: 'Patient'
    });

    // Save the user to the User collection
    const savedUser = await newUser.save();

    // Create a new patient instance
    const newPatient = new Patient({
      patientId: savedUser._id,
      firstName,
      lastName,
      dateOfBirth,
      groupId,
      insName,
      telephoneNumber
    });

    // Save the new patient to the database
    await newPatient.save();

    res.status(201).json({ message: "New patient added successfully", patient: newPatient });
  } catch (error) {
    console.error("Error adding new patient: ", error);
    res.status(500).send("Error adding new patient");
  }
});

//Endpoint tp get medications data
app.get('/api/medications',authenticateToken, async (req, res) => {
  try{
    const medications = await Medication.find({});
    res.json(medications);
  } catch(error) {
    res.status(500).send("Server Error fetching medications data")
  }
});
//Endpoint to get Patient information
app.get('/api/patient/:patientId', authenticateToken, async (req, res) => {
  try{
    console.log(req.params); // Log the parameters
    const patientId = req.params.patientId; //saving the patient id from params
    console.log(patientId);
    const patientInformation = await Patient.find({ patientId: patientId});
    if (!patientInformation ) {
      return res.status(404).send('Patient not found');
    }
    console.log(patientInformation);
    res.json(patientInformation);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error fetching patient information")
  }
});
//Endpoint to get Patient's medication profile
app.get('/api/medicationProfile/:patientId', authenticateToken, async (req,res) => {
  try{
    const patientId = req.params.patientId; //saving the patient id from params
    const medicationProfile = await PatientRecord.find({ patientId: patientId});
    //console.log(medicationProfile);
    res.json(medicationProfile);
  } catch (error) {
    //console.log(error);
    res.status(500).send("Server Error fetching medication profile")
  }
});

//Endpoint to get medication information by id
app.get('/api/medication/:medicationId', authenticateToken, async (req, res) =>{
  try{
    const medicationId = req.params.medicationId; //saving medication id from params
    //console.log(medicationId);
    const medication = await Medication.findOne({ _id : medicationId });
    //console.log(medication);
    if(!medication){
      return res.status(404).send('Medication not found');
    }
    res.json(medication);
  } catch(error){
    res.status(500).send('Server Error fetching medication data')
  }
});

//Endpoint to search a medication by name
app.get('/api/medications/search', async (req, res) => {
 try{
  const searchQuery = req.query.q//get the query parameter
  const medications = await Medication.find({
    name: {$regex: searchQuery, $options: 'i' } //Search for med. with name that includes query
  });

  res.setHeader('Content-Type', 'application/json');
  res.json(medications);
 } catch (error){
  res.status(500).send("Server error fetching medication list");
 }
});

//Endpoint when a refill request is made
app.post('/api/refillMedication/patientId', authenticateToken, async (req, res) => {
  const { medicationId, patientId, refillQuantity } = req.body;
  console.log('Request body: ', req.body);
  const numericRefillQuantity = Number(refillQuantity);


  
  try {
    const medication = await Medication.findOne({ _id: medicationId });
    const patientProfile = await PatientRecord.find({ patientId: patientId });
    if (!medication || patientProfile.length === 0) {
      return res.status(404).send("Medication or Patient not found");
  }
    console.log(`Medication ID from request: ${medicationId}`);

    let prescriptionDetailFound = false;
        for (let patientRecord of patientProfile) {
            let prescriptionDetail = patientRecord.prescriptionDetails.find(detail => 
                detail.medication.toString() === medicationId
            );

            if (prescriptionDetail) {
                if (medication.quantityAvailable < numericRefillQuantity) {
                    return res.status(404).send('Not enough medication in stock for refill');
                }

                medication.quantityAvailable -= numericRefillQuantity;
                prescriptionDetail.refillCount -= 1;
                patientRecord.markModified('prescriptionDetails');
                await medication.save();
                await patientRecord.save();

                prescriptionDetailFound = true;
                break; // Break the loop as we found and updated the needed detail
            }
        }
        if (!prescriptionDetailFound) {
          return res.status(404).send('Medication not found in patient\'s prescription');
      }

    //writing to refillRequest collection
    const refillRequest = new RefillRequest({
      patientId: patientId,
      medicationId: medicationId,
      fillQuantity: numericRefillQuantity,
      requestDate: new Date(),
      status: 'Filling',
    });

    refillRequest.save()
      .then(doc => {
        console.log("Refill request saved: ", doc);
      })
      .catch(error => {
        console.error('Error saving refill request: ', err);
      })
    res.status(200).json({
        updatedMedication: medication,
        updatedPatientProfile: patientProfile
    });
} catch (error) {
    console.error("Error in refilling prescription: ", error);
    res.status(500).send("Error in refilling prescription");
}
});


//Endpoint to add a new patient record
app.post('/api/patient/:patientId/medication-records', authenticateToken, async (req, res) => {
  try {
    const { patientId } = req.params;
    const { prescriptionDetails, pharmacistId } = req.body;
    
    // Create a new PatientRecord instance
    const patientRecord = new PatientRecord({
      patientId,
      pharmacistId,
      prescriptionDetails,
      prescriptionDate: new Date(), // Assuming prescription date is set to current date
      lastRefillDate: new Date()   // Assuming last refill date is also set to current date
    });

    // Save the patient record to the database
    const savedRecord = await patientRecord.save();
    res.status(201).json(savedRecord);
  } catch (error) {
    console.error("Error adding new patient medication record: ", error);
    res.status(500).send("Internal Server Error");
  }
});

//Endpoint to get refillRequests 
app.get('/api/refillRequestOrders', authenticateToken,  async (req, res) => {
  try {
   // Fetch refill requests
    const refillRequests = await RefillRequest.find({})
     .populate({
      path: 'medicationId',
      populate: { path: '_id', select: 'name dosage' }
  })
     .exec();
    // For each refill request, fetch the corresponding patient information
    const populatedRequests = await Promise.all(refillRequests.map(async (request) => {
      const patient = await Patient.findOne({ patientId: request.patientId }).exec();
      return {
        ...request.toObject(),
        patientDetails: patient ? {
          firstName: patient.firstName,
          lastName: patient.lastName,
          dateOfBirth: patient.dateOfBirth
        } : null
      };
    } ));

    res.json(populatedRequests);
  } catch (error) {
    console.error("Server Error: ", error);
    res.status(500).send("Server error fetching refill requests");
  }
});

//Endpoint to update refill request status to Ready - for pick up
app.patch('/api/refillRequestOrders/:requestId', authenticateToken, async (req, res) => {
  try {
      const { requestId } = req.params;
      const { newStatus, fillQuantity } = req.body;
      const numFillQuantity = Number(fillQuantity)
      console.log("BAckLog: " ,requestId, newStatus, numFillQuantity );

      // Find the refill request
      const refillRequest = await RefillRequest.findById(requestId).populate('medicationId');

      if (!refillRequest) {
          return res.status(404).send('Refill Request not found');
      }

      // Check if there's enough medication in stock
      if (refillRequest.medicationId.quantityAvailable < numFillQuantity) {
          return res.status(400).send('Not enough medication in stock');
      }

      // Update medication stock
      const updatedMedication = await Medication.findByIdAndUpdate(
          refillRequest.medicationId._id,
          { $inc: { quantityAvailable: -numFillQuantity } },
          { new: true }//performs the update
      );

      // Update refill request status
      const updatedRequest = await RefillRequest.findByIdAndUpdate(
          requestId,
          { status: newStatus },
          { new: true }
      );

      res.status(200).json({ updatedRequest, updatedMedication });
  } catch (error) {
      console.error("Server Error: ", error);
      res.status(500).send("Server error updating refill request");
  }
});

// Endpoint to get refill requests for a specific patient
app.get('/api/refillRequestOrders/:patientId', authenticateToken, async (req, res) => {
  try {
    const { patientId } = req.params;
    const objectId = new mongoose.Types.ObjectId(patientId);

    const refillRequests = await RefillRequest.find({ patientId: objectId })
      .populate('medicationId', 'name dosage')
      .populate('patientId', 'firstName lastName dateOfBirth');

    res.json(refillRequests);
  } catch (error) {
    console.error("Server Error: ", error);
    res.status(500).send("Server error fetching refill requests for patient");
  }
});

//Set the server to listen on port 3000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});