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
        const contents = await fs.promises.readFile(this.filename, { encoding: 'utf8' });
        //parse the contents from JSON string to an object
        const data = JSON.parse(contents);
        //return the parsed data
        return data;
    }
}

//testing code
const test = async () => {
    const repo = new UsersRepository('users.json');
    const users = await repo.getAll();
    console.log(users);
}

test();
