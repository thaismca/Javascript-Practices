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


