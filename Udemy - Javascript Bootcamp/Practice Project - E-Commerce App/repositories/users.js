//get access to the crypto module from Node.js inside of this file
//The node:crypto module provides a set of cryptographic functionality
const crypto = require('node:crypto');
//get access to the utilities module from Node.js inside of this file
const util = require('node:util');
//use promisify to get a promise based version of the scrypt method
const scrypt = util.promisify(crypto.scrypt);

//require in the Repository class
const Repository = require('./repository');

class UsersRepository extends Repository {
    
    //method to create a new user record in the repository
    //it receives an object with a record's attributes
    async create(attrs) {
        //assign an id for this new record
        attrs.id = this.randomId();

        //generate salt -> use crypto.randomBytes to generate cryptographically strong pseudorandom data in the form of a buffer
        //decode that buffer to a string hex format
        const salt = crypto.randomBytes(8).toString('hex');
        //hashing process -> use promisified version of scrypt and get a buffer version of 'hashed password + salt'
        const buf = await scrypt(attrs.password, salt, 64);

        //assemble the object to represent the new user
        const newUser ={
            //create a new object with all the properties of attrs
            ...attrs,
            //overwrite password to store it as 'hashed password + salt'.'salt'
            password: `${buf.toString('hex')}.${salt}`
        }

        //load up the array of records inside the current version of this.filename
        const records = await this.getAll();
        //add in the new user to the array
        records.push(newUser);
        //writeAll updated array of records back to this.filename
        await this.writeAll(records);

        //return the object that contains all the info of the new user
        return newUser;
    }

    //helper method to compare passwords
    //it receives the password provided in the sign in form, and the stored string with 'hashed password + salt' and salt
    async comparePasswords(provided, stored) {
        //get the 'hashed password + salt' and the salt that was added to the password from the stored password
        const [storedHash, salt] = stored.split('.');
        //add the salt to the provided password and get a buffer version of 'hashed provided password + salt'
        const providedHashBuf = await scrypt(provided, salt, 64);
        //check if hashed version of 'provided password + salt' matches storedHash substring
        //return true if it's a match, false if's not
        return storedHash === providedHashBuf.toString('hex');
    }
}

//make an instance of this class available to other files inside of this project
module.exports = new UsersRepository('users.json');
