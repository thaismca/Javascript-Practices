//The fetch() method takes one mandatory argument, the path to the resource you want to fetch.
//It returns a Promise that resolves to the Response to that request — as soon as the server responds with headers
//even if the server response is an HTTP error status.
//It will only reject on network failure or if anything prevented the request from completing.

fetch('http://swapi.dev/api/planets')
    .then((response) => {
        //since the Promise returned from fetch() won't reject on HTTP error status even if the response is an HTTP 404 or 500,
        //we need to throw an error if the status of this response is not ok
        if(!response.ok) throw new Error(`Status Code - ${response.status}`);
        //throwing an error will force the .catch to run, otherwise the execution continues inside the .then

        //The Response interface of the Fetch API represents the response to a request.
        //The body read-only property of the Response interface is a ReadableStream of the body contents. (response.body)

        //The json() method of the Response interface takes a Response stream and reads it to completion.
        //It also returns a promise which resolves with the result of parsing the body text as JSON.

        response.json().then((data) =>{
            console.log('FETCH SUCESSFUL')
            //from this point on, you can play around with this data and display whatever you want from this object in the page
            const list = document.createElement('ul');
            for (let item of data.results) {
                const listItem = document.createElement('li');
                listItem.innerText = item.name;
                list.appendChild(listItem);
            }
            document.body.appendChild(list);
        });
    })
    //this runs when promise is rejected or when throwing an error
    .catch((err) =>{
        console.log('SOMETHING WENT WRONG WITH FETCH');
        console.log(err);
        const errorMessage = document.createElement('p');
        errorMessage.innerText = `Something went wrong! ${err}`;
        document.body.appendChild(errorMessage);
    });

    //----------------------------------------------------------------------------------------------------------------------------------
    //chaining fetch requests
    fetch('http://swapi.dev/api/planets')
    .then((response) => {
        if(!response.ok) throw new Error(`Status Code - ${response.status}`);
        //since a new promise is returned from response.json, we can return it from this first request
        //and chain another .then that would depend on that response without nesting
        return response.json();
    })
    .then((data) =>{
        console.log('FETCHED FIRST 10 PLANETS');
        //get whatever data that has another url that can be passed in a subsequent request
        //in  this case, getting the data from the first film from the first planet
        const filmUrl = data.results[0].films[0];
        
        //we have a new promise that can be returned from a fetch method being called passing the filmUrl
        //so we can chain another .then that would depend on that response without nesting
        return fetch(filmUrl); 
    })
    .then((response) => {
        //repeating this code here, just so we can see what needs to happen (will refactor later)
        if(!response.ok) throw new Error(`Status Code - ${response.status}`);

        //again, a new promise is returned from response.json
        return response.json();
    })
    .then((data => {
        console.log('FETCHED FIRST FILM, based off of first planet');
        //from this point on, you can play around with this data and display whatever you want from this object in the page
        //in this case, just going to display the title property of the object in the console
        console.log(data.title);
    }))
    //this runs when promise is rejected or when throwing an error
    .catch((err) =>{
        console.log('SOMETHING WENT WRONG WITH FETCH');
        console.log(err);
        const errorMessage = document.createElement('p');
        errorMessage.innerText = `Something went wrong! ${err}`;
        document.body.appendChild(errorMessage);
    });