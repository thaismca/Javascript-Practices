//helper function to make HTTP request
const fetchData = async (searchTerm) => {
    //axios.get can receive an object with parameters in the arguments, to create a query string that will be added to the request url
    const response = await axios.get('http://www.omdbapi.com/', {
        //according to the API documentation, the apikey and a string s corresponding to a movie title to search for
        //are the required parameters to make a request using the By Search endpoint
        params: {
            apikey: '44e448f2',
            s: searchTerm
        }
    });

    console.log(response.data);
};

//select the search input
const input = document.querySelector('input');

//a function that can be called on user input, that will delay the search so we don't send a HTTP request at every single typed character
//it will instead wait until the user stops typing for one second and then send a HTTP request -> setTimeout
//each time we call setTimeout we get back an integer value that represents an identifier for the timer that was just created
//we can call clearTimeout to stop the pending timer and preventing the function in the setTimeout from being called
//in order to do that, we need to keep track of the current timer identifier 
let timeoutId;
//assign the function to a variable that will be passed as the second argument in the input EventListener
const onInput = (e) => {
    //check if there is a timer from a previous input that is still pending
    if(timeoutId) {
        //if one is found, clearTimeout so the function is never called
        clearTimeout(timeoutId);
    }
    //wait one second to run the fetchData function, and assign the value that is returned from the setTimeout to the timeoutId variable
    timeoutId = setTimeout(() => {
        fetchData(e.target.value);
    }, 1000);
}
//we are going to be calling onInput many, many times in a row
//the very first time we call it (first character is typed), timeoutId will be undefined, so the if statement is going to be skipped
//setTimeout will be executed and a timer will be created to call fetchData after 1 second, and the timer id will be stored in timeoutId
//in the next keypress from the user that happens within the 1 second interval, timeoutId will be defined
//the block inside the if statement will be executed and the pending timer will be stopped
//a new timer will be set up, and will going to have a new value that is going to call fetchData with
//this process wil be repeated over and over again, until we eventually go for a full second before calling onInput again 

input.addEventListener('input', onInput);


