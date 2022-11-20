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
    //get access to info from admin sign up form (email, password, passwordConfirmation)

    //the request object emits a data event any time that it receives some bit of data
    //listening for this data event, and then getting access to the data that is being received
    req.on('data', data => {
        //an object that is going to eventually contain all the information from the request body
        const formData = {};

        //data comes as a buffer, so parse it to a utf-8 encoded string to make it readable
        //split at '&', to get an array of strings with 'email=...', 'password=...' and 'passwordConfirmation=...'
        const parsed = data.toString('utf8').split('&');
     
        //loop over the array
        for(let pair of parsed){
            //split each array element at '=' to get pair of key and value
            const [key, value] = pair.split('=');
            //use key and value to add that information to the formData object
            formData[key] = value;
        }
        //display formData object in the log
        console.log(formData);
    });

    res.send('account created');
});


//start listening fom incoming network traffic on a particular port
app.listen(3000, () => {
    console.log('listening');
});