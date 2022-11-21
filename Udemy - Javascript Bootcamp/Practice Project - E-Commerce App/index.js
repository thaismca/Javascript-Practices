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

//helper function to parse the information in the body of a POST request
const bodyParser = (req, res, next) => {
    //check if this is a POST request
    if(req.method === 'POST'){
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
            //take the formData object and assign it to the body property of the request
            req.body = formData;
            //sinalize that the middleware function is all done with processing
            next();
        });
    } else { //not a POST request, so we don't care about processing it in here
        next();
    }
};

//watching for incoming requests for a path of '/' and a method of POST
app.post('/', bodyParser, (req, res) => {
    //display information from the body property of the req object
    console.log(req.body);

    res.send('account created');
});


//start listening fom incoming network traffic on a particular port
app.listen(3000, () => {
    console.log('listening');
});