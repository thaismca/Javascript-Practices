class Timer{
    //receive arguments inside of the constructor that correspond to references to DOM elements
    constructor(durationInput, playButton, pauseButton){
        //store a refence to each of the arguments in case we need to work with them at some point inside of the class methods
        this.durationInput = durationInput;
        this.playButton = playButton;
        this.pauseButton = pauseButton;

        //bind some event listener to the elements that were passed in the arguments
        //this is how a method that is defined inside of the class is going to be called
        this.playButton.addEventListener('click', this.start);
        this.pauseButton.addEventListener('click', this.pause);
        this.durationInput.addEventListener('focus', this.onChangeDuration);
    };

    //use arrow functions so the value of 'this' is guaranteed to be be equal to the instance of the class
    //method to run when user clicks the play button
    start = () => {
        //call tick() once as soon as the user clicks the play button, otherwise it will start to countdown after the first full second runs
        this.tick();

        //call tick once every second
        //since we are going to need access to the interval outside of the scope of the start function,
        //store a reference to it in an property interval for this instance of Timer
        this.interval = setInterval(this.tick, 1000);
    };

    //method to run when user clicks the pause button or when countdown reaches 0
    pause = () => {
        //stop the countdown that was called in start
        clearInterval(this.interval);
    };

    //method to be called repeatedly over time, as long as the timer is counting down
    //should start when user clicks play, and stop when user clicks pause
    tick = () => {
        //check if the countdown reached 0
        if(this.timeRemaining <= 0){
            //stop the countdown
            this.pause();
        } 
        else { //still didn't reach 0
            //update the timeRemaining and throw the new value back into the input element using the set and get methods
            this.timeRemaining = this.timeRemaining - 1;
        }
        
    };
    //creating getter and setter methods to work with the time remaining in the text input
    get timeRemaining() {
        //reach to the text input and get the current value out of it and parse it into a number
        return parseFloat(this.durationInput.value);
    };
    set timeRemaining(time) {
        //set the value of the input to the time parameter
        this.durationInput.value = time;
    };

    // /called whenever the user clicks the duration text and turns it into a text input
    //so the number can be editted to change the timer duration
    onChangeDuration = () => {
        //pause the timer as soon as the click on the input happens
        this.pause(); 
    };
};

//create the references to the DOM elements by selecting them
const durationInput = document.querySelector('#duration');
const playButton = document.querySelector('#play');
const pauseButton = document.querySelector('#pause');

//create the instance of Timer passing those three elements that were selected
const timer = new Timer(durationInput, playButton, pauseButton);