//handling form submission
document.querySelector('form').addEventListener('submit', (e) => {
    //prevent the form submission to a backend server
    e.preventDefault();

    //get a reference to the input where the message is typed
    const messageInput = document.querySelector('#message-input');
    //use btoa() to encode the message
    const encoded = btoa(messageInput.value);

    //get a reference for the input where the link is displayed
    const linkInput = document.querySelector('#link-input');

    //set its value a string formed by the current window.location + the encoded string as the hash part of the URL
    linkInput.value = `${window.location}#${encoded}`;
    //automatically select the text so the user can easily copy it to the clipboard
    linkInput.select();
    
});