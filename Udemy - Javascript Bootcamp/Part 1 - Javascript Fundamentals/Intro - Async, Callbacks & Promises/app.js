//CREATING A PROMISSE
const willGetYouADog = new Promise((resolve, reject) => {
    setTimeout(() => {
        const rand = Math.random();
        if(rand < 0.5) {
            resolve();
        } else {
            reject();
        }
    }, 5000);
    
});

//then runs if resolved
willGetYouADog.then(() => {
    console.log('1- YAY WE GOT A DOG!');
});
//catch runs if rejected
willGetYouADog.catch(() => {
    console.log('1- :( NO DOG');
});

//ANOTHER WAY - FUNCTION RETURNING A PROMISE
const makeDogPromisse = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const rand = Math.random();
            if(rand < 0.5) {
                resolve();
            } else {
                reject();
            }
        }, 5000);
        
    });
};

makeDogPromisse()
.then(() => {
    console.log('2- YAY WE GOT A DOG')
})
.catch(() => {
    console.log('2- :( NO DOG')
});

//--------------------------------------------------------------------------
//creating a function that receives a parameter 'url' and returns a promise after 1sec
const fakeRequest = (url) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            //pages object, with existing subpages as keys
            const pages = {
                '/users' : [{id:1, username: 'Adam'}, {id: 2, username: 'Eve'}],
                '/about' : 'This is the about page!'
            };

            //get value in the pages obj using the url passed as parameter as a key
            const data = pages[url];
            //check if the url used as key returned any value to the data variable
            if(data) {
                //promise can return values, in this case a status code of 200 and the content of data
                resolve({status: 200, data});
            } else {
                reject({status: 404});
            }
        }, 1000);
    });
};

//call fakeRequest passing a valid url
fakeRequest('/users')
.then((response) => {
    console.log('Status Code', response.status);
    console.log('Data', response.data);
    console.log('REQUEST WORKED!');
})
.catch((response) => {
    console.log(response.status);
    console.log('REQUEST FAILED!)');
});

//call fakeRequest passing a invalid url
fakeRequest('/contact')
.then((response) => {
    console.log('Status Code', response.status);
    console.log('Data', response.data);
    console.log('REQUEST WORKED!');
})
.catch((response) => {
    console.log(response.status);
    console.log('REQUEST FAILED!)');
});

//------------------------------------------------------------------------------------
//promise chaining
//This is a FAKE Http Request Function
//It takes 1 second to resolve or reject the promise, depending on the url that is passed in
const fakeHttpRequest = (url) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const pages = {
				'/users'        : [
					{ id: 1, username: 'Bilbo' },
					{ id: 5, username: 'Esmeralda' }
				],
				'/users/1'      : {
					id        : 1,
					username  : 'Bilbo',
					upvotes   : 360,
					city      : 'Lisbon',
					topPostId : 454321
				},
				'/users/5'      : {
					id       : 5,
					username : 'Esmeralda',
					upvotes  : 571,
					city     : 'Honolulu'
				},
				'/posts/454321' : {
					id    : 454321,
					title :
						'Ladies & Gentlemen, may I introduce my pet pig, Hamlet'
				},
				'/about'        : 'This is the about page!'
			};
			const data = pages[url];
			if (data) {
				resolve({ status: 200, message: 'sucess', data }); //resolve with a value!
			}
			else {
				reject({ status: 404, message: 'page not found' }); //reject with a value!
			}
		}, 1000);
	});
};

fakeHttpRequest('/users')
	.then((res) => {
        //in '/users', fetch the id from the data in first index (data[0]) -> { id: 1, username: 'Bilbo' } -> 1
		const id = res.data[0].id;
        //return an url consisting of the string '/users/' + the id fetched and stored in the id variable -> /users/1
		return fakeHttpRequest(`/users/${id}`);
	})
    //this will run only after the previous request returns a 'resolved' response, passing whatever is retuned in a new request
    //in this case, it will make a request passing '/users/1' as parameter
	.then((res) => {
		//fetch the topPostId from the data in '/users/1' -> 454321
		const postId = res.data.topPostId;
        //return an url consisting of the string '/posts/' + the topPostId fetched and stored in the postId variable -> /posts/454321
		return fakeHttpRequest(`/posts/${postId}`);
	})
    //this will run only after the previous request returns a 'resolved' response, passing whatever is retuned in a new request
    //in this case, it will make a request passing '/posts/454321' as parameter
	.then((res) => {
        //create an h1 element
        const postTitle = document.createElement('h1');
        //fetch the title from the data in '/posts/454321' -> 'Ladies & Gentlemen, may I introduce my pet pig, Hamlet'
        //set this string as the inner text for the new h1 element
        postTitle.innerText = res.data.title;
        //add the new h1 to the page
        document.body.appendChild(postTitle);
	})
    //this will run if any of the requests above returns a 'rejected' response
	.catch((err) => {
		console.log(`OH NO! ${err.status} - ${err.message}` );
	});

// ************************************************
// ATTEMPT 2 (deliberate error to illustrate CATCH)
// ************************************************
// fakeHttpRequest('/users')
// 	.then((res) => {
// 		const id = res.data[0].id;
// 		return fakeHttpRequest(`/useALSKDJrs/${id}`); //INVALID URL, CATCH WILL RUN!
// 	})
// 	.then((res) => {
// 		const postId = res.data.topPostId;
// 		return fakeHttpRequest(`/posts/${postId}`);
// 	})
// 	.then((res) => {
// 		const postTitle = document.createElement('h1');
//      postTitle.innerText = res.data.title;
//      document.body.appendChild(postTitle);
// 	})
// 	.catch((err) => {
// 		console.log(`OH NO! ${err.status} - ${err.message}`);
// 	});
