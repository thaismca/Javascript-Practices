//---------- DATA ----------
const CREDITCARD_TYPES = ['Visa', 'Mastercard', 'AMEX']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const NOW = new Date(Date.now());

//---------- GENERAL FUNCTIONS ----------
//remove all spaces in strings
function removeSpaces(str){
    return str = str.replaceAll(' ', '')
}

//accept only numeric inputs
const isNumericInput = (event) => {
    const key = event.keyCode;
    if(!event.shiftKey) //don't allow input while holding shift
    return ((key >= 48 && key <= 57) || // Allow number line
        (key >= 96 && key <= 105) // Allow number pad
    );
}

//accept only some modifier keys
const isModifierKey = (event) => {
    const key = event.keyCode;
    if(!event.shiftKey) //don't allow input while holding shift
    return (key === 8 || key === 9 || key === 13 || key === 46) || // Allow Backspace, Tab, Enter, Delete
        (key >= 37 && key <= 40) // Allow left, up, right, down
}

const isNameValidInput = (event) => {
    const key = event.keyCode;
    let test;
    if(event.shiftKey !== true)
        return ((key >= 97 && key <= 122) || // Allow letters
            (key === 45 || key ===32)) // Allow hifen and space   
    else 
        return (key >= 65 && key <= 90) // Allow letters while shift is pressed
}

//Functions to populate the selection dropdowns
//first default element that can be applied to all drop down selections
function defaultSelection(select){
    const option = document.createElement('option');
    option.setAttribute('disabled', '');
    option.setAttribute('selected', '');
    option.value = removeSpaces(select.name).toLowerCase();
    option.innerText = select.name;
    select.appendChild(option);
}
//when elements come from array elements
function populateSelection(arr, select){
    defaultSelection(select);

    for(el of arr){
        const option = document.createElement('option');
        option.value = removeSpaces(el).toLowerCase();
        option.innerText = el;
        select.appendChild(option);
    }
}

//---------- FORM DATA ----------
const formData = {};

//---------- INPUTS IN THE PAGE ----------

const cardTypeInput = document.querySelector('#cardType');
const cardNumberInput = document.querySelector('#cardNumber');
const cardNameInput = document.querySelector('#cardName');
const cardMonthInput = document.querySelector('#cardMonth');
const cardYearInput = document.querySelector('#cardYear');
const cvvInput = document.querySelector('#cvv');

//---------- DROP DOWN SELECTIONS ----------
//populating credit card types drop down
populateSelection(CREDITCARD_TYPES, cardTypeInput);
//populating months drop down
populateSelection(MONTHS, cardMonthInput);
//populating years drop down
defaultSelection(cardYearInput);
//add 10 years counting from the current year
currYear = NOW.getFullYear();
for(i=0; i<10; i++){
    const option = document.createElement('option');
    option.value = currYear + i;
    option.innerText = currYear + i;
    cardYearInput.appendChild(option);
}


//---------- CREDIT CARD TYPE - CHECK SELECTION ----------
cardTypeInput.addEventListener('input', (e) =>{
    //populate formData object
    let selectedType = cardTypeInput.value;
    formData['cardType'] = selectedType;

    //make sure all inputs are enabled and 
    //the form is clear whenever a card type is selected
    cardNumberInput.removeAttribute('disabled');
    cardNumberInput.value = '';
    cardNameInput.removeAttribute('disabled');
    cardNameInput.value = '';
    cardMonthInput.removeAttribute('disabled');
    cardMonthInput.value = 'month'
    cardYearInput.removeAttribute('disabled');
    cardYearInput.value = 'year'
    cvvInput.removeAttribute('disabled')
    cvvInput.value = ''

    //Card number and cvv input format based on card type
    if(selectedType === 'amex'){
        cardNumberInput.setAttribute('maxlength', '15');
        cvv.setAttribute('maxlength', '4');
    }else {
        cardNumberInput.setAttribute('maxlength', '16');
        cvv.setAttribute('maxlength', '3');
    }
});

//---------- CREDIT CARD NUMBER - CHECK INPUT ----------
//only register numeric inputs
cardNumberInput.addEventListener('keydown', (e) => {
    console.log(e.keyCode)
    if(!isNumericInput(e) && !isModifierKey(e)) e.preventDefault();
    });
//populate formData object
cardNumberInput.addEventListener('input', (e) =>{
    formData['cardNumber'] = e.target.value;  
});

//---------- CREDIT CARD NAME - CHECK INPUT ----------
//only register numeric inputs
cardNameInput.addEventListener('keypress', (e) => {
    console.log(e.keyCode)
    if(!isNameValidInput(e) && !isModifierKey(e)) e.preventDefault();
    });
//populate formData object
cardNameInput.addEventListener('input', (e) =>{
    e.target.value = e.target.value.toUpperCase();
    formData['cardName'] = e.target.value;  
});

