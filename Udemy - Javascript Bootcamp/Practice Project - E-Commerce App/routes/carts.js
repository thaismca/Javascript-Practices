//get access to the express package inside of this file
const express = require('express');

//require an instance of the CartsRepository class
const cartsRepo = require('../repositories/carts');

//get access to views from other files in this project
//const productsIndexTemplate = require('../views/products/index');

//create an instance an router object from the express library
const router = express.Router();

//---- ADD TO CART -------------------------------------------------------------------------------------------------
//watching for incoming requests for a path of '/cart/products' and a method of POST
//add the product, which id can be retrieved from the body of the request, to the shopping cart
router.post('/cart/products',
  //route handler
  async (req, res) => {
    //variable to hold a reference to the user's cart
    let cart;
    //check if there's is an existing cart for the user
    if(!req.session.cartId) {
      //no existing cart -> create one
      cart = await cartsRepo.create({ items: [] });
      //get the id that was created for the cart and assign it to the req.session.cartId property
      req.session.cartId = cart.id;
    }
    //user already has a cart
    else {
      //retrieve cart information from the repository
      cart = await cartsRepo.getOne(req.session.cartId);
    }

    //check if there's an instance of the item in this user's cart
    const existingItem = cart.items.find(item => item.id === req.body.productId);
    if(!existingItem) {
      //no item -> add new product in the products array, quantity 1
      cart.items.push({ id: req.body.productId, quantity: 1 });
    }
    //item exists in the cart
    else {
      //increment item's quantity by one
      existingItem.quantity++;
    }
    
    //update the items array in the cart
    await cartsRepo.update(cart.id, { items: cart.items }); 
    
    //send response
    res.send('product added to cart'); 
});

//---- DISPLAY SHOPPING CART -------------------------------------------------------------------------------------------------

//---- DELETE FROM CART -------------------------------------------------------------------------------------------------


//---- EXPORT ROUTERS -------------------------------------------------------------------------------------------------
module.exports = router;