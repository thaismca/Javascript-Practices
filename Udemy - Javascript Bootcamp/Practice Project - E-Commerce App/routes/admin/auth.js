//get access to the express package inside of this project
const express = require('express');
//require check and validationResult from express-validator library
const { check, validationResult } = require('express-validator');
//require an instance of the UserRepository class
const usersRepo = require('../../repositories/users');

//get access to views from other files in this project
const singupTemplate = require('../../views/admin/auth/signup');
const singinTemplate = require('../../views/admin/auth/signin');
const { 
  validateEmail, validatePassword, validatePasswordConfirmation, //sign up form validation
  validateUser, validateUserPassword //sign in form validation
} = require('./validators');

//create an instance an router object from the express library
const router = express.Router();

//---- USER SIGN UP -------------------------------------------------------------------------------------------------
//watching for incoming requests for a path of '/signup' and a method of GET
//display signup form
router.get('/signup', (req, res) => {
  res.send(singupTemplate({ req }));
});
  
//watching for incoming requests for a path of '/signup' and a method of POST
//when a sign up form is submitted -> create a new user
router.post(
  '/signup',
  [
    //inputs sanitization and validation, exported from validators.js
    validateEmail, 
    validatePassword, 
    validatePasswordConfirmation
  ],
  async (req, res) => {
    //capture potential validation errors
    const errors = validationResult(req);
    //if error is not empty, display the sign up form again, and the error messages
    if(!errors.isEmpty()){
      return res.send(singupTemplate({ req, errors }));
    }

    //deconstruct meaningful properties out of the req.body object
    const { email, password } = req.body;
  
    //create an user inside of the usersRepo 
    const newUser = await usersRepo.create({ email, password });
    //store the id of that new user inside of the user's cookie
    req.session.userId = newUser.id;

    res.send('account created');
});
 
//---- USER SIGN OUT -------------------------------------------------------------------------------------------------
//watching for incoming requests for a path of '/signout' and a method of GET
//when a user signs out of the application
router.get('/signout', (req, res) => {
  //take whatever the current session object is and 'forget' it
  req.session = null;

  res.send('you are logged out');
});
  
//watching for incoming requests for a path of '/signin' and a method of GET
//display sign in form
router.get('/signin', (req, res) => {
  res.send(singinTemplate({}));
});
  
//---- USER SIGN IN -------------------------------------------------------------------------------------------------
//watching for incoming requests for a path of '/signin' and a method of POST
//when a sign in form is submitted -> authenticate user
router.post(
  '/signin',
  [
    //inputs sanitization and validation, exported from validators.js
    validateUser,
    validateUserPassword
  ],
  async (req, res) => {
    //capture potential validation errors
    const errors = validationResult(req);
    //if error is not empty, display the sign up form again, and the error messages
    if(!errors.isEmpty()){
      return res.send(singinTemplate({ errors }));
    }
    
    //deconstruct properties out of the req.body object
    const { email } = req.body;
    
    //get the user to start a session for it
    const user = await usersRepo.getOneBy({ email });
    req.session.userId =user.id;
    
    res.send('You are logged in');
});

//---- EXPORT ROUTERS -------------------------------------------------------------------------------------------------
module.exports = router;