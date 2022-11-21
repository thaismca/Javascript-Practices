//file to store code that was first written to understand some concepts and that will end up being refactored in the app.js file
//so I can easily access older notes and implementations when studying
//NOTE: trying to actually use this script will cause errors

//PARSING FORM DATA
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