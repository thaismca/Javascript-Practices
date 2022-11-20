//get access to the express package inside of this project
//package that will be used to help creating a web server
const express = require('express');
//create an instance of express
//this object describes all the different thing that the web server can do
const app = express();

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
app.post('/', (req, res) => {
    res.send('account created');
});


//start listening fom incoming network traffic on a particular port
app.listen(3000, () => {
    console.log('listening');
});