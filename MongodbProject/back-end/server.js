//Importing required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
//Creating an express application
const app = express();
//middleware to handle cors
app.use(cors({
    origin: "http://localhost:3000"
}));
app.use(express.json());




//Estabilishing a connection to Mongodb
mongoose.connect('mongodb://127.0.0.1/HumberSocialClub', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


//Users Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number,
    isActive: Boolean,
    tags: [{
        type: String
    }]
});
const User = mongoose.model('User', userSchema,'User');

//Middleware to fetch all users
const getAllUsers = async(req, res, next) => {
    try{
        const users = await User.find({});
        res.json(users);
    
    }catch (error){
        res.status(500).json({ error: error.message });
    }
};
//Middleware to fetch users not 30 years old
const getUsersNotThirty = async (req, res, next) => {
    try{
        const users = await User.find({age: {$ne: 30 }});
        res.json(users);
        //console.log(users);
    }catch (error){
        next(error);
    }
};
//Middleware to fetch users older than 22 years old
const getUserOlderThan22 = async(req, res, next) => {
    try{
        const users = await User.find({age: {$gt: 22}});
        res.json(users);
    }catch (error) {
        next(error);
    }
};
//Middleware to fetch users younger than 20 years old
const getUsersYoungerThan20 = async(req, res, next) => {
    try{
        const users = await User.find({age: {$lt: 20}});
        res.json(users);
    }catch (error){
        next(error);
    }
};
//Middleware to fetch users that are active mentors
const getActiveMentors = async(req, res, next) => {
    try{
        const users = await User.find({isActive: true, tags: {$in: "mentor"}});//or {$eq: "mentor"}
        res.json(users);
    }catch (error){
        next(error);
    }
};
//Middleware to fetch users who are not 20 years old
const getUsersNotTwenty = async(req, res, next) => {
    try{
        const users = await User.find({age: {$ne: 20}}); 
        res.json(users)
    }catch (error){
        next(error);
    }
};


//Defining a route
app.get("/", getAllUsers);
app.get("/not-thirty", getUsersNotThirty);
app.get("/older-than-22", getUserOlderThan22);
app.get("/younger-than-20", getUsersYoungerThan20);
app.get("/active-mentors", getActiveMentors);
app.get("/not-twenty", getUsersNotTwenty);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});