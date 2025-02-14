// Assignment: Creating an auth middleware 
// try creating a middleware called auth that verifies if a user is logged in and ends the request early if the user isn't logged in?


// the most important usecase of middleware is authentication purpose.









/*
say we are creating a todo application, in there we will have multiple endpoints i.e 
- get /todos to get my todos
- or post /todo to create a new todo
- or delete /todo to delete any todo

---> and the problem would be that - we will be repeating the logic of verifying the user token first, everytime they hit anyone of these authenticated endpoints. 

---> if user hits any of the authenticated endpoints, we first verify the token sent by him, then if it is right, we proceed to do the assigned task. 
 

(especially these two lines where we are verifying the tokens when the user is hitting the authenticated endpoints like /me 


    // const token = req.headers.token
    // // we now decode this jwt token and extract all the info out of it.

    // const decodedInformation = jwt.verify(token, JWT_SECRET)
    

    // and also those if .... wala part

)

when infact we just should keep the meat of that endpoint inside them, like /me should return the user's password and username --> so ideally we shud just put this much part of code inside /me endpoint and handle those authentication part somewhere else.

********** MIDDLEWARES thus plays a huge part here *************


## we define a middleware at the top named auth which does authentication of the token sent by user for us. 

## and only when the user exists, i.e middleware ops says success, we allow them to hit these endpoints.

** middleware(req,res, next) 

** app.get("/me", middleware, function(.../me work...))

so only when middleware authenticates the user's token and it shows success--> we call next() inside the middleware which help them hit the endpoints.

if the authentication fails at middlware, it wont call next() and thus the user wont be able to hit the desired endpoints.

****  basically, middleware does the authentication work and based on that result, it can allow or reject user access to any endpoints.


// middleware most important usecase is for authentication 



*/


// ***************           *********************************
// *************** CODE PART **********************************




const express = require("express")
const app = express()

const jwt = require("jsonwebtoken")
const JWT_SECRET = "helloFromPataalLok"

// middleware to extract json body from the request.
app.use(express.json())

const users = [] // acts as in memory variable 



// MIDDLEWARE - named logger to logs which request get hit 
function logger(req,res,next){

    // we will log what method got hit 
    console.log(`${req.method} request has been hit.`);
    // call the next() so the request passes to the next handler
    next()
    
}

// we need to add this "our made middleware" as an argument (in between) inside the endpoints we want to use



// ~~~~~~~~~ FRONTEND HOSTING ENDPOINT ~~~~~~~~~~~~~~~


// we are returning frontend also from our backend.
// we want to host our frontend and backend from the same domain -> to avoid some complexity that comes with CORS, etc.


// frontend hosted at "/" get endpoint so that anytime someone hits localhost:3000, backend not sends them any json but full frontend file contents to them.
app.get("/", function(req,res){
    res.sendFile(__dirname + "/index.html")

    // __dirname -> global method to get the current directory 
    // current directory is "C:\Users\NAMAN\Desktop\100_ cohort3\week-6"  + /index.html
})


// POST "/signup" endpoint 
app.post("/signup",logger, (req,res)=>{

    // 1. parse the username and body from the user - use middlware beforehand

    // 2. push their info(username and password) into the in memory variable

    // 3. respond them back with the message that they are signed up.

    const username = req.body.username
    const password = req.body.password


    // ideally we should add a check to ensure this user already exists or not.

    users.push({
        username: username,
        password: password
    })

    res.json({
        message: "you are signed up!"
    })


} )


// signin endpoint 
app.post("/signin", logger, (req,res)=>{

    const username = req.body.username
    const password = req.body.password

    // check if the username and password exists 

    const foundUser = users.find(function(user){
        if (user.username === username && user.password === password) {
            return true 
        } else{
            return false
        }

    })

    if (foundUser) {
        // generate a jwt token and return to the user 
        const token = jwt.sign({
            username: username
        }, JWT_SECRET)

        res.json({
            token: token
        })

    }


    // 1. it again accepts the username and password from the user.

    // 2. it matches them with the already existing data 

    // 3. if that matches, i.e user exists --> assigns a token to them and also store that token into their instance in the in memory variable 

    //3. a. since we want to use jwt token, we give them jwt after the match completes and shows them as existing user.

    // 3.b. first install and require jwtwebtoken library. It gives us certain functions/ methods we can use to generate jwt token and even verify them when needed.

    // to make jwt token, we first create a secret (JWT_SECRET = ......)
    
    // jwt.sign({json format info}, JWT_SECRET) : it generates a jwt token for us using the info we shared and the SECRET.

    // jwt.verify(token, JWT_SECRET) : it first decodes all the info out of JWT token and also it verifies the jwt token using the SECRET.

    // since jwt.verify(.....) output contains all the info used in the formation of JWT, we can use dot method to extract any particular off them.



})





