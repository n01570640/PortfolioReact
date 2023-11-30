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
const User = require('./schemas/userSchema');
const Patient = require('./schemas/patientSchema');
const Medication = require('./schemas/medicationSchema');

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
        const token = jwt.sign({ userId: user._id }, 'yourJWTSecret', { expiresIn: '1h' });
        res.send({ token });
    })(req, res, next);
});
// app.post('/login', async (req, res)=> {
//     console.log("Hello")
//     passport.authenticate('local', {session: false}, async (err, user, info) => {
//     //    try{
// //            const user = await User.findOne({ username });
// //            console.log(user);
// //            console.log("Helloo");
// //            if(!user) {
// //                console.log("User not found while trying to log in");
// //                return res.status(401).send({error: "Invalid username or password"})
// //            }
   
// //            //Check if the password is correct
// //            const isMatch = await bcrypt.compare(password, user.hashedPassword); //compare the password with database
// //            if(!isMatch){
// //                user = await User.findOne({username})
// //                console.log(user);
// //                return res.status(401).send({error: "Invalid username or password"})
// //            }
   
// //            //Create a JWT token
// //            const token = jwt.sign({userId: user._id }, 'yourJWTSecret', {expiresIn: '1h'});
// //            res.send({token});
// //        } catch (error){
// //             console.log(error);
// //            res.status(500).send({error: 'Internal server error'});
// //        }
// //    });
//         if(err) {
//             console.log(err);
//             return( res.status(500).json({error: 'Internatal server error'}))
            
//         }
//         if( !user) {
//             return res.status(401).json({ error: info ? info.message: 'Invalid username or password'});
//         }
//         console.log(user);
//         //User is found and password is correct, create JWT
//         const token = jwt.sign({ userId: user_id }, 'ThisISaSeCeReT', { expiresIn: '1h'}); 
//         return res.json({ token });
//     });
//  });
//Set the server to listen on port 3000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});