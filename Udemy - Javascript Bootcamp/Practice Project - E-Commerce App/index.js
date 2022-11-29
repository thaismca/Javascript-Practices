//get access to the express package inside of this project
//package that will be used to help creating a web server
const express = require('express');
//get access to the body-parser library
//this object exposes various factories to create body parsing middlewares
const bodyParser = require('body-parser');
//get access to the cookie-session library
const cookieSession = require('cookie-session');

//get access to routers from other files in this project
const authRouter = require('./routes/admin/auth');

//create an instance of express
//this object describes all the different thing that the web server can do
const app = express();

//use the urlencoded method from bodyParser as a middeware function to parse the body of all the requests
//app.use will set this middleware to be called for all the different route handlers
app.use(bodyParser.urlencoded({ extended: true }));
//use cookieSession to create a new cookie session middleware with the provided options
//app.use will set this middleware to be called for all the different route handlers
app.use(cookieSession({ keys: ['15j4n21#jjpc24m4r90&tmc15s3p87']}));
//hook up routes required from other files as middlewares to be called for all the different route handlers
app.use(authRouter);


//ROUTE HANDLERS that tell the web server what it should do when it receives a network request coming from the browser




//start listening fom incoming network traffic on a particular port
app.listen(3000, () => {
    console.log('listening');
});