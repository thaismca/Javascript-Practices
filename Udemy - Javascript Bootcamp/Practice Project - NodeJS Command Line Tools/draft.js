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

//-----------------------------------------------------------------------------------------------------------------------------------------
//CALLBACK-BASED SOLUTION
fs.readdir(process.cwd(), (err, files) => {
    //the callback gets two arguments (err, files) where files is an array of the names of the files in the directory

    //EITHER err === an error object, which means something wen wrong
    //OR err === null, which means everything is okay
    if(err) {
        //error handling code
        console.log(err);
    }

    //CALLBACK-BASED SOLUTION
    //create an array (allStats) which length is going to be equal the number of calls we expect to have
    //inside this array, every element is going to start off as 'null'
    const allStats = Array(files.length).fill(null);

    for(let file of files){
        //get the index of the current element
        const index = files.indexOf(file);
        
        fs.lstat(file, (err, stats) => {
            if(err){
                console.log(err);
            }
            //add the stats to the appropriate position of the allStats array (matching the index of current file of filenames)
            allStats[index] = stats;

            //check if there are still null values in the allStats array
            //ready will be true only if there are no falsy returns from any of the elements in the allStats array
            const ready = allStats.every((stats) => {
                return stats;
            });

            //if there are no null elements in allStats
            if(ready){
                //iterate over the allStats array
                allStats.forEach((stats, index) => {
                    //print out the element in files that matches the current allStats index, and whether it's a file or not
                    console.log(files[index], stats.isFile());
                });
            }
        });
    }
});
//-----------------------------------------------------------------------------------------------------------------------------------------
//CALLBACK-BASED SOLUTION USING PROMISES
fs.readdir(process.cwd(), async (err, files) => {
    //the callback gets two arguments (err, files) where files is an array of the names of the files in the directory

    //EITHER err === an error object, which means something wen wrong
    //OR err === null, which means everything is okay
    if(err) {
        //error handling code
        console.log(err);
    }

    //CALLBACK-BASED SOLUTION USING PROMISES
    //this part doesn't change, either manually wrapping the lstat function in a promise or using node built-in methods to assist
    for(let file of files) {
        try{
            const stats = await lstat(file);
            console.log(file, stats.isFile());
        }
        catch(err) {
            console.log(err);
        }  
    }

});

//manually wrap the lstat function in a  promise
const lstat = (file) => {
    return new Promise((resolve, reject) => {
        fs.lstat(file, (err, stats) => {
            //if an error is returned from the lstat call, reject the promise
            if(err){
                reject(err);
            }
            //resolve with the stats data that is returned from the lstat call (when no error)
            resolve(stats); 
        })
    })
}