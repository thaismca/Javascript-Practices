//get access to the express package inside of this file
const express = require('express');
//require validationResult from express-validator library
const { validationResult } = require('express-validator');
//require an instance of the ProductsRepository class
const productsRepo = require('../../repositories/products');

//get access to views from other files in this project
const productNewTemplate = require('../../views/admin/products/new');

//get access to the validator mehods that are useful in this file
const { 
   validateProductName, validateProductPrice //new product form validation
} = require('./validators');

//create an instance an router object from the express library
const router = express.Router();

//---- LISTING PRODUCTS -------------------------------------------------------------------------------------------------
//watching for incoming requests for a path of '/admin/products' and a method of GET
//display list of existing product
router.get('/admin/products', (req, res) => {
    //code that will display a list with existing products
});

//---- CREATING PRODUCTS -------------------------------------------------------------------------------------------------
//watching for incoming requests for a path of '/admin/products/new' and a method of GET
//display a form to create a new product
router.get('/admin/products/new', (req, res) => {
    res.send(productNewTemplate({ }));
});

//watching for incoming requests for a path of '/admin/products/new' and a method of POST
//when a new product form is submitted -> validate data -> create a new product
router.post(
  '/admin/products/new',
  [
    //inputs sanitization and validation, exported from validators.js
    validateProductName,
    validateProductPrice
  ],
  async (req, res) => {
    //capture potential validation errors
    const errors = validationResult(req);
    //if error is not empty, display the sign up form again, and the error messages
    if(!errors.isEmpty()){
      return res.send(productNewTemplate({ errors }));
    }

    //deconstruct meaningful properties out of the req.body object
    const { productName, price, image } = req.body;
  
    //create a product inside of the productsRepo 
    await productsRepo.create({ productName, price, image });

    res.send('product created');
});

//---- EXPORT ROUTERS -------------------------------------------------------------------------------------------------
module.exports = router;