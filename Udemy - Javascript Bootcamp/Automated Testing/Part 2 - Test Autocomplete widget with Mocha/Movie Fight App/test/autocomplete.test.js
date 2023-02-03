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

//test dropdown state - it should be hidden when widget is first displayed
it('Autocomplete dropdown in closed state at start', () => {
    //get a reference to the dropdown element
    const dropdown = document.querySelector('.dropdown');
    //check if className includes 'is-active'
    expect(dropdown.className).not.to.include('is-active');
});