//get access to the express package inside of this project
//package that will be used to help creating a web server
const express = require('express');
//create an instance of express
//this object describes all the different thing that the web server can do
const app = express();

//route handler that tells the web server what it should do when it receives a network request coming from the browser
app.get('/', (req, res) => {
    res.send('hi there');
});

//start listening fom incoming network traffic on a particular port
app.listen(3000, () => {
    console.log('listening');
});