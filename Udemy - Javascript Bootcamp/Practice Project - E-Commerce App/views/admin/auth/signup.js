//Exports HTML that generates admin sign up form
//it reuses the layout created for the admin panel
const layout = require('../layoutAdmin.js');

//helper function to get potential errors in sign up form validation
//it receives an array of objects 'errors', and the property we want to get the error message for
const getError = (errors, prop) => {
  try {
    //use the mapped method to get an object from the 'errors' Result object
    //where the keys are the field names, and the values are the validation errors
    //for the key that matches the 'property' argument, check the value for the 'msg' and return it
    return errors.mapped()[prop].msg;
  }
  //if anything goes wrong with retuning an error message -> either there are no errors (errors undefined),
  //or there are no key that matches the 'property' argument in the object returned from errors.mapped
  catch (err) {
    return '';
  }
}

module.exports = ({ req, errors }) => {
  //pass the content of the sign up page to layout
  return layout({content: `
    <div>
      <form method="POST">
        <input name="email" placeholder="email" />
        ${getError(errors, 'email')}
        <input name="password" placeholder="password" />
        ${getError(errors, 'password')}
        <input name="passwordConfirmation" placeholder="password confirmation" name />
        ${getError(errors, 'passwordConfirmation')}
        <button>Sign Up</button>
      </form>
    </div>
  `});
};