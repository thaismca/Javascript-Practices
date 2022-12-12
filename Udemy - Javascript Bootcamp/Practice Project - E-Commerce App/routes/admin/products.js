//get access to the express package inside of this file
const express = require('express');
//require an instance of the ProductsRepository class
const productsRepo = require('../../repositories/products');

//get access to views from other files in this project
const productNewTemplate = require('../../views/admin/products/new');

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
//when a new product form is submitted -> create a new product
router.post('/admin/products/new', (req, res) => {
    //code that will create a new product when a form is submitted
});

//---- EXPORT ROUTERS -------------------------------------------------------------------------------------------------
module.exports = router;