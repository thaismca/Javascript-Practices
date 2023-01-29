//get access to the express package inside of this file
const express = require('express');

//require an instance of the CartsRepository class
const productsRepo = require('../repositories/carts');

//get access to views from other files in this project
//const productsIndexTemplate = require('../views/products/index');

//create an instance an router object from the express library
const router = express.Router();

//---- ADD TO CART -------------------------------------------------------------------------------------------------

//---- DISPLAY SHOPPING CART -------------------------------------------------------------------------------------------------

//---- DELETE FROM CART -------------------------------------------------------------------------------------------------


//---- EXPORT ROUTERS -------------------------------------------------------------------------------------------------
module.exports = router;