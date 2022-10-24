
//function that will draw a border whenever page loads or when user starts a new timer (clicks the input to change value)
function drawBorder(element) {
    const timerBorder = {}
    timerBorder.radius = element.getAttribute('r');
    timerBorder.perimeter = (2 * Math.PI * parseFloat(timerBorder.radius));

    //border styles
    element.style.strokeDasharray = timerBorder.perimeter;
    element.style.stroke = 'green';
    element.style.strokeDashoffset = '0';

    return timerBorder;
}

//create the references to the DOM elements by selecting them
//timer elements
const durationInput = document.querySelector('#duration');
const playButton = document.querySelector('#play');
const pauseButton = document.querySelector('#pause');
//border element
const borderElement = document.querySelector('#timer-border')

//draw the border for first use of the timer with the default value
const timerBorder = drawBorder(borderElement);

//create the instance of Timer passing those three elements that were selected
//in order to notify the outside world that some important thing happened inside of the class, we are going to call a callback
//the set of callbacks that can potentially be called will be passed in an object as the fourth argument in the constructor
//the actions that we want to signal to the outside world are: 1- when timer starts, 2- when timer ticks, 3- when timer is finished
const timer = new Timer(durationInput, playButton, pauseButton, {
    //callback function to run when timer starts
    onStart(){
        //determine border segments based on border perimeter and timer seconds
        timerBorder.segments = parseFloat(timerBorder.perimeter) / parseFloat(durationInput.value);  
    },
    //callback function to run when timer ticks down
    onTick(){
        //erase a segment of the border each time the timer ticks down
        borderElement.style.strokeDashoffset = parseFloat(borderElement.style.strokeDashoffset) + timerBorder.segments;
    },
    onChange(){
        //draw a new border when user changes the time in the input
        drawBorder(borderElement);
    },
    //callback function to run when timer is finished
    onComplete(){
        console.log('Timer has finished');
    }
});