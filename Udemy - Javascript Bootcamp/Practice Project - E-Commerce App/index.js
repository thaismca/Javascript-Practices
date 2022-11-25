//get access to the express package inside of this project
//package that will be used to help creating a web server
const express = require('express');
//create an instance of express
//this object describes all the different thing that the web server can do
const app = express();
//require an instance of the UserRepository class
const usersRepo = require('./repositories/users.js');

//get access to the body-parser library
//this object exposes various factories to create body parsing middlewares
const bodyParser = require('body-parser');
//use the urlencoded method from bodyParser as a middeware function to parse the body of all the requests
//app.use will set this middleware to be called for all the different route handlers
app.use(bodyParser.urlencoded({ extended: true }));

//route handlers that tells the web server what it should do when it receives a network request coming from the browser
//watching for incoming requests for a path of '/' and a method of GET 
app.get('/', (req, res) => {
    //adminstrator sign up form
    res.send(`
        <div>
          <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password" />
            <input name="passwordConfirmation" placeholder="password confirmation" name />
            <button>Sign Up</button>
          </form>
        </div>
    `);
});

//watching for incoming requests for a path of '/' and a method of POST
app.post('/', async (req, res) => {
    //deconstruct properties out of the req.body object
    const { email, password, passwordConfirmation } = req.body;

    //check if another user already signed up with the email that was submitted in the form
    const existingUser = await usersRepo.getOneBy({ email });
    if(existingUser) {
      //if there an user with that email, show an error message
      return  res.send('This email is already in use!');
    }

    //check if password matches passwordConfirmation
    if(password !== passwordConfirmation) {
      //if they don't match, show an error message
      return res.send('Passwords must match!')
    }
    
    res.send('account created');
});


//start listening fom incoming network traffic on a particular port
app.listen(3000, () => {
    console.log('listening');
});