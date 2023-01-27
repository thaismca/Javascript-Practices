//get access to the express package inside of this file
const express = require('express');

//require an instance of the ProductsRepository class
const productsRepo = require('../repositories/products');

//get access to views from other files in this project
const productsIndexTemplate = require('../views/products/index');

//create an instance an router object from the express library
const router = express.Router();

//---- LISTING PRODUCTS -------------------------------------------------------------------------------------------------
//watching for incoming requests for a path of '/' and a method of GET
//display a list with all the existing products, with the options to add each one to the shopping cart
router.get('/',
  //route handler
  async (req, res) => {
    //get a list of all records in the products repository
    const products = await productsRepo.getAll();
    //display list of existing products
    res.send(productsIndexTemplate({ products }));
});

//---- EXPORT ROUTERS -------------------------------------------------------------------------------------------------
module.exports = router;