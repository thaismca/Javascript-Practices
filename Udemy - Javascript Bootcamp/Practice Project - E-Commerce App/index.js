//get access to the express package inside of this project
//package that will be used to help creating a web server
const express = require('express');
//create an instance of express
//this object describes all the different thing that the web server can do
const app = express();

//get access to the body-parser library
//this object exposes various factories to create body parsing middlewares
const bodyParser = require('body-parser');
//use the urlencoded method from bodyParser as a middeware function to parse the body of all the requests
//app.use will set this middleware to be called for all the different route handlers
app.use(bodyParser.urlencoded({ extended: true }));

//get access to the cookie-session library
const cookieSession = require('cookie-session');
//use cookieSession to create a new cookie session middleware with the provided options
//app.use will set this middleware to be called for all the different route handlers
app.use(cookieSession({ keys: ['15j4n21#jjpc24m4r90&tmc15s3p87']}));

//require an instance of the UserRepository class
const usersRepo = require('./repositories/users.js');

//ROUTE HANDLRES that tell the web server what it should do when it receives a network request coming from the browser

//watching for incoming requests for a path of '/signup' and a method of GET
//display signup form
app.get('/signup', (req, res) => {
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

//watching for incoming requests for a path of '/signup' and a method of POST
//when a sign up form is submitted -> create a new user
app.post('/signup', async (req, res) => {
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
    return res.send('Passwords must match!');
  }

  //create an user inside of the usersRepo 
  const newUser = await usersRepo.create({ email, password });
  //store the id of that new user inside of the user's cookie
  req.session.userId = newUser.id;

  res.send('account created');
});

//watching for incoming requests for a path of '/signout' and a method of GET
//when a user signs out of the application
app.get('/signout', (req, res) => {
  //take whatever the current session object is and 'forget' it
  req.session = null;

  res.send('you are logged out');
});

//watching for incoming requests for a path of '/signin' and a method of GET
//display sign in form
app.get('/signin', (req, res) => {
  //adminstrator sign up form
  res.send(`
      <div>
        <form method="POST">
          <input name="email" placeholder="email" />
          <input name="password" placeholder="password" />
          <button>Sign In</button>
        </form>
      </div>
  `);
});

//watching for incoming requests for a path of '/signin' and a method of POST
//when a sign in form is submitted -> authenticate user
app.post('/signin', async (req, res) => {
  //deconstruct properties out of the req.body object
  const { email, password } = req.body;

  //check if there's an account for the email that was submitted in the form
  const existingUser = await usersRepo.getOneBy({ email });
  if(!existingUser) {
    //if there's not an user with that email, show an error message
    return  res.send(`Account for email ${email} does not exist`);
  }

  //check if provided password matches password in database for the user
  if(existingUser.password !== password) {
    //if they don't match, show an error message
    return res.send('Invalid password');
  }

  //authenticate user by storing the id of that new user inside of the user's cookie
  req.session.userId = existingUser.id;

  res.send('You are logged in');
});


//start listening fom incoming network traffic on a particular port
app.listen(3000, () => {
    console.log('listening');
});