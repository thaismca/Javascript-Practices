//get access to the functions in the index.js file
const { forEach, map } = require('./index.js');

//testing the forEach function
//Case 1: call a function that sums all the elements in an iterable with an array of [1, 2, 3]
//Expected output: 6
let sum = 0;
forEach([1, 2, 3], value => {
    sum += value;
});
if(sum !== 6) {
    throw new Error('Expected summing array to equal 6');
}

//------------------------------------------------------------------------------------------------------------------

//testing the map function
//Case 1: call a function that squares each of the elements in an iterable with an array of [2, 3, 4]
//Expected output: [4, 9, 16]
const squares = map([2, 3, 4], value => {
    return value * value;
});
if(squares[0] !== 4) {
    throw new Error(`This result should be 4, but found ${squares[0]}`);
}
if(squares[1] !== 9) {
    throw new Error(`This result should be 9, but found ${squares[1]}`);
}
if(squares[2] !== 16) {
    throw new Error(`This result should be 16, but found ${squares[2]}`);
}