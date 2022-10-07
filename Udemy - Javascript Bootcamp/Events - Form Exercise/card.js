//---------- DATA ----------
const CREDITCARD_TYPES = ['Visa', 'Mastercard', 'AMEX'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const NOW = new Date(Date.now());

//---------- GENERAL FUNCTIONS ----------
//remove all spaces in strings
function removeSpaces(str){
    return str = str.replaceAll(' ', '')
};

//function to reset an object deleting all its properties and methods
const resetObj = (obj) => {
    for (const key in obj) {
        delete obj[key];
      }
}

//clear disabled state from months
const resetMonthsSelection = (select) => {
    for(i=1; i<= 12; i++)
        select[i].disabled = false;
};

//accept only numeric inputs
const isNumericInput = (event) => {
    const key = event.keyCode;
    if(!event.shiftKey) //don't allow input while holding shift
    return ((key >= 48 && key <= 57) || // Allow number line
        (key >= 96 && key <= 105) // Allow number pad
    )
};

//accept only some modifier keys
const isModifierKey = (event) => {
    const key = event.keyCode;
    if(!event.shiftKey) //don't allow input while holding shift
    return (key === 8 || key === 9 || key === 13 || key === 46) || // Allow Backspace, Tab, Enter, Delete
        (key >= 37 && key <= 40) // Allow left, up, right, down
};

//accept only letter inputs
const isNameValidInput = (event) => {
    const key = event.keyCode;
    let test;
    if(event.shiftKey !== true)
        return ((key >= 97 && key <= 122) || // Allow letters
            (key === 45 || key ===32)) // Allow hifen and space   
    else 
        return (key >= 65 && key <= 90) // Allow letters while shift is pressed
};

//Functions to populate the selection dropdowns
//first default element that can be applied to all drop down selections
function defaultSelection(select){
    const option = document.createElement('option');
    option.setAttribute('disabled', '');
    option.setAttribute('selected', '');
    option.value = removeSpaces(select.name).toLowerCase();
    option.innerText = select.name;
    select.appendChild(option);
};
//when elements data come from an array
function populateSelection(arr, select){
    defaultSelection(select);

    for(el of arr){
        const option = document.createElement('option');
        option.value = removeSpaces(el).toLowerCase();
        option.innerText = el;
        select.appendChild(option);
    }
};

//---------- FORM DATA ----------
const formData = {};

//---------- SELECT ELEMENTS IN THE PAGE ----------
//form inputs
const cardTypeInput = document.querySelector('#card-type-input');
const cardNumberInput = document.querySelector('#card-number-input');
const cardNameInput = document.querySelector('#card-name-input');
const cardMonthInput = document.querySelector('#card-month-input');
const cardYearInput = document.querySelector('#card-year-input');
const cvvInput = document.querySelector('#cvv-input');

//card representation elements
const logo = document.querySelector('#type-logo');

//card front and back
const cardFront = document.querySelector('#card-front');
const cardBack = document.querySelector('#card-back');

//---------- DROP DOWN SELECTIONS ----------
//populating credit card types drop down
populateSelection(CREDITCARD_TYPES, cardTypeInput);
//populating months drop down
populateSelection(MONTHS, cardMonthInput);
//populating years drop down
//adding 10 years counting from the current year
defaultSelection(cardYearInput);
currYear = NOW.getFullYear();
for(i=0; i<10; i++){
    const option = document.createElement('option');
    option.value = currYear + i;
    option.innerText = currYear + i;
    cardYearInput.appendChild(option);
}

//---------- CREDIT CARD TYPE INPUT ----------
cardTypeInput.addEventListener('input', (e) =>{
    //clear formData object whenever a new selection for this input is made
    resetObj(formData);
    //populate cardType in formData object
    let selectedType = e.target.value;
    formData['cardType'] = selectedType;

    //make sure all inputs are enabled and 
    //the form is clear whenever a card type is selected
    cardNumberInput.removeAttribute('disabled');
    cardNumberInput.value = '';
    cardNameInput.removeAttribute('disabled');
    cardNameInput.value = '';
    cardMonthInput.removeAttribute('disabled');
    cardMonthInput.value = 'month';
    resetMonthsSelection(cardMonthInput);
    cardYearInput.removeAttribute('disabled');
    cardYearInput.value = 'year';
    cvvInput.removeAttribute('disabled');
    cvvInput.value = '';

    //make sure card representation reflects the form reset
    displayCardName();
    displayCardMonth();
    displayCardYear();
    resetAllCvvDisplay();

    //Card logo, card number and cvv input format based on card type
    logo.setAttribute('src', `img/${selectedType}.png`);

    if(selectedType === 'amex'){
        cardNumberInput.setAttribute('maxlength', '15');
        cvvInput.setAttribute('maxlength', '4');
    }else {
        cardNumberInput.setAttribute('maxlength', '16');
        cvvInput.setAttribute('maxlength', '3');
    }
});

//---------- CREDIT CARD NUMBER INPUT ----------
//only register numeric inputs
cardNumberInput.addEventListener('keydown', (e) => {
    if(!isNumericInput(e) && !isModifierKey(e)) e.preventDefault();
});

cardNumberInput.addEventListener('input', (e) =>{
    //populate cardNumber in formData object
    formData['cardNumber'] = e.target.value;  


});

//---------- CREDIT CARD NAME INPUT ----------
//only register name valid inputs
cardNameInput.addEventListener('keypress', (e) => {
    if(!isNameValidInput(e) && !isModifierKey(e)) e.preventDefault();
});

cardNameInput.addEventListener('input', (e) => {
    //change to uppercase when typing
    e.target.value = e.target.value.toUpperCase();
    //populate cardName in formData object
    formData['cardName'] = e.target.value.trim();

    //change name in card representation
    displayCardName(); 
});

//change name in card representation
const displayCardName = () => {
    let name = document.querySelector('#card-name');
    name.innerText = !cardNameInput.value ? 'FULL NAME' : cardNameInput.value;
} 

//---------- EXIPIRY DATE INPUTS----------
//year selection input
cardYearInput.addEventListener('input', (e) => {
    let selectedYear = e.target.value;
    //runs when selected year equals the current year
    if(parseInt(selectedYear) === NOW.getFullYear()){
        //check selected month and force new selection if already passed in the current year
        if(parseInt(cardMonthInput.selectedIndex) <= NOW.getMonth()){
            cardMonthInput.value = 'month';
            //change month in card representation
            displayCardMonth();
            //remove cardMonth from formData object
            if (formData['cardMonth']) delete formData['cardMonth']
        }    
        //disable all month options that already passed in the current year
        for(i=0; i<= NOW.getMonth(); i++){
            cardMonthInput[i].disabled = true;
        }
    }
    //runs when selected year is not equal the current year
    else {
        //remove disabled state from a possible previous selection of the current year for this input
        resetMonthsSelection(cardMonthInput);
    }

    //populate cardYear in formData object
    formData['cardYear'] = selectedYear;
    //change year in card representation
    displayCardYear();
});

//month selection input
cardMonthInput.addEventListener('input', (e) => {
    let selectedMonth = e.target.value;

    //populate cardMonth in formData object
    formData['cardMonth'] = selectedMonth;
    //change month in card representation
    displayCardMonth();

});

//change year in card representation
const displayCardYear = () => {
    let year = document.querySelector('#card-date-year');
    year.innerText = (cardYearInput.value === 'year') ? 'YY' : `${cardYearInput.value.slice(2)}`;
} 

//change month in card representation
const displayCardMonth = () => {
    let month = document.querySelector('#card-date-month');
    //make sure it's always two digits
    let monthString = ('0' + cardMonthInput.selectedIndex).slice(-2);
    month.innerText = (cardMonthInput.value === 'month') ? 'MM/' : `${monthString}/`;
}

//---------- CVV INPUT ----------
//only register numeric inputs
cvvInput.addEventListener('keydown', (e) => {
    if(!isNumericInput(e) && !isModifierKey(e)) e.preventDefault();
});

cvvInput.addEventListener('input', (e) =>{
    //populate cvv in formData object
    formData['cvv'] = e.target.value;
    //change cvv in card representation
    displayCardCvv();
});

cvvInput.addEventListener('focus', (e) => {
    if(cardTypeInput.value !== 'amex'){
        cardFront.setAttribute('hidden', '');
        cardBack.removeAttribute('hidden');
    }
});

cvvInput.addEventListener('blur', (e) => {
    cardFront.removeAttribute('hidden');
    cardBack.setAttribute('hidden', '');
});

//change cvv in card representation
const displayCardCvv = () => {
    let cvvPlacement = document.querySelector(`.cvv-${cardTypeInput.value}`);
    let maskedCvv = '';
    for(char of cvvInput.value){
        maskedCvv += '*'
    }
    cvvPlacement.innerText = maskedCvv; 
}

//reset cvv for when a new card type is selected
const resetAllCvvDisplay = () => {
    let cvv = document.querySelectorAll('.cvv');
    for(el of cvv) {
        el.innerText = '';
    }
    
}

