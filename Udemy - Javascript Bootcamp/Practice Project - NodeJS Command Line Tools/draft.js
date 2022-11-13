//file to store code that was first written to understand some concepts and that will end up being refactored in the app.js file
//so I can easily access older notes and implementations when studying
//NOTE: trying to actually use this script will cause errors

//this code will just store all different aproaches taken during to coursr to differentiate files from folders in a given directory

fs.readdir(process.cwd(), (err, files) => {
    //the callback gets two arguments (err, files) where files is an array of the names of the files in the directory

    //EITHER err === an error object, which means something wen wrong
    //OR err === null, which means everything is okay
    if(err) {
        //error handling code
        console.log(err);
    }

    //BAD CODE HERE
    //this won't print out all results in the same order every time nls is executed
    //when we run the for loop, we run all four calls to that lstat method in very quick succession, but the callback is not run instantly
    //it takes some time to retrieve info from the user's HD and this time can be different at each run of the lstat function
    for(let file of files){
        fs.lstat(file, (err, stats) => {
            if(err){
                console.log(err);
            }
            console.log(file, stats.isFile());
        });
    }

});