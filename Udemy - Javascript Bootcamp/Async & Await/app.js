//here's how we create a function that returns a promise
function add(x, y) {
    return new Promise((resolve, reject) => {
        if(typeof x !== 'number' || typeof y !== 'number')
         reject('X and Y must be numbers!');

        resolve (x + y);
    });
}


//async keyword is a shortcut syntax to make a function that returns a promise
async function multiply(x, y) {
    if(typeof x !== 'number' || typeof y !== 'number')
        throw 'X and Y must be numbers!'
    
    return x * y;
}

//both functions should still be called the same way
add(456, 'a')
.then((val) => {
    console.log(`Promise resolved with value: ${val}`);
})
.catch((err) => {
    console.log(`Promise rejected with error: ${err}`);
})

multiply(56, 89)
.then((val) => {
    console.log(`Promise resolved with value: ${val}`);
})
.catch((err) => {
    console.log(`Promise rejected with error: ${err}`);
})
