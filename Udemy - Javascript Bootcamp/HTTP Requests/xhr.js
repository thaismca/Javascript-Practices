//create a new XHR
const firstReq = new XMLHttpRequest();

//a function to run when the request returns a successful load event (valid request)
firstReq.addEventListener('load', function() {
    console.log('IT WORKED!');
    //get the text that it's returned from the request (JSON) and parse that into JavaScript
    const data = JSON.parse(this.responseText);
    //from this point on, you can play around with this data and display whatever you want from this object in the page
    const list = document.createElement('ul');
    for (let item of data.results) {
        const listItem = document.createElement('li');
        listItem.innerText = item.name;
        list.appendChild(listItem);
    }
    document.body.appendChild(list);
});
//a function to run when the request returns an error event (not valid request)
firstReq.addEventListener('error', function() {
    console.log('ERROR');
    const errorMessage = document.createElement('p');
    errorMessage.innerText = 'Data not found!'
    document.body.appendChild(errorMessage);
});


//here's how the request is actually made
//valid
firstReq.open('GET', 'http://swapi.dev/api/planets');
firstReq.send();
//just to display a message when the request is sent, to demonstrate that this is async
console.log('Request sent');

//not valid
//firstReq.open('GET', 'http://swapicvf.dev/api/planets');
//firstReq.send();
//console.log('Request sent');

//---------------------------------------------------------------------------------------------------------------------------

//create a new XHR to demonstrate how to chain xhr
//it gets messy because you cannot work with promises
const secondReq = new XMLHttpRequest();

//a function to run when the request returns a successful load event (valid request)
secondReq.addEventListener('load', function() {
    console.log('OUTTER REQUEST WORKED!');
    //get the text that it's returned from the request (JSON) and parse that into JavaScript
    const data = JSON.parse(this.responseText);

    //get whatever data that has another url taht can be passed in a subsequent request
    //in  this case, getting the data from the first film from the first planet
    const filmUrl = data.results[0].films[0];
    
    //create another xrh to be called after data is returned from the first one
    const filmReq = new XMLHttpRequest();
    //a function to run when the inner request returns a successful load event (valid request)
    filmReq.addEventListener('load', function () {
        console.log('INNER REQUEST WORKED!');
        //get the text that it's returned from the request (JSON) and parse that into JavaScript
        const filmData = JSON.parse(this.responseText);

        //from this point on, you can play around with this data and display whatever you want from this object in the page
        //in this case, just going to display the object in the console
        console.log(filmData);
    });
    //since we cannot work with promises, we need to also create the nested callback that will run if the request fails
    //and returns an error event (not valid request)
    filmReq.addEventListener('error', function(e) {
        console.log('ERROR', e);
    });

    //this inner request needs to be called inside if the first one
    filmReq.open('GET', filmUrl);
    filmReq.send();
});

//a function to run when the request returns an error event (not valid request)
firstReq.addEventListener('error', function() {
    console.log('ERROR');
    const errorMessage = document.createElement('p');
    errorMessage.innerText = 'Data not found!'
    document.body.appendChild(errorMessage);
});


//here's how the request is actually made
//valid
secondReq.open('GET', 'http://swapi.dev/api/planets');
secondReq.send();
//just to display a message when the request is sent, to demonstrate that this is async
console.log('Request sent');

//not valid
//secondReq.open('GET', 'http://swapicvf.dev/api/planets');
//secondReq.send();
//console.log('Request sent');