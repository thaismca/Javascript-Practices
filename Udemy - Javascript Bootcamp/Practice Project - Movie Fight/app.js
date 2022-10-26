//helper function to make HTTP request
const fetchData = async (searchTerm) => {
    //axios.get can receive an object with parameters in the arguments, to create a query string that will be added to the request url
    const response = await axios.get('http://www.omdbapi.com/', {
        //according to the API documentation, the apikey and a string s corresponding to a movie title to search for
        //are the required parameters to make a request using the By Search endpoint
        params: {
            apikey: '44e448f2',
            s: searchTerm
        }
    });

    console.log(response.data);
};

//a function that can be called on user input
//assign the function to a variable that will be passed as the second argument in the input EventListener
const onInput = (e) => {
    fetchData(e.target.value);
};

//select the search input and add the event listener
const input = document.querySelector('input');
//wrap the onInput function into the debounce helper function, with a delay of 500 miliseconds
input.addEventListener('input', debounce(onInput, 500));


