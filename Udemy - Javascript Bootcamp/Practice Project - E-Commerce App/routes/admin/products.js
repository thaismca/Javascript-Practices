//get access to the express package inside of this file
const express = require('express');
//get access to the multer package inside of this file
const multer = require('multer');

//require an instance of the ProductsRepository class
const productsRepo = require('../../repositories/products');

//get access to views from other files in this project
const productNewTemplate = require('../../views/admin/products/new');
const productIndexTemplate = require('../../views/admin/products/index');

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

//---- EXPORT ROUTERS -------------------------------------------------------------------------------------------------
module.exports = router;