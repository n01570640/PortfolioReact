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
}).then(() => console.log('MongoDB Connected'))
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

//Endpoint tp get medications data
app.get('/api/medications',authenticateToken, async (req, res) => {
  try{
    const medications = await Medication.find({});
    res.json(medications);
    // console.log("Medications fetched:", medications)
  } catch(error) {
    res.status(500).send("Server Error fetching medications data")
  }
});

//Endpoint to get Patient's medication profile
app.get('/api/medicationProfile/:patientId', authenticateToken, async (req,res) => {
  try{
    const patientId = req.params.patientId; //saving the patient id from params
    //console.log(patientId);
    const medicationProfile = await PatientRecord.find({ patientId: patientId});
    //console.log(medicationProfile);
    res.json(medicationProfile);
  } catch (error) {
    //console.log(error);
    res.status(500).send("Server Error fetching medication profile")
  }
});

//Endpoint to get medication information
app.get('/api/medication/:medicationId', async (req, res) =>{
  try{
    const medicationId = req.params.medicationId; //saving medication id from params
    console.log(medicationId);
    const medication = await Medication.findOne({ _id: medicationId });
    console.log(medication);
    if(!medication){
      return res.status(404).send('Medication not found');
    }
    res.json(medication);
  } catch(error){
    res.status(500).send('Server Error fetching medication data')
  }
});

//Set the server to listen on port 3000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});