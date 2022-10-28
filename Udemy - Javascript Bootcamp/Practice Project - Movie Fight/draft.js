//file to store code that was first written to understand some concepts and that will end up being refactored in the app.js file
//so I can easily access older notes and implementations when studying
//NOTE: trying to actually use this script will cause errors

//------------------------------------------------------------------------------------------------------------------------------------------
//first implementation of the delayed search input
//this implementation was refactored in the app.js file to make a reusable debounce

//select the search input
const input = document.querySelector('input');

//a function that can be called on user input, that will delay the search so we don't send a HTTP request at every single typed character
//it will instead wait until the user stops typing for one second and then send a HTTP request -> setTimeout
//each time we call setTimeout we get back an integer value that represents an identifier for the timer that was just created
//we can call clearTimeout to stop the pending timer and preventing the function in the setTimeout from being called
//in order to do that, we need to keep track of the current timer identifier 
let timeoutId;
//assign the function to a variable that will be passed as the second argument in the input EventListener
const onInput = (e) => {
    //check if there is a timer from a previous input that is still pending
    if(timeoutId) {
        //if one is found, clearTimeout so the function is never called
        clearTimeout(timeoutId);
    }
    //wait one second to run the fetchData function, and assign the value that is returned from the setTimeout to the timeoutId variable
    timeoutId = setTimeout(() => {
        fetchData(e.target.value);
    }, 1000);
}
//we are going to be calling onInput many, many times in a row
//the very first time we call it (first character is typed), timeoutId will be undefined, so the if statement is going to be skipped
//setTimeout will be executed and a timer will be created to call fetchData after 1 second, and the timer id will be stored in timeoutId
//in the next keypress from the user that happens within the 1 second interval, timeoutId will be defined
//the block inside the if statement will be executed and the pending timer will be stopped
//a new timer will be set up, and will going to have a new value that is going to call fetchData with
//this process wil be repeated over and over again, until we eventually go for a full second before calling onInput again 
//this entire process is referred to as debouncing an input -> wait for some time to pass after the last event to actually do something

input.addEventListener('input', onInput);

//--------------------------------------------------------------------------------------------------------------------------------------------
//after debounce refactoring
//debounce can be applied in two different ways

//applied to the declaration of onInput - it means onInput will always be wrapped in debouce when invoked
const onInput = debounce((e) => {
    fetchData(e.target.value);
}, 500);
//select the search input and add the event listener
const input = document.querySelector('input');
input.addEventListener('input', onInput);

//applied when invoking onInput - it means onInput can be used with or without being wrapped in debounce
//it will only have debounce wrapper applied when called inside of a debounce invoking
const onInput = (e) => {
    fetchData(e.target.value);
};
//select the search input and add the event listener
const input = document.querySelector('input');
input.addEventListener('input', debounce(onInput, 500));

//--------------------------------------------------------------------------------------------------------------------------------------------
//autocomplete widget was supposed to be reusable
//this is how it was first implemented, before refactoring - all code touches everything!
//autocomplete has knowledge of what a movie object is and of what to show for each option
//autocomplete has knowledge of what to do when a movie is clicked
//many global variables refer to specific elements, making it reallt hard to show a second autocomplete on the screen

//CODE BEFORE REFACTORING
//moving the generation of HTML following the required structure for a dropdown using bulma to the js file
//this allows a more independent code for a more reusable widget, that can be applied to any HTML file
//requiring only one div existing in the HTML document where this HTML can be added to work, not the entire structure
//in this case, this one existing div in the HTML document must have an "autocomplete" class applied to it
const dropdownRoot = document.querySelector('.autocomplete');
dropdownRoot.innerHTML = `
    <label>Search for a movie</label>
    <input class="input" />
    <div class="dropdown">
        <div class="dropdown-menu">
          <div class="dropdown-content results">
          </div>
        </div>
      </div>
`;

//select the elements from the autocomplete that we are going to need to work with 
const input = document.querySelector('.input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.dropdown-content');


//a function that can be called on user input
//assign the function to a variable that will be passed as the second argument in the input EventListener
const onInput = async (e) => {
    //if value in the search input is an empty string (to handle the case when user erases everything that was typed before)
    if(e.target.value === ''){
        dropdown.classList.remove('is-active');
        return;
    }
    //store whatever returns from fetchData to a variable, using await because fetchData is async
    const movies = await searchRequest(e.target.value);
    console.log(movies)

    //make sure to clean any existing result list from a previous search request
    resultsWrapper.innerHTML = ""; 
    //make the dropdown visible by adding class is-active (from Bulma structure) to the element selected and stored in the const dropdown
    dropdown.classList.add('is-active');

    //if there's an Error property in the movies object, display the error message and don't execute anything else
    if(movies.Error){
        resultsWrapper.innerHTML = `<i>${movies.Error}</i>`
        return;
    }

    //iterate over the list of movies that came back from the request
    for(let movie of movies) {
        //for every movie that was fetched, create a anchor tag element that sumarizes the movie (poster image and string with title + year)
        //this tag must have the dropdown-item class applied for styling purposes (from Bulma structure)
        const listOption = document.createElement('a');
        listOption.classList.add('dropdown-item');

        //some movies from the API don't have a link to the image in the Poster property, they have the string 'N/A' instead
        //handle so there are no broken references in our list if the movie doesn't actually have a poster
        const imgSrc = movie.Poster === 'N/A' ? "img/no-poster.jpg" : movie.Poster;

        listOption.innerHTML = `
            <img src="${imgSrc}" />
            ${movie.Title} (${movie.Year})
        `;

        //add an event listener to the listOption to listen for a click on it (when user selects a movie in the dropdown)
        listOption.addEventListener('click', async (e) => {
        //when the item is clicked
            //close the dropdown menu
            dropdown.classList.remove('is-active');
            //update the text inside the input to match the selection
            input.value = `${movie.Title} (${movie.Year})`;
            //make follow up request for movie details
            const movieDetail = await movieRequest(movie);
            //use the helper function to create the HTML using the movie template and add this to the HTML document
            document.querySelector('#summary').innerHTML = movieTemplate(movieDetail); 
        });

        //append this new anchor tag that represents a list option that can be selected in the dropdown to the resultsWrapper
        resultsWrapper.appendChild(listOption);
    }
};

//add the event listener to the selected input
//wrap the onInput function into the debounce helper function, with a delay of 500 miliseconds
input.addEventListener('input', debounce(onInput, 500));

//close the menu when the user clicks anywhere in the page, except the autocomplete widget
//add an event listener to the entire document to listen for a click
document.addEventListener('click', (e) =>{
    //check if the event target happened in any element inside of dropdownRoot 
    if(e.target.contains(dropdownRoot)){
        dropdown.classList.remove('is-active');
    }
});


