//get access to the File System Module from Node.js inside of this project
//The node:fs module enables interacting with the file system
const fs = require('node:fs');

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

    //method to create a new user
    //it receives an object with an user's attributes
    async create(attrs) {
        //load up the array of records inside the current version of this.filename
        const records = await this.getAll();
        //add in the new user to the array
        records.push(attrs);
        //write updated array of records back to this.filename in JSON string format (utf8 encoding option is the default)
        await fs.promises.writeFile(this.filename, JSON.stringify(records));
    }
}

//testing code
const test = async () => {
    const repo = new UsersRepository('users.json');
    await repo.create({email: 'test1@test.com', password: 'testing1'});
    await repo.create({email: 'test2@test.com', password: 'testing2'});
    const users = await repo.getAll();
    console.log(users);
}

test();
