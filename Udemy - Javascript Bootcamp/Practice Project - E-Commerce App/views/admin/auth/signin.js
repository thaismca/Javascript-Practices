//Exports HTML that generates admin sign in form
//it reuses the layout created for the admin panel
const layout = require('../layoutAdmin.js');

module.exports = () => {
  //pass the content of the sign up page to layout
  return layout({content: `
    <div>
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <button>Sign In</button>
      </form>
    </div>
  `});
};