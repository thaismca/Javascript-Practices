//---------- HELPER FUNCTIONS ---------------------------------------------------------------------------------------------------------------

//helper debounce function that receives a function in the arguments, to be used anywhere in the code where we want to introduce
//some rate limiting on how often this function can be invoked
//it also receives a delay argument, that represents the miliseconds to be passed in the setTimeout (default to 1000)
const debounce = (func, delay = 1000) => {
    //it will return a function that will implement a shield and guard how ofter func can actually be invoked
    //func might need to receive some arguments, so we need to make sure that if we ever pass any arguments to this wrapping function
    //they will be forward to func whenever it's called
    let timeoutId; //variable to keep track of the current timer identifier
    return (...args) => {
        //check if there is a timer from a previous input that is still pending
        if(timeoutId) {
            //if one is found, clearTimeout so func is never called
            clearTimeout(timeoutId);
        }
        //wait one second to run the function passed in the argument of debounce()
        //and assign the value that is returned from the setTimeout to the timeoutId variable
        timeoutId = setTimeout(() => {
            //call the function and take all the arguments or whatever is inside of the args array and pass them in
            //as separate arguments to the original function
            func.apply(null, args);
        }, delay);
    };
};