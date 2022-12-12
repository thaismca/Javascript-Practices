//require in the Repository class
const Repository = require('./repository');

class ProductsRepository extends Repository {
    //no customizations required at this point
}

//make an instance of this class available to other files inside of this project
module.exports = new ProductsRepository('products.json');
