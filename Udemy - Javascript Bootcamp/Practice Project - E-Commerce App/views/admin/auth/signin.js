//Exports HTML that generates admin sign in form
//it reuses the layout created for the admin panel
const layout = require('../layoutAdmin.js');

//get access to helper functions file and destruct out the getError method
//helper function to get potential errors in sign up form validation
const { getError } = require('../../helpers.js');

module.exports = ({ errors }) => {
  //pass the content of the sign up page to layout
  return layout({content: `
    <div>
      <form method="POST">
        <input name="email" placeholder="email" />
        ${getError(errors, 'email')}
        <input name="password" placeholder="password" />
        ${getError(errors, 'password')}
        <button>Sign In</button>
      </form>
    </div>
  `});
};