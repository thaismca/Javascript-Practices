//get access to the express package inside of this project
const express = require('express');
//require check and validationResult from express-validator library
const { check, validationResult } = require('express-validator');
//require an instance of the UserRepository class
const usersRepo = require('../../repositories/users.js');

//get access to views from other files in this project
const singupTemplate = require('../../views/admin/auth/signup');
const singinTemplate = require('../../views/admin/auth/signin');

//create an instance an router object from the express library
const router = express.Router();

//---- USER SIGN UP -------------------------------------------------------------------------------------------------
//watching for incoming requests for a path of '/signup' and a method of GET
//display signup form
router.get('/signup', (req, res) => {
  res.send(singupTemplate());
});
  
//watching for incoming requests for a path of '/signup' and a method of POST
//when a sign up form is submitted -> create a new user
router.post('/signup', [
    //inputs sanitization and validation
    check('email')
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage('This is not a valid email')
      //custom validator that checks if the email is already in use
      .custom(async (email) => {
        const existingUser = await usersRepo.getOneBy({ email });
        if(existingUser) {
        //if there an user with that email, show an error message
        throw new Error('This email is already in use');
        }
      }),
    check('password')
      .trim()
      .isLength({ min:6, max:20 })
      .withMessage('Password must be between 6 and 20 characters'),
    check('passwordConfirmation')
      .trim()
      .isLength({ min:6, max:20 })
      .withMessage('Password must be between 6 and 20 characters')
      //custom validator that checks if the passwordConfirmation matches the password
      .custom(async (passwordConfirmation, { req }) => {
        if(req.body.password !== passwordConfirmation) {
          //if they don't match, show an error message
          throw new Error('Password and Password Confirmation must match');
        }
      })
    ],
  async (req, res) => {
    //capture potential validation errors
    const errors = validationResult(req);
    if(errors){
      console.log(errors);
      return res.send('failed to create account');
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
  res.send(singinTemplate());
});
  
//---- USER SIGN IN -------------------------------------------------------------------------------------------------
//watching for incoming requests for a path of '/signin' and a method of POST
//when a sign in form is submitted -> authenticate user
router.post('/signin', async (req, res) => {
  //deconstruct properties out of the req.body object
  const { email, password } = req.body;
  
  //check if there's an account for the email that was submitted in the form
  const existingUser = await usersRepo.getOneBy({ email });
  if(!existingUser) {
    //if there's not an user with that email, show an error message
    return res.send(`Account for email ${email} does not exist`);
  }
  
  //check if provided password matches password in database for the user
  const validPassword = await usersRepo.comparePasswords(password, existingUser.password);
  if(!validPassword){
    //if it's not a match, show an error message
    return res.send(`Invalid password`);
  }
  
  //authenticate user by storing the id of that new user inside of the user's cookie
  req.session.userId = existingUser.id;
  
  res.send('You are logged in');
});

//---- EXPORT ROUTERS -------------------------------------------------------------------------------------------------
module.exports = router;