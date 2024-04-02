const express = require('express');
const mongoose = require('mongoose');
//then we import the newly developed route controller
const authRoute = require(`./routes/authRoute`)
const {requireAuth, checkUser}= require(`./middleware/auth_middleware`);


const app = express();


//the chapter of creating cookies, we will require cookie parser here and use it as a middleware to save cookies in the users computer

const cookieParser = require(`cookie-parser`);
const { requireAuth } = require('./middleware/auth_middleware');

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());//we've inputed the cookie parser, so now we will use it access a cookie method in the response 
app.set('view engine', 'ejs');


// Database connection
const mongodb_URL = 'mongodb+srv://iammichy47:XfrFZs38FkMF9Jvg@cluster0.fxk7ukr.mongodb.net/jwt_auth?retryWrites=true&w=majority&appName=Cluster0'



mongoose.connect(mongodb_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        // Start the server after successful database connection
        const PORT = process.env.PORT || 3500; // Use process.env.PORT for production or default to 3500
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

// Routes
app.get(`*`, checkUser);  //we created this middleware in our middle ware folder to check if user is logged in on ever route we are trying to access
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/meatpie',requireAuth ,(req, res) => {
    res.render('meatpie');
});

// //learning how to send cookies
// app.get(`/set-cookies`,(req, res)=>{
//     //what we did here was create a cookie name "newUser" and made the value false...ps, we can create multiple cookies and it can also take 3 arguments i.e maxAge
//   res.cookie(`newUser`,false, {maxAge: 1000*60*60, secure:true, httpOnly: true})//this cookie expires in 1hour and the cookie is only sent when we have a secured https(httpOnly:true) and (secure:true),,,must be used in real life application
// })

// //since we can send cookies with res.send we can also read cookies too , so we can have access to a page we have already entered

// app.cookie(`/read-cookies`,(req,res)=>{
//     const cookies = req.cookies;
//     res.json(cookies);
//     //it returns a json of all the available cookies, and we can use dot notation to get the particular cookie we need
// })

app.use(authRoute);
