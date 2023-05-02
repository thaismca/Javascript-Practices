
# Practice Project - E-Commerce App

This projects implements an E-Commerce app.

### Project goal

Learn how to use Javascript to build a web server and show some dinamic HTML pages.

### Features

This e-commerce application allows:
  - users to view items and add them to the cart
  - administrators to log in and manage the items in the store

When public user visits the website:
  - show a list of different items (image, name, price) that they can purchase (add to cart button)
  - when user decides to checkout, display the list of items in the shopping cart
  - for each item in shoppin cart, show name, quantity, price per unit, total price, and option to remove from cart
  - display cart total and buy bitton at the bottom of the list
  - for now, buy button won't do anything -> billing is outside of the current scope

![home page user facing](https://github.com/thaismca/Javascript-Practices/blob/bc974fb4366dbd3496848393d12a7e95fca225f4/Udemy%20-%20Javascript%20Bootcamp/Practice%20Project%20-%20E-Commerce%20App/screenshots/index-user.PNG?raw=true)

![cart user facing](https://github.com/thaismca/Javascript-Practices/blob/bc974fb4366dbd3496848393d12a7e95fca225f4/Udemy%20-%20Javascript%20Bootcamp/Practice%20Project%20-%20E-Commerce%20App/screenshots/cart-user.PNG?raw=true)

When administrator visits the admin panel:
  - display sign in page
  - when user logs in, display the admin panel
  - the admin panel consists of a list of current items with edit and delete buttons for each item, and the option to create new ones
  - when admin clicks to edit or create new product, display a form to enter product name, price and upload an image
  - in order to be able to create new admin users, create a sign up page

![admin sign in page](https://github.com/thaismca/Javascript-Practices/blob/bc974fb4366dbd3496848393d12a7e95fca225f4/Udemy%20-%20Javascript%20Bootcamp/Practice%20Project%20-%20E-Commerce%20App/screenshots/admin-signin.PNG?raw=true)

![admin home page products lsiting](https://github.com/thaismca/Javascript-Practices/blob/bc974fb4366dbd3496848393d12a7e95fca225f4/Udemy%20-%20Javascript%20Bootcamp/Practice%20Project%20-%20E-Commerce%20App/screenshots/admin-products.PNG?raw=true)

## App Architecture

### Node.js web server

The server is configured to receive network requests. Each request is inspected to determine what resource the user is looking for. Then the HTML is generated and sent back over to the user's browser.

The key thing to understand here is that this project does not work with static HTML documents. The server is responsible for taking snippets of HTML, and then these snippets are assembled altogether every single time a user makes a request.

### File-based data store

Allows to store some amount of information related to the app (for instance, all the different items that are being sold, or the items that are currently in a person'r cart, or the users that have signed up as admin). Normally, some off the shelf or open source database would be used for that. But in this case, a custom file-based data store was built from scratch. Note that this is not a process that is commonly adopted inside of a typical professional project, but in this project this was the adopted approach, just to create an opportunity to learn a bit more about Javascript in general.

## Project setup

- Create a new project directory
- Generate package.json file
- Install a few dependencies to help with writing the project -> express and nodemon
- Create a 'start' script to run the project

### Dependencies
  - express: will be use to help with creating a web server
  - nodemon: development tool that will automatically restart the web server whenever there's a change in one of the project files

### Scripts
In the package.json file, create a script that is going to automatically start up the project.
  - name of the script -> dev
  - command that the script executes -> nodemon index.js
  - how to run the script from the command pront -> npm run dev ('run' is the keyword used to tell npm to execute some script defined in the script section of the package.json file)

## Project structure

### Routes

Directory that contains files with code related to route handlers.
  - Admin: subfolder that will contain files related to admin acess
	  - auth.js: code that deals with route handlers related to admin authentication
	  - products.js: code that deals with route handlers related to managing products information
  
  - products.js: code that deals with route handlers related to products from the perspecive of external users
  - cart.js: code that deals with route handlers related to cart from the perspecive of external users

### Repositories

Directory that contains all the different repositories.
   - users.js: administrators repository
   - products.js: products repository

### View
Directory that contains files with code related to generating HTML. 

#### HTML Templating

All HTML generation is placed into some different files inside of the Views directory, each one of these files being responsible for returning one little snippet of HTML. At every request, the snippets that serves the given request are added the body of a reusable layout, that contains all the HTML that can be shared across all pages of the application.
## Data Store

In this application, we have our Express Server interface with a Data Store. This Data Store stores a list of users who have created an account with our application, a list of shopping carts, and a list of products as well. The Data Store itself is going to save all its data to our hard drive in the form of JSON files:
- products.json file, that will store all the information about our products
- carts.json file, that will store all the different carts that were created in our application. 
- users.json file, that will store all the different users who have signed up to our application.

The Data Store for this project was implemented from scratch.

IMPORTANT NOTE: the Data Store that was implemented in this project is not suitable for production use! Here are some reasons why it's not reccomended to use a data store that saves information into the hard drive in production:
  - will error if we try to open/write to the same file twice at the same time;
  - won't work if we have multiple servers running on different machines, because they're all going to have their own version of a products.json and users.json files;
  - we have to write to the File System every time we want to update some data, so the performance of this will be relatively not that great.

Since the purpose of this project was to practice with Javascript coding, we took this approach for it allows us some really good practice. In particular, we are going to see a really good example of code reuse using classes and inheritance with object oriented programming.

#### DATA MODELLING APPROACH

The Data Store for this project takes the form of a couple of different individual classes, and each one managing its own collection of objects. Lumping all this into the term of Data Store is only from a conceptual standpoint. At the end of the day, we are going to have three separate objects for managing all those different resources (users, carts and products). We call these different separate objects REPOSITORIES.

In the world of web applications, there are two very popular approaches for managing data. The one we are using inside of this application is the Repository approach, where a single calss (repository) is responsible for data access to one type of resource. Each individual record is stored and used as plain JS object, that doesn't have any methods attached to it. In this scenario, a repository is responsible for all of our interaction with our data. Another approach would be one where every record is an instance of a 'model' class that has methods to interact with this record (save, update, delete).

So it's really a question in these two approaches of where we are locating all of our code. The repository approach ties all of our code to kind of a gatekeeper that governs access to our raw data. The other approach (commonly known as active record approach) keeps all of the code with each individual record and centers all the functionality around each individual record.

## Admin Authentication

In this project, the admin has the ability to create an account and sign in to manage the products available in the store.

### User sign up

Displaying the sign up form:
- handled as a GET request to /signup.
- displays a form where user can submit email, password and psswordConfirmation.

Signing up:
- handled as a POST request to /signup
- when a sign up form is submitted -> validate data -> create a new user

Signup validation logic is implemented as following:

- If another user already signed up with this email, show an error. Only one unique email will be allowed for each user.

- If password and password confirmation are different, show an error. Password confirmation must match the password.

- If no errors are encountered, create an account for the user.

- After the account is created, redirect to the login page.


#### COOKIE BASED AUTHENTICATION

The whole idea of signing up and signing into an application revolves around a server being able to identify who is making requests to it. There are technically several ways to handle authentication inside of a web application, but the vast majority of authentication work with cookies.

When the browser makes a request to the server, the server can optionally decide to include a cookie inside of the request. A cookie is a small string of characters that the server wants the browser to store and inlcude with every follow up request that is ever made to any server at the particular domain. When the browser then makes a request to that same domain, the browser is going to automatically include that small string of characters with the request that is being issued. And this cookie is the absolute core of the vast majority of authentication. It is what allows an application to identify users who are coming to it and making a series of requests.

When someone signs into the application, the server is going to compare the email and password that is being provided. If the email and password match an user account that is stored in the database, the server is then going to send a cookie down to the browser that contains in a very encrypted format some identifying token about the user who just signed in. Then, whenever the browser makes a follow up request to the server, it's going to include that cookie that has that little identifying piece of information inside of it. So the server can read that piece of information, see that the request is being made by a given user that holds that as an identifier, and then look up inside their data store and find the user that matches that identifying piece.

In this application, whenever an user is created in the Users Repository, we are going to store the id of that user inside of the user's cookie. Any time we receive a follow up request, we are going to look into the cookie, take the id that is inside of it and use that to identify the person who is making the request.

#### MANAGING THE COOKIE

Managing cookies in notoriously tricky. They are very complicated and easy to get wrong. We can very easily put in a mistake that exposes a lot of information about he users to malicious people. So, rather than takig all that liability on ourselves, we are going to instead use somebody else's library and have it do everything for us.

cookie-session is a simple cookie-based session middleware.
https://www.npmjs.com/package/cookie-session


### USER SIGN OUT

When a user logs out of the application:
- handled as a GET request to /signout.
- takes whatever the current session object is and 'forgets' it, by setting req.session to null.
- displays the Sign In form, so the user can access the application by logging back in.

### USER SIGN IN

Displaying the sign in form:
- handled as a GET request to /signin.
- display a form where user can submit email and password.

Signing in:
- handled as a POST request to /signin
- when a sign in form is submitted -> validate data -> authenticate user

Signin validation logic is implemented as following:

- If there's no account associated to the provided email, show an error. There must be an existing account for the email before trying to sign in using that email.

- If password provided in the form does not match the one saved in the user's record, show an error. Password provided in form must match the password in the database for the user with the provided email.

- If no errors are encountered, authenticate the user.

- When the user is finally authenticated, it must be redirected to the products index page, which is the central page of the admin panel.

#### PASSWORD SECURITY

**Implementing Salting + Hashing Passwords**

Where is the code that handles these security steps?
- UsersRepository class. There we have logic that adds the salt and run the whole generated string through the hash algorithm when creating a new user. And also a separate method to check to validate the password that the user provides when trying to sign in.

How the salt is generated?
- Using the crypto.randomBytes method, from the crypto module of the node.js standard library (same method we used to generate the user id).

How is the hashing process done?
- Using the crypto.scrypt method, from the crypto module of the node.js standard library. This function is named after a very specific password hashing algorithm scheme. It receives the following arguments:
  - the plain text password that we are trying to turn into a hash;
  - the salt;
  - the key length;
  - an options object (we are going to use the default values for all of the options);
  - callback function to be invoked once the function computes the hash.

The callback function is called with two arguments: err and derivedKey. err is an exception object when key derivation fails, otherwise err is null. derivedKey is passed to the callback as a Buffer.

NOTE: Having to be constrained by scrypt with its callback, because we want to store the hash with the rest of the user's data. The rest of the user generation code would need to go inside of this callback, and this is not ideal. To solve this, rather than using the default scrypt function, we can use a promisified version of it. In that way, we can safly use the async/await syntax and have the hash stored into a variable when the promise is resolved.

HOW? Promisify function, from from the utilities module of the node.js standard library.
## User-facing features

In this project, the user has the ability to perform the following actions:
- see a list of products
- click to add a product to the cart
- click to see a summary of all the products that are currently in the shopping cart
- remove a product from the shopping cart
- click to buy the products

NOTE: the buy action in this project will only show a success message and clear the cart

Handlers that were implemented:
- list all different products
- add item to cart
- display shopping cart
- remove product from cart
- buy items in the cart


### PRODUCTS LISTING

Displaying the list of products:
- It is handled as a GET request to '/'
- It is the central page of the project (landing page)
- Displays a list of the existing products, each entry containing product's name, price, image and a "add to cart" button.
- Displays a Cart button 

To display list of products:
- use getAll method to get a list of all the products in the products repository
- create a view that will list out all those different products (index)
- get this view to be displayed when a GET request is made to '/'

Clicking the Add to Cart button for a given product will add that product to the cart. Each product can be added multiple times, and that's accounted for in the cart total. Clicking the Cart will allow user to the the cart summary.


### SHOPPING CART

In this aplication, an user is able to add a product to the cart by clicking the "add to cart" button related to that given product. One thing about this application is that the user doesn't need to be autheticated in order to visit the products list and andd some of them to a cart (authentication covers only the admin panel side of this application).

***So how do we tie a cart to a person who will never be logged in?***

This uses a similar logic to the one that was implemented for user authentication. When a person clicks to add a product to the cart, a POST request will be made to our server. This request will contain the id of the item that the user wants to add. To take that product and associate with the user making the request, we're going generate some kind of representation of a shopping cart, assign it a random id, set that cart id inside the session cookie, and send the response to the person who made the request. Because we're string this cart id inside the cookie, every single thime this person with this browser makes a follow-up request to our application, we're always going to know exactly what cart is tied to that person - we are going to look in the cookie and see the cart id there.

***Even if we can identify who's trying to add an item to a cart, how do we tie the product to a cart?***

That's why there is a Carts Repository. Whenever an user attempts to add a product to a cart, if they don't have a cart already, we are going to generate one for them, which means we're going to essentially create a new record in the Carts Repository that's going to have a randomly assinged id and a products array. In this products array, we're going to store the id of the product as a reference that will point over to the products repository.


### ROUTE HANDLERS

#### ADD TO CART
- clicking the 'add to cart' button triggers a form submission
- handled as a POST request to '/cart/products'
- takes whatever item the user just clicked on and add it to a shopping cart

NOTE: each product card has a form in its footer, containing a hidden input with the product in the value property, and a 'add to cart' button that submits this form with a method of POST to "/cart/products". We can have access to the product id in the body of the POST request, so we know which product is being added to the shopping cart.

Scenarios to account for:
- check if user already has a cart -> if no, create one / if yes, retrieve the cart information from repository
- check if an instance of the item already exists in the cart -> if no, add one / if yes, increment quantity

#### DISPLAY CART
- clicking the 'cart' button redirects user to a list of products in the cart
- handled as a GET request to '/cart'
- each product has and option to 'remove from cart'
- at the bottom of the list of products, display cart total price

NOTE: in the course scope, the solution implemented when the user didn't have a cart was to redirect to the root index page when the user clicks the cart button. Since this was not a behaviour I was happy with, I decided to make it display an empty cart (we would need that eventually, if user gets to the point of removing all items from the cart. In order to do that, we'd need to repeat the check that was made for the 'add product' logic: check if user already has a cart -> if no, create one / if yes, retrieve the cart information from repository. It would be a duplicated block of code, so I created a function in the carts repository to encapsulate that behaviour.

Scenarios to account for:
- if card is empty, show a message saying that the cart is empty where the list of items should be.
- if there are items, display the list accordingly.

#### REMOVE FROM CART
- clicking the 'remove from cart' button for a given product triggers a form submission
- handled as a POST request to to '/cart/products/remove'
- takes whatever item the user just clicked on and remove it from the shopping cart
- after the product deletion, redirect back to display an updated cart

#### BUY ITEMS
NOTE: this functionality was not implemented in the course, I decided to add it myself
- clicking the 'buy' button in the cart triggers a form submission
- handled as a POST request to to '/cart/products/buy'
- displays a message coonfirming the purchase, a summary of the purchase and clear the user's cart

Scenarios to account for:
- if card is empty, continue to display the same page
