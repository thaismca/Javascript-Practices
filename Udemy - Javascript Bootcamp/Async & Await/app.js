//-----THE ASYNC KEYWORD ----------------------------------------------------------------------------------------------------
//here's how we create a function that returns a promise using what we learned so far
function add(x, y) {
    return new Promise((resolve, reject) => {
        if(typeof x !== 'number' || typeof y !== 'number')
         reject('X and Y must be numbers!');

        resolve (x + y);
    });
}

//the async keyword is a shortcut syntax to make a function that returns a promise
async function multiply(x, y) {
    if(typeof x !== 'number' || typeof y !== 'number')
        //it's goint to be either rejected with an error (throw)
        throw 'X and Y must be numbers!'

    //or resolved with a value (return)
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

//----------------------------------------------------------------------------------------------------------------------------
//-----THE AWAIT KEYWORD -----------------------------------------------------------------------------------------------------
//without async/await
function getPlanets(url = 'http://swapi.dev/api/planets') {
    axios.get(url).then((response) => {
        console.log(response.data);
    });
}

//using async/await
async function getPlanetsAsync(url = 'http://swapi.dev/api/planets') {
    const response = await axios.get(url); //await keyword is reserved to only be used inside of a async function
    //this next line will only run after the promise is resolved
    console.log(response.data);
}

//both functions should still be called the same way
getPlanets();
getPlanetsAsync();

//handling errors
//can do by attaching a .catch to the function call
getPlanetsAsync('http://swapi.dev/api/planets123').catch((err) => {
    console.log('IN CATCH!', err.message);
});

//could also handle the error by using a try/catch inside the async function
async function getPlanetsTryCatch(url = 'http://swapi.dev/api/planets') {
    try {
        const response = await axios.get(url); //await keyword is reserved to only be used inside of a async function
    //this next line will only run after the promise is resolved
    console.log(response.data);
    }
    catch(e) {
        console.log('IN CATCH!!', e.message);
    }   
}

getPlanetsTryCatch('http://swapi.dev/api/planets123');

//when it's only one function being called, using either method makes no difference, but when we have multiple
//chained requests, they will have different benefits - attaching the catch would make it easier because you can
//use only one to catch all (same as we saw before with chained promises), try/catch makes it possible to give a 
//more persnalized handling for rejection in each promise