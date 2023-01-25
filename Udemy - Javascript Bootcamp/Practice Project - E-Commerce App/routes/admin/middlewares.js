//require validationResult from express-validator library
const { validationResult } = require('express-validator');

//declaring middleware functions to be exported and used in other files
module.exports = {
    //middleware function to handle validation errors in forms
    //it receives a template function that will be called when rendering out the errors inside a given form
    handleErrors(templateFunc) {
      return(req, res, next) => {
        //capture potential validation errors in the text inputs
        const errors = validationResult(req);
        //if error is not empty, display the form again, and the error messages
        if(!errors.isEmpty()){
          return res.send(templateFunc({ errors }));
        }

        //if no validation errors are encountered, continue to process the request
        next();
      }   
    },

    //middleware function to check if there's an user currently authenticated
    requireAuth(req, res, next) {
      //if there's no userId defined in req.session, it means no user is currently authenticated
      if(!req.session.userId) {
        //redirect to sign in page
        return res.redirect('/signin');
      }

      //if there's an user authenticated, continue to process the request
      next();
    }
}