//require check from express-validator library
const { check } = require('express-validator');
//require an instance of the UserRepository class
const usersRepo = require('../../repositories/users.js');

//declaring validators to be exported and used in other files
module.exports = {
  //---- SIGN UP FORM VALIDATIONS -----------------------------------------------------------------------------
    //validates email from user input in sign up form
    validateEmail: check('email')
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
    
    //validates password from user input in sign up form
    validatePassword: check('password')
      .trim()
      .isLength({ min:6, max:20 })
      .withMessage('Password must be between 6 and 20 characters'),
    
    //validates password confirmation from user input in sign up form 
    validatePasswordConfirmation: check('passwordConfirmation')
      .trim()
      //custom validator that checks if the passwordConfirmation matches the password
      .custom(async (passwordConfirmation, { req }) => {
        if(req.body.password !== passwordConfirmation) {
          //if they don't match, show an error message
          throw new Error('Password and Password Confirmation must match');
        }
      }),

  //---- SIGN IN FORM VALIDATIONS -----------------------------------------------------------------------------
    //validates email from user input in sign in form
    validateUser: check('email')
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage('This is not a valid email')
      //custom validator to check if there's an account for the email that was submitted in the form
      .custom(async (email) => {
        const existingUser = await usersRepo.getOneBy({ email });
        if(!existingUser) {
          //if there's not an user with that email, show an error message
          throw new Error(`Account for email ${email} does not exist`);
        }
      }),

    //validates email from user input in sign in form  
    validateUserPassword: check('password')
      .trim()
      //custom validator to check if provided password matches password in database for the user
      .custom(async (password, { req }) => {
        const user = await usersRepo.getOneBy({ email: req.body.email });
        if(!user){
          //if the user is not valid, this was already treated in the email check, so we don't need antoher message
          return '';
        }
        const validPassword = await usersRepo.comparePasswords(password, user.password);
        if(!validPassword){
          //if it's not a match, show an error message
          throw new Error(`Invalid password`);
        }
      }),

  //---- NEW PRODUCT FORM VALIDATIONS -----------------------------------------------------------------------------
    //validates product name from user input in new product form
    validateProductName: check('productName')
      .trim()
      .isLength({ min:5, max:40 })
      .withMessage('Product name must be between 5 and 40 characters'),
      
    //validates product price from user input in new product form
    validateProductPrice: check('price')
      .trim()
      .toFloat()
      .isFloat({ min: 0.01 })
      .withMessage('Invalid price')
}