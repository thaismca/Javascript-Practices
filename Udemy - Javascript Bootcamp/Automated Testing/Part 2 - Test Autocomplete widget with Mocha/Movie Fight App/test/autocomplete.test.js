//set up the environment before each test
beforeEach(() => {
    //make sure that any possible existing autocomplete widget from previous tests is deleted
    document.querySelector('#target').innerHTML='';
    //create an instance of a autocomplete widget to be tested
    createAutoComplete({
        root: document.querySelector('#target'),
        fetchData() {
            //fake data for the sake of testing
            return [
                { Title: 'Avengers' },
                { Title: 'Harry Potter' },
                { Title: 'Star Wars' }
            ];
        },
        renderOption(movie) {
            return movie.Title;
        }
    });
});

//helper function to delay test until a given element is displayed on the screen
const waitFor = (selector) => {
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            if (document.querySelector(selector)) {
                //clear interval and timeout
                clearInterval(interval);
                clearTimeout(timeout);
                //resolve promisse if element with the given selector is found
                resolve();
            }
        }, 30);
        const timeout = setTimeout(() => {
            if (!document.querySelector(selector)) {
                //clear interval
                clearInterval(interval);
                //reject promisse if element with the given selector is not found within 3 seconds
                reject();
            }
        }, 3000);
    }); 
}

//test dropdown state - it should be hidden when widget is first displayed
it('Autocomplete dropdown in closed state at start', () => {
    //get a reference to the dropdown element
    const dropdown = document.querySelector('.dropdown');
    //check if className includes 'is-active'
    expect(dropdown.className).not.to.include('is-active');
});

//test dropdown state after search - it should be displayed when user types in the input
it('Dropdown in active state after search', async () => {
    //get a reference to the autocomplete text input element
    const input = document.querySelector('input');
    //set a value to the autocomplete text input
    input.value = 'testing';
    //get a fake input event to be triggered in the autocomplete text input
    input.dispatchEvent(new Event('input'));

    //delay assertion until there's a dropdown-item to be found in the document, or timeout
    await waitFor('.dropdown-item');

    //get a reference to the dropdown element
    const dropdown = document.querySelector('.dropdown');
    //check if className includes 'is-active'
    expect(dropdown.className).to.include('is-active');

});

//test number of displayed results - it should be match the number of items returned from fetchData
it('Number of results displayed matches data fetched', async () => {
    //get a reference to the autocomplete text input element
    const input = document.querySelector('input');
    //set a value to the autocomplete text input
    input.value = 'testing';
    //get a fake input event to be triggered in the autocomplete text input
    input.dispatchEvent(new Event('input'));

    //delay assertion until there's a dropdown-item to be found in the document, or timeout
    await waitFor('.dropdown-item');

    //get a reference to all dropdown-item elements
    const items = document.querySelectorAll('.dropdown-item');
    //check if number of elements in dropdownItems match number of elements returned from fetchData (3)
    expect(items.length).to.equal(3);
});