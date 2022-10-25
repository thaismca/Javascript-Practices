
//function that will create a border
//it will be called when page loads or when user needs a new timer (by clicking the input to change value)
function generateBorder(element) {
    //create and object that can be returned and its properties can be used outside of this function
    //since they are going to be needed in the callbacks passed in the arguments for the Timer instance
    const timerBorder = {}
    timerBorder.radius = element.getAttribute('r');
    timerBorder.cx = element.getAttribute('cx');
    timerBorder.cy = element.getAttribute('cy');
    timerBorder.perimeter = (2 * Math.PI * parseFloat(timerBorder.radius));

    //draw border with the following styles
    element.style.stroke = 'green';
    element.style.strokeDasharray = timerBorder.perimeter;
    element.style.strokeDashoffset = '0';
    element.setAttribute('transform', `rotate(-90 ${timerBorder.cx} ${timerBorder.cy})`);

    return timerBorder;
}

//create the references to the DOM elements by selecting them
//timer elements
const durationInput = document.querySelector('#duration');
const playButton = document.querySelector('#play');
const pauseButton = document.querySelector('#pause');
//border element
const borderElement = document.querySelector('#timer-border');

//draw the border for first use of the timer with the default value
const timerBorder = generateBorder(borderElement);

//create the instance of Timer passing those three elements that were selected
//in order to notify the outside world that some important thing happened inside of the class, we are going to call a callback
//the set of callbacks that can potentially be called will be passed in an object as the fourth argument in the constructor
//the actions that we want to signal to the outside world are: 1- when timer starts, 2- when timer ticks, 3- when timer is finished
const timer = new Timer(durationInput, playButton, pauseButton, {
    //callback function to run when timer starts
    onStart(){
        //determine border segments based on border perimeter and timer input value
        //multiply by 0.05, since each segment will be removed every 50 miliseconds
        timerBorder.segments = (parseFloat(timerBorder.perimeter) / parseFloat(durationInput.value)) * 0.05;  
    },
    //callback function to run when timer ticks down
    onTick(){
        //erase a segment of the border each time the timer ticks down
        borderElement.style.strokeDashoffset = parseFloat(borderElement.style.strokeDashoffset) - timerBorder.segments;
    },
    onChange(){
        //draw a new border when user changes the time in the input
        generateBorder(borderElement);
    },
    //callback function to run when timer is finished
    onComplete(){
        console.log('Timer has finished');
    }
});