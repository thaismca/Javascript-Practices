//base class that contains methods that are going to be shared across all the different repositories in the project

//get access to the File System Module from Node.js inside of this file
//The node:fs module enables interacting with the file system
const fs = require('node:fs');
//get access to the crypto module from Node.js inside of this file
//The node:crypto module provides a set of cryptographic functionality
const crypto = require('node:crypto');

module.exports = class Repository {
    //constructor to create an instance of the Repository
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

    //method that gets a list of all records of the repository
    async getAll() {
        //open the file called this.filename and read its contents
        //parse the contents from JSON string to an object
        //return the parsed data
        return JSON.parse(await fs.promises.readFile(this.filename, { encoding: 'utf8' }));
    }

    //method that finds one record of the repository with the given id
    async getOne(id) {
        //load up the array of records inside the current version of this.filename
        const records = await this.getAll();
        //iterate through the array records
        //return the first record that has an id property that matches the id that was passed in
        return records.find(record => record.id === id);   
    }

    //method that finds one record of the repository with the given filters
    //filters is an object that can contain one or more sets of key/value pair
    async getOneBy(filters) {
        //load up the array of records inside the current version of this.filename
        const records = await this.getAll();
        //iterate through the array of records
        for(let record of records){
            //variable to track if a record matching the given filters was found
            let found = true;
            //iterate over the filters object that was passed in the arguments
            for(let key in filters) {
                //for every key in filters, compare the value at the same key for the current record
                //if value for filters[key] doesn't match the value for record[key], flip found to false
                found = filters[key] !== record[key] ? false : true;
            }
            //if found was not flipped to false, it means the record matches the search filters -> return it
            if(found) {
                return record;
            }
        };
    }

    //method to create a new record in the repository
    //it receives an object with a record's attributes
    async create(attrs) {
        //assign an id for this new record
        attrs.id = this.randomId();

        //create a new object with all the properties of attrs
        const newRecord = {...attrs}

        //load up the array of records inside the current version of this.filename
        const records = await this.getAll();
        //add in the new record to the array
        records.push(newRecord);
        //writeAll updated array of records back to this.filename
        await this.writeAll(records);

        //return the object that contains all the info of the new record
        return newRecord;
    }

    //method to update the record with the given id using the giving attributes
    async update(id, attrs) {
        //load up the array of records inside the current version of this.filename
        const records = await this.getAll();
        //iterate through the array records
        //store the first record that has an id property that matches the id that was passed in
        const record = records.find(record => record.id === id);

        //check if record was found
        if(!record) {
            //throw an error is no record with the given id was found
            throw new Error(`Could not find record with the ID ${id}`);
        }

        //record was found -> update it by coping attrs over to record
        Object.assign(record, attrs);
        //write array of records containing the now updated record back to this.filename
        await this.writeAll(records);
    }

    //method to delete the record with the given id
    async delete(id) {
        //load up the array of records inside the current version of this.filename
        const records = await this.getAll();
        //iterate through the array records
        //filter all records that have an id property that doens't match the id that was passed in
        const filteredRecords = records.filter(record => record.id !== id);
        //write the filtered records back to this.filename
        await this.writeAll(filteredRecords);
    }

    //helper method to generate a random ID for a record
    randomId() {
        //use crypto.randomBytes to generate cryptographically strong pseudorandom data in the form of a buffer
        //decode that buffer to a string hex format
        return crypto.randomBytes(4).toString('hex');
    }

    //helper method that writes all records to a json file
    //it receives a list of records that need to be saved
    async writeAll(records) {
        //write updated array of records back to this.filename in JSON string format (utf8 encoding option is the default)
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
    }
}