// ***** Middleware and authenticated endpoints stuffs *******




// a middleware accepts three argument - req,res and next.
// req and res are same as the final handler is having 
// after doing its ops, if it calls next(), only then control reaches the next handler.



// auth middleware task ---> 
// 1> verify the user's jwt token 
// 2> pass the extracted data out of the decodedInfo to the other endpoints. (modifying the request-response objects)
// middlewares can also modify the request or response objects reaching to the next handlers

function auth(req,res,next){

    // first thing is to accept the token 
    const token = req.headers.token

    // 2. decode info out of this jwt 
    const decodedInfo = jwt.verify(token, JWT_SECRET)

    // if the username extracted out of this decoded info exists, only then we call next()

    // NOTE: this middleware also needs to pass the username out of this decoded info for the other endpoints to use. if it just calls the next(), the other endpoints will understand that the user is correct and exists somewhere in db but they wont ber able to find out which user is it being talked about.

    if (decodedInfo.username){
        // we first pass the data to the next handler 
        // this middleware modifies the req by adding the extracted data into it so this data can be used by other handler

        req.username = decodedInfo.username
        
        // req = {status, headers, ..... username}
        // this middleware adds username in this req obj here so that next handlers could use this username.
        
        
        next()
    } else{
        // else, end the request here only and respond back same
        res.json({
            message: "unauthorised! "
        })
    }


}


// we handled the user authenticate code inside this middleware, nextwards all the authenticated endpoints just have to consider their defined work and not worry about the auth of the user.

// we'll just add this middleware in betwen their's arguments 



// NOTE: we added logger middleware in this /me endpoint too.

// first req reaches logger middleware, it loges the method, and passes the req to next handler which again is a middleware - auth middleware, it then checks the user authentication and and if the auth succeeds, it calls next() and passes the req to next main handler of /me endpoint.


// "/me" authenicated endpoints whose task is to respond back the user their username and password
app.get("/me", logger, auth, (req,res) => {

    // 1. This defines a GET request to the /me route.
    // 2. The auth middleware runs before this handler.
    // 3. Once auth verifies the token, this handler gets executed.


    // The user is authenticated (checked via the auth middleware).
    // The user exists in memory (checked in the /me endpoint).

    // finding the user from the memory using the username passed by the middleware (inside req.username) 
    let foundUser = null

    for(let i = 0; i < users.length; i++){
        if (users[i].username === req.username){
            foundUser = users[i]
            break
        }
    }


    ////  or the below .find() does the same job

    ////  let foundUser = users.find(u => u.username === req.username);



    // handling the response only when foundUser is not null
    if (foundUser){
    
        res.status(200).json({
            username: req.username,
            password: foundUser.password,
            message: "user info returned."
        })
    } else{
        // if no user is found in the memory, the server responds as: 
        res.status(404).json({
            message: "user not found"
        })
    }



    /*

    --> Yes, we should still include the if (foundUser) check inside the /me endpoint, even though authentication is handled in the middleware. Here’s why:

    - Middleware (auth) only verifies the token and extracts the username.
    - It doesn’t check if the user actually exists in your users array.
    - /me still needs to fetch the user from users and verify if they exist.

    ## possible test cases can be :

    - Even if a token is valid, there are cases where a user might not exist in users:
    ✅ The user signed up, got a token, but was later deleted.
    ✅ The token was issued for an old username that no longer exists.
    ✅ Someone manually tampered with the token payload and changed the username.


    conclusion: 
    ✔-  Middleware (auth) ensures the token is valid.
    ✔-  /me endpoint ensures the user actually exists.
    ✔-  Prevents cases where the token is legit but the user is missing.

    💡 Bottom line: Authentication checks the token, but your endpoint must still check if the user exists. ✅




    */


})




app.listen(3000)



/*
in express, we have a chain of middlewares

// another middleware that we can create is the logger middlware -----> that anytime a request comes, it should logs it on the screen so that eventually do an analysis and see which request people are hitting the most.

*/


