# Practice Project - Timer

Things the program does: 

- displays a timer
- shows animated border around the timer

![timer project screenshot](https://github.com/thaismca/Javascript-Practices/blob/79ff91abd2224442869bc29c174c6b8d55199b39/Udemy%20-%20Javascript%20Bootcamp/Practice%20Project%20-%20Timer/timer-image.PNG?raw=true)

## How it works
- user types in a number of seconds they want the timer to countdown
- to start the countdown, click *play*
- clicking the *pause* icon pauses the timer
- clicking the text input area where the coundown is displayd stops the timer and resets the timer border

## Implementation notes

Event style approach:
- event listener to watch for a click on 'play' button
- emit an event stating that the timer has started -> watch for this event and, when it occurs, draw the border
- start counting down the timer
- emit an event that the timer has 'ticked' -> watch for this event and, when it occurs, update the border
- each second the timer conts down, update the 'seconds left' text
- if the timer reaches 0
  - emit an event that the timer is done -> watch for this event and, when it occurs, reset the border
  - reset internal timer to get ready for another run

The idea is that, rather than try to write some code where we are alternating what we are doing step by step, and every line of code essentially does something totally different and unrelated to what occurred before it, we can instead have one block of code that is completely focused in one aspect of our app, and some other part needs to know about this stuff rather than directly take whatever action on itself inside this one block. For this to work, we would create one solid block that is 100% concerned around the timer, and then that block of code will eventually emit some event, call a callback, or otherwise tell the outside world that something important just occurred.

### Class-Based implementation
The idea is to use a class around DOM Elements.

**Class Timer** -> 100% corcerned with the timer elements: counter, play button and pause button

This class won't know anything about the animated border around the timer.

Methods in the Timer class will be invoked automatically whenever a user interacts with the timer elements.

- *play()* -> called whenever the user clicks the play button.
- *pause()* -> called whenever the user clicks the pause button.
- *onDurationChange()* -> called whenever the user clicks the duration text and turns it into a text input, so the number can be editted to change the timer duration.
- *tick()* -> called repeatedly over time, as long as the timer is counting down.

*constructor* -> whenever an instance of Timer is created, references to some DOM elements are passed in to serve as:
- the text input (durationInput)
- the play button (playButton)
- the pause button (pauseButton)

Query selectors were written to find the text input, the play and pause buttons, and those are passed into the constructor, so that the class essentially has a handle ito the DOM. Whenever it needs to reach into the DOM and do something, it has those three variables close at hand.