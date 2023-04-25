//axios is an external library to make HTTP requests that uses fetch behind the scenes,
//but makes it easier and results in a cleaner code

//performing a GET request
axios.get('http://swapi.dev/api/planets')
.then((response) => {
    //if you take a look at the response that comes back when the promise is resolved, 
    //you'll notice taht there's no more need to parse it using .json()
    console.log(response);

    //from this point on, you can play around with this data and display whatever you want from this object in the page
    const list = document.createElement('ul');
    for(let planet of response.data.results){
        const listItem = document.createElement('li');
        listItem.innerText = planet.name;
        list.appendChild(listItem);
    }
    document.body.appendChild(list);
})
//also, there's no need to throw error if status from the response is not ok
//it will already be rejected and handled in the .catch
.catch((err) =>{
    console.log('SOMETHING WENT WRONG');
    console.log(err);

    const errorMessage = document.createElement('p');
    errorMessage.innerText = `Something went wrong! ${err}`;
    document.body.appendChild(errorMessage);
});

//----------------------------------------------------------------------------------------------------------------------------------
//chaining requests using axios

//performing a GET request
axios.get('http://swapi.dev/api/planets')
.then(({data}) => { //deconstruct data that comes in the .then response

    console.log('FETCHED FIRST 10 PLANETS');
    //get whatever data that has another url that can be passed in a subsequent request
    //in  this case, getting the data from the first film from the first planet
    const filmUrl = data.results[0].films[0];
    
    //we have a new promise that can be returned from a fetch method being called passing the filmUrl
    //so we can chain another .then that would depend on that response without nesting
    return axios.get(filmUrl);
})
.then(({data}) => { //deconstruct data that comes in the .then response
    console.log('FETCHED FIRST FILM, based off of first planet');
    //from this point on, you can play around with this data and display whatever you want from this object in the page
    //in this case, just going to display the title property of the object in the console
    console.log(data.title);
})
//also, there's no need to throw error if status from the response is not ok
//it will already be rejected and handled in the .catch
.catch((err) =>{
    console.log('SOMETHING WENT WRONG');
    console.log(err);

    const errorMessage = document.createElement('p');
    errorMessage.innerText = `Something went wrong! ${err}`;
    document.body.appendChild(errorMessage);
});

//-----------------------------------------------------------------------------------------------------------------------------------
//refactoring previous axios request and changing to include more planets loaded from next pages of results

//a function to make a get request using axios that receives an url in the parameter
//and returns a promise that resolves to the Response to that request
const fetchNextPlanets = (url) => {
    return axios.get(url)
}

//a function to print out the names of the planets
const printPlanetNames = ({data}) => {
    for(let planet of data.results){
        console.log(planet.name);
    }

    //solely print planet names does not return a promise, so I can't chain another .then afterwards
    //need to include a resolved promise to be returned and used in the following request
    //since what I want is the url in data.next, this is what I'll return in this resolved promise
    return Promise.resolve(data.next);
}

axios.get('http://swapi.dev/api/planets')
.then(printPlanetNames)
.then(fetchNextPlanets)
.then(printPlanetNames)
.then(fetchNextPlanets)
//can repeat this for as long as there are pages left
//different from using JS built-in fetch, we don't need a method to check status and parse the ReadableStream of the body contents

//this runs when promise is rejected or when throwing an error
.catch((err) =>{
    console.log('SOMETHING WENT WRONG WITH FETCH');
    console.log(err);
    const errorMessage = document.createElement('p');
    errorMessage.innerText = `Something went wrong! ${err}`;
    document.body.appendChild(errorMessage);
})