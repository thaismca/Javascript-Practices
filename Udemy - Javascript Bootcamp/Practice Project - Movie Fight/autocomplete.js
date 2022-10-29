//declaring a function to create a reusable autocomplete widget
//it receives a config object containing all the kind of custom functions that specify how autocompete should work for a given project
//dropdownRoot: the element where this dropdown will be inserted
//searchRequest: function to make a HTTP request that returns a list of options to be displayed, according to the search term,
//or an error message, if no results return from the search
//renderOption: function that knows how to render an option in the dropdown
//onOptionSelect: function that knows what should be done when a option is selected
//setInputValue: function to set what information must be displayed in the input when an option is selected
const createAutocomplete = ({dropdownRoot, searchRequest, renderOption, onOptionSelect, setInputValue}) => {
    //generation of HTML following the required structure for a dropdown using bulma to the js file
    //this allows a more independent code for a more reusable widget, that can be applied to any HTML file
    //the element where this dropdown will be inserted will be passed in the config object as dropdownRoot
    dropdownRoot.innerHTML = `
        <label><i class="fas fa-search"></i> Search</label>
        <input class="input" />
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results"></div>
            </div>
        </div>
    `;

    //select the elements from the autocomplete that we are going to need to work with 
    //instead of selecting from the entire document, search the elements inside the dropdownRoot
    const input = dropdownRoot.querySelector('.input');
    const dropdown = dropdownRoot.querySelector('.dropdown');
    const resultsWrapper = dropdownRoot.querySelector('.dropdown-content');

    //a function that can be called on user input
    //assign the function to a variable that will be passed as the second argument in the input EventListener
    const onInput = async (e) => {
        //if value in the search input is an empty string (to handle the case when user erases everything that was typed before)
        if(e.target.value === ''){
            dropdown.classList.remove('is-active');
            return;
        }
        
        //make an HTTP request according to what was defined in searchRequest
        const searchResults = await searchRequest(e.target.value);

        //make sure to clean any existing result list from a previous search request
        resultsWrapper.innerHTML = ""; 
        //make the dropdown visible by adding class is-active (from Bulma structure) to the element selected and stored in the const dropdown
        dropdown.classList.add('is-active');

        //if there's a message assigned to searchError, display the error message and don't execute anything else
        if(searchError){
            resultsWrapper.innerHTML = `<i> ${searchError} </i>`;
            return;
        }

        //iterate over the list of results of a successful search that came back from the request
        for(let result of searchResults) {
            //for every result that was fetched, create a anchor tag element
            //this tag must have the dropdown-item class applied for styling purposes (from Bulma structure)
            const listOption = document.createElement('a');
            listOption.classList.add('dropdown-item');
            //create option using the HTML returned from renderOption, passing the current item that we are at from the iterable
            listOption.innerHTML = renderOption(result);

            //add an event listener to the listOption to listen for a click on it (when user selects a option in the dropdown)
            listOption.addEventListener('click', async (e) => {
            //when the item is clicked
                //close the dropdown menu
                dropdown.classList.remove('is-active');
                //update the text inside the input to match the selection
                input.value = setInputValue(result);
                //call the function that was passed in the config that should be called when a option is selected
                //passing the current item that we are at from the iterable
                onOptionSelect(result);
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
}

//helper debounce function that receives a function in the arguments, to be used anywhere in the code where we want to introduce
//some rate limiting on how often this function can be invoked
//it also receives a delay argument, that represents the miliseconds to be passed in the setTimeout (default to 1000)
const debounce = (func, delay = 1000) => {
    //it will return a function that will implement a shield and guard how ofter func can actually be invoked
    //func might need to receive some arguments, so we need to make sure that if we ever pass any arguments to this wrapping function
    //they will be forward to func whenever it's called
    let timeoutId; //variable to keep track of the current timer identifier
    return (...args) => {
        //check if there is a timer from a previous input that is still pending
        if(timeoutId) {
            //if one is found, clearTimeout so func is never called
            clearTimeout(timeoutId);
        }
        //wait one second to run the function passed in the argument of debounce()
        //and assign the value that is returned from the setTimeout to the timeoutId variable
        timeoutId = setTimeout(() => {
            //call the function and take all the arguments or whatever is inside of the args array and pass them in
            //as separate arguments to the original function
            func.apply(null, args);
        }, delay);
    };
};