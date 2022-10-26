//file to store code that was first written to understand some concepts and that will end up being refactored in the app.js file
//so I can easily access older notes and implementations when studying
//NOTE: trying to actually use this script might cause errors

//------------------------------------------------------------------------------------------------------------------------------------------
//first implementation of the delayed search input
//this implementation was refactored in the app.js file to make a reusable debounce

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
//this entire process is referred to as debouncing an input -> wait for some time to pass after the last event to actually do something

input.addEventListener('input', onInput);

//--------------------------------------------------------------------------------------------------------------------------------------------
//after debounce refactoring
//debounce can be applied in two different ways

//applied to the declaration of onInput - it means onInput will always be wrapped in debouce when invoked
const onInput = debounce((e) => {
    fetchData(e.target.value);
}, 500);
//select the search input and add the event listener
const input = document.querySelector('input');
input.addEventListener('input', onInput);

//applied when invoking onInput - it means onInput can be used with or without being wrapped in debounce
//it will only have debounce wrapper applied when called inside of a debounce invoking
const onInput = (e) => {
    fetchData(e.target.value);
};
//select the search input and add the event listener
const input = document.querySelector('input');
input.addEventListener('input', debounce(onInput, 500));
