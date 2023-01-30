//get access to the express package inside of this file
const express = require('express');

//require an instance of the CartsRepository class
const cartsRepo = require('../repositories/carts');
//require an instance of the ProdutsRepository class
const productsRepo = require('../repositories/products');

//get access to views from other files in this project
const cartShowTemplate = require('../views/cart/show');

//create an instance an router object from the express library
const router = express.Router();

//---- ADD TO CART -------------------------------------------------------------------------------------------------
//watching for incoming requests for a path of '/cart/products' and a method of POST
//add the product, which id can be retrieved from the body of the request, to the shopping cart
router.post('/cart/products',
  //route handler
  async (req, res) => {
    //retrieve user's cart or create one if there's none
    const cart = await cartsRepo.userCart(req);

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
//watching for incoming requests for a path of '/cart' and a method of GET
//display a list with all the products that are currently in the shopping cart, with the option remove each one of them
router.get('/cart',
  //route handler
  async (req, res) => {
    //retrieve user's cart or create one if there's none
    const cart = await cartsRepo.userCart(req);

    //iterate through the items in the cart
    for(let item of cart.items) {
      //retrieve information about the product with the item id in the Products Repository
      const product = await productsRepo.getOne(item.id);
      //associate the product to the item
      item.product = product;
    }
    
    //display shopping cart
    res.send(cartShowTemplate({ items: cart.items }));

});

//---- REMOVE FROM CART -------------------------------------------------------------------------------------------------
//watching for incoming requests for a path of '/cart/products/remove' and a method of POST
//remove the product, which id can be retrieved from the body of the request, from the shopping cart
router.post('/cart/products/remove',
  //route handler
  async (req, res) => {
    //retrieve user's cart
    const cart = await cartsRepo.getOne(req.session.cartId);

    //filter out the item in the user's cart which id matches the id that came in the req.body object
    const items = cart.items.filter(item => item.id !== req.body.itemId); 
    //update the cart with the filtered list of items
    await cartsRepo.update(req.session.cartId, { items });
    
    //after the list of items in the user's cart is successfully updated, redirect to display an updated cart
    res.redirect('/cart');
});


//---- EXPORT ROUTERS -------------------------------------------------------------------------------------------------
module.exports = router;