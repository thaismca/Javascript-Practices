//require check from express-validator library
const { check } = require('express-validator');
//require an instance of the UserRepository class
const usersRepo = require('../../repositories/users.js');

//declaring validators for sign up form to be exported and used in other files
module.exports = {
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
      .isLength({ min:6, max:20 })
      .withMessage('Password must be between 6 and 20 characters')
      //custom validator that checks if the passwordConfirmation matches the password
      .custom(async (passwordConfirmation, { req }) => {
        if(req.body.password !== passwordConfirmation) {
          //if they don't match, show an error message
          throw new Error('Password and Password Confirmation must match');
        }
      })
}