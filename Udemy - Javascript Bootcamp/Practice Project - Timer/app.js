//create the references to the DOM elements by selecting them
const durationInput = document.querySelector('#duration');
const playButton = document.querySelector('#play');
const pauseButton = document.querySelector('#pause');

//create the instance of Timer passing those three elements that were selected
//in order to notify the outside world that some important thing happened inside of the class, we are going to call a callback
//the set of callbacks that can potentially be called will be passed in an object as the fourth argument in the constructor
//the actions that we want to signal to the outside world are: 1- when timer starts, 2- when timer ticks, 3- when timer is finished
const timer = new Timer(durationInput, playButton, pauseButton, {
    //callback function to run when timer starts
    onStart(){
        console.log('Timer has started');
    },
    //callback function to run when timer ticks down
    onTick(){
        console.log('Timer has ticked');
    },
    //callback function to run when timer is finished
    onComplete(){
        console.log('Timer has finished');
    }
});