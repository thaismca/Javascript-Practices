//get access to the functions in the index.js file
const { forEach, map } = require('./index.js');

//helper function to execute test cases
//it receives a description and a function to be invoked in the arguments
const test = (desc, func) => {
    console.log(`----- ${desc}`);
    try {
        func();
    } catch (err) {
        console.log(err.message);
    }
}

//testing the forEach function
//Case 1: call a function that sums all the elements in an iterable with an array of [1, 2, 3]
//Expected output: 6
test('Testing the forEach function', () => {
    let sum = 0;
    forEach([1, 2, 3], value => {
        sum += value;
    });
    if(sum !== 6) {
        throw new Error('Expected summing array to equal 6');
    }
});

//------------------------------------------------------------------------------------------------------------------
//testing the map function
//Case 1: call a function that squares each of the elements in an iterable with an array of [2, 3, 4]
//Expected output: [4, 9, 16]
test('Testing the map function', () => {
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
});
