//get access to the express package inside of this file
const express = require('express');
//get access to the multer package inside of this file
const multer = require('multer');

//require an instance of the ProductsRepository class
const productsRepo = require('../../repositories/products');

//get access to views from other files in this project
const productNewTemplate = require('../../views/admin/products/new');
const productIndexTemplate = require('../../views/admin/products/index');
const productEditTemplate = require('../../views/admin/products/edit');

//get access to the validator methods that are useful in this file
const { 
   validateProductName, validateProductPrice //new product form validation
} = require('./validators');
//get access to the custom middleware functions that will be needed in this file
const { handleErrors, requireAuth } = require('./middlewares');

//create an instance an router object from the express library
const router = express.Router();
//create an instance of multer -> a middleware to work with file upload in forms
//The memory storage engine stores the files in memory as Buffer objects.
const upload = multer( { storage: multer.memoryStorage() } );

//---- LISTING PRODUCTS -------------------------------------------------------------------------------------------------
//watching for incoming requests for a path of '/admin/products' and a method of GET
//display a list with all the existing products, with the options to edit or delete each one of them
router.get(
  '/admin/products',
  //middleware to verify if there's an authenticated user
  requireAuth,
  //route handler
  async (req, res) => {
    //get a list of all records in the products repository
    const products = await productsRepo.getAll();
    //display list of existing products
    res.send(productIndexTemplate({ products }));
});

//---- CREATING PRODUCTS -------------------------------------------------------------------------------------------------
//watching for incoming requests for a path of '/admin/products/new' and a method of GET
//display a form to create a new product
router.get(
  '/admin/products/new',
  //middleware to verify if there's an authenticated user
  requireAuth,
  //request handler
  (req, res) => {
    res.send(productNewTemplate({ }));
});

//watching for incoming requests for a path of '/admin/products/new' and a method of POST
//when a new product form is submitted -> validate data -> create a new product
router.post(
  '/admin/products/new',
  //middleware to verify if there's an authenticated user
  requireAuth,
  //middleware to handle file upload in multipart form
  upload.single('image'),
  [
    //inputs sanitization and validation, exported from validators.js
    validateProductName,
    validateProductPrice
  ],
  //custom middleware the handlers potential validation errors in the form
  //if an error is encountered, display the new product form again with the error messages
  handleErrors(productNewTemplate),
  //request handler
  async (req, res) => {
    //take the file that has been uploaded and can be accessed in req.file.buffer 
    //turn it into a string that can be safely stored inside of the products.json file, using base64 encoding
    const image = req.file.buffer.toString('base64');

    //deconstruct meaningful properties out of the req.body object
    const { productName, price } = req.body;
  
    //create a product inside of the productsRepo 
    await productsRepo.create({ productName, price, image });

    res.redirect('/admin/products');
});

//---- EDITING PRODUCTS -------------------------------------------------------------------------------------------------
//watching for incoming requests for a path of '/admin/products/:id/edit' and a method of GET
//display a form to edit the product which the id corresponds to the id parameter in the url that the request was made for
router.get(
  '/admin/products/:id/edit',
  //middleware to verify if there's an authenticated user
  requireAuth,
  //request handler
  async (req, res) =>{
    //get the product which the id corresponds to the id parameter in the url
    const product = await productsRepo.getOne(req.params.id);

    //if no product with that id can be found
    if(!product) {
      //temporarily show this error message
      return res.send('Product not found');
    }

    //display form to edit the corresponding product
    res.send(productEditTemplate({ product }));
});

//watching for incoming requests for a path of '/admin/products/:id/edit' and a method of POST
//when the product form is submitted with the changes -> validate data -> update product in the repository
router.post(
  '/admin/products/:id/edit',
  //middleware to verify if there's an authenticated user
  requireAuth,
  //middleware to handle file upload in multipart form
  upload.single('image'),
  [
    //inputs sanitization and validation, exported from validators.js
    validateProductName,
    validateProductPrice
  ],
  //custom middleware the handlers potential validation errors in the form
  //if an error is encountered, display the edit product form again, with the product data and the error messages
  handleErrors(
    //template where errors will be rendered
    productEditTemplate, 
    //function to run if form fails validation, that returns a object containing product data to be forward onto the template
    async (req) => {
      //get the product that is being edited (which the id corresponds to the id parameter in the url)
      const product = await productsRepo.getOne(req.params.id);
      return { product };
    }),
  //request handler
  async (req, res) => {
    //create a reference to all changes that came in the req.body object
    const changes = req.body;

    //verify if a new image file was submitted in the edit form
    if(req.file) {
      //if there is an image, take the file that has been uploaded and can be accessed in req.file.buffer 
      //turn it into a string that can be safely stored inside of the products.json file, using base64 encoding
      changes.image = req.file.buffer.toString('base64'); 
    }

    //update the product with the id parameter that came from the request
    //second argument is an oject with all the changes that should be applied -> stored in the changes object 
    try {
      await productsRepo.update(req.params.id, changes);
    } 
    //if the update method throws an error
    catch (err) {
      res.send('file not found');
    }
    
    //after product is successfuly updated, redirect to products index
    res.redirect('/admin/products');
});

//---- DELETING PRODUCTS -------------------------------------------------------------------------------------------------
//watching for incoming requests for a path of '/admin/products/:id/delete' and a method of POST
//delete the data for the product which id corresponds to the id parameter in the url that the request was made for
router.post(
  '/admin/products/:id/delete',
  //middleware to verify if there's an authenticated user
  requireAuth,
  //request handler
  async (req, res) =>{
    //delete the product with the id that corresponds to the id parameter in the url
    await productsRepo.delete(req.params.id);
    
    //after product is successfuly deleted, redirect to updated products index
    res.redirect('/admin/products');
});


//---- EXPORT ROUTERS -------------------------------------------------------------------------------------------------
module.exports = router;