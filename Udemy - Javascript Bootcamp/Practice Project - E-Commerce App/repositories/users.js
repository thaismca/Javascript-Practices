//get access to the File System Module from Node.js inside of this project
//The node:fs module enables interacting with the file system
const fs = require('node:fs');
//get access to the crypto module from Node.js inside of this project
//The node:crypto module provides a set of cryptographic functionality
const crypto = require('node:crypto');

class UsersRepository {
    //constructor to create an instance of the UsersRepository
    //it receives a filename that represents where the info is supposed to be saved when an instance of the repository is created
    constructor(filename) {
        //check if a filename was passed in the arguments
        if(!filename) {
            //no filename -> no way to know where to save information
            throw new Error('Creating a repository requires a filename');
        }

        //take whatever filename that was provided and store it in a instance variable
        this.filename = filename;
        //check if a file with that given name already exists
        try {
            fs.accessSync(this.filename);
        } 
        //block that runs if file with that given name does not exist
        catch {
            //create the file
            fs.writeFileSync(this.filename, '[]');
        }
    }

    //method that gets a list of all users
    async getAll() {
        //open the file called this.filename and read its contents
        //parse the contents from JSON string to an object
        //return the parsed data
        return JSON.parse(await fs.promises.readFile(this.filename, { encoding: 'utf8' }));
    }

    //method that finds the user with the given id
    async getOne(id) {
        //load up the array of records inside the current version of this.filename
        const records = await this.getAll();
        //iterate through the array records
        //return the first record that has an id property that matches the id that was passed in
        return records.find(record => record.id === id);   
    }

    //method to create a new user
    //it receives an object with an user's attributes
    async create(attrs) {
        //assign an id for this new user
        attrs.id = this.randomId();
        //load up the array of records inside the current version of this.filename
        const records = await this.getAll();
        //add in the new user to the array
        records.push(attrs);
        //writeAll updated array of records back to this.filename
        await this.writeAll(records);
    }

    //method to update the user with the given id using the giving attributes
    async update(id, attrs) {
        //load up the array of records inside the current version of this.filename
        const records = await this.getAll();
        //iterate through the array records
        //store the first record that has an id property that matches the id that was passed in
        const record = records.find(record => record.id === id);

        //check if record was found
        if(!record) {
            //throw an error is no record with the given id was found
            throw new Error(`Could not find user with the ID ${id}`);
        }

        //record was found -> update it by coping attrs over to record
        Object.assign(record, attrs);
        //write array of records containing the now updated record back to this.filename
        await this.writeAll(records);
    }

    //method to delete the user with the given id
    async delete(id) {
        //load up the array of records inside the current version of this.filename
        const records = await this.getAll();
        //iterate through the array records
        //filter all records that have an id property that doens't match the id that was passed in
        const filteredRecords = records.filter(record => record.id !== id);
        //write the filtered records back to this.filename
        await this.writeAll(filteredRecords);
    }

    //helper method to generate a random ID for an user
    randomId() {
        //use crypto.randomBytes to generate cryptographically strong pseudorandom data in the form of a buffer
        //decode that buffer to a string hex format
        return crypto.randomBytes(4).toString('hex');
    }

    //helper method that writes all users to a users.json file
    //it receives a list of records that need to be saved
    async writeAll(records) {
        //write updated array of records back to this.filename in JSON string format (utf8 encoding option is the default)
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
    }
}

//testing code
const test = async () => {
    const repo = new UsersRepository('users.json');
    
    //await repo.create({email: 'test3@test.com', password: 'testing3'});
    //await repo.create({email: 'test4@test.com', password: 'testing4'});
    //const user = await repo.getOne('a35d2e42');
    //await repo.delete('b35198be');

    await repo.update('a35d2e42', {email: 'change@test.com'});
    const users = await repo.getAll();
    console.log(users);
}

test();
