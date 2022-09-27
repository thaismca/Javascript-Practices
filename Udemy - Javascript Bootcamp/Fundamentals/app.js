//----------ARRAY METHODS--------------------------------------------------------------------------

//formatMath should receive an expression in form of a string and return the result of that expression
function formatMath(expr){

    //break the expression in three parts
    //first part -> subarray with numbers before the operator
    //second part -> operator
    //third part -> subarray with numbers after the operator

    let num1;
    let num2;
    let operator;

    for(let i = 0; i < expr.length; i++){
        if(expr[i] === "+" || expr[i] === "-" || expr[i] === "*" || expr[i] === "/"){
            num1 = parseInt(expr.slice(0, i));
            num2 = parseInt(expr.slice(i+1));
            operator = expr[i];
        }
    }

    //check the char in operator and apply the corresponding math operation using the numbers
    if(operator === "+"){
        return `${num1} + ${num2} = ${num1 + num2}`;
    }
    if(operator === "-"){
        return `${num1} - ${num2} = ${num1 - num2}`;
    }
    if(operator === "*"){
        return `${num1} * ${num2} = ${num1 * num2}`;
    }
    if(operator === "/"){
        return `${num1} / ${num2} = ${num1 / num2}`;
    }

}

//indexOf
//if indexOf === -1, it means no match was encountered
function isValidPassword(username, password){
    //checks if password shorter than 8 chars
    //has empty spaces
    //and contains the username
    if(password.lenght < 8 ||
        password.indexOf(' ') !== -1 ||
        password.indexOf(username) !== -1){
            //if any of the conditions is true, password is invalid
            return false;
        }
    //if all conditions checked are false, the password is valid
    return true;
}

//for of
//loops through all indexes in an array
function avg(arr){
    let sum = 0;
    for (let n of arr) {
     sum += n;
    }
    let average = sum / arr.length;
    return average;
}

//----------ARRAYS, OBJECTS AND MATH---------------------------------------------------------------

//get card of a random number and suit
function pick(arr){
    const index = Math.floor(Math.random() * arr.length);
    return arr[index];
}

function getCard(){
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const suits = ['clubs', 'diamonds', 'hearts', 'spades'];

    return {value: pick(values), suit: pick(suits)};
}

//making that getCard as part of an object
const deck = {
    values: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
    suits: ['clubs', 'diamonds', 'hearts', 'spades'],

    pick(arr){
        const index = Math.floor(Math.random() * arr.length);
        return arr[index];
    },
    
    getCard(){
        return {value: pick(this.values), suit: pick(this.suits)};
    }

}

//----------CALLBACKS AND ARROW FUNCTIONS---------------------------------------------------------------------------------

//roll one die
const rollDie = () => Math.floor(Math.random() * 6) +1;

//roll n dice and getting an array with all the n numbers from the dice
const rollDice = (func, x) => {
    const result = [];

    for(let i = 0; i< x; i++){
        result.push(func());
    }

    return result;
}

//----------MORE ARRAY AND OBJECT METHODS AND ARROW FUNCTIONS-----------------------------------------

//generate random int number within an interval
function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

//generate an array of x random int numbers between min and max
const genRandomsArray = (n, min, max) => {
    const arr = [];
    for(let i=0; i<n; i++){
        arr.push(randomIntFromInterval(min, max));
    }
    return arr;
}

//separate even and odd numbers from an array in two different arrays
//and return an object with the two arrays
function separateEvenAndOdd(arr){
    /*const even = [];
    const odd = [];
    arr.forEach(function(el){
        if(el % 2 === 0){
            even.push(el);
        }
        else{
            odd.push(el);
        }
    })*/

    const even = arr.filter(n => n%2===0);
    const odd = arr.filter(n => n%2===1);

    return {even: even, odd: odd};
}

//getting only the even
const evens = (obj) => obj.even;

//getting only the odd
const odd = (obj) => obj.odd;

//return max in an array
const maxValue = (arr) => {
    return arr.reduce((max, curr) => max > curr ? max : curr)
}

//return an object with the quantities of each element in an array
const tallyElements = (arr) => {
    const result = arr.reduce((tally, curr) => {
        if(tally[curr]) tally[curr]++;
        else tally[curr] = 1;

        return tally
    }, {})

    return result
}

//----------PRACTICING--------------------------------------------------------------------------
//an array of objects for testing purposes
const books = [
    {title: "Twilight",
    author: "S Meyer"
    },
    {title: "Harry Potter and the prisioner of Azkaban",
    author: "J K Rowling"
    },
    {title: "Breaking Dawn",
    author: "S Meyer"
    },
    {title: "Harry Potter and the goblet of fire",
    author: "J K Rowling"
    },
    {title: "Nordic Mithology",
    author: "N Gailman"
    }
    
]

//a function to tally books from the array above by author
const tallyBooksByAuthor = books.reduce((tally, curr) => {
    if(tally[curr.author]) tally[curr.author]++
    else tally[curr.author] = 1

    //another way to check if something exists, or create a new instance, and then add +1
    //tally[curr.author] = (tally[curr.author] || 0) + 1;

    return tally
}, {})

//a more generic function, to tally the objects in an array based on a given key
const tallyObjectsByKey = (arr, key) => {
    return arr.reduce((tally, curr) => {
        //if(tally[curr[key]]) tally[curr[key]]++
        //else tally[curr[key]] = 1

        tally[curr[key]] = (tally[curr[key]] || 0) + 1;
    
        return tally
    }, {})
} 

//group books by author and return an object with arrays that contain all books for each author
const grupBooksByAuthor = books.reduce((groupedBooks, book) => {
    const key = book.author;
    if(!groupedBooks[key]) groupedBooks[key] = []; //if there are no previous book of that author, create a new key with the author
    groupedBooks[key].push(book); //add the current book to the array of books that was created for that author
    
    return groupedBooks
}
, {})

//a more generic function, to group the objects in an array based on a given key
const groupObjectsByKey = (arr, key) => {
    return arr.reduce((groupedObj, curr) => {
        const currKey = curr[key];
        if(!groupedObj[currKey]) groupedObj[currKey] = [];
        groupedObj[currKey].push(curr); 
        
        return groupedObj
    }
    , {})
}