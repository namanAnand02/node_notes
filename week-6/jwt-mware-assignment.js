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







const express = require("express")
const app = express()

const jwt = require("jsonwebtoken")
const JWT_SECRET = "helloFromPataalLok"

// middleware to extract json body from the request.
app.use(express.json())

const users = [] // acts as in memory variable 


app.post("/signup", (req,res)=>{

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

app.post("/signin", (req,res)=>{

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


// /me endpoint - it first verifies the token and if it is correct, it returns back the user's username and password 



// a middleware accepts three argument - req,res and next.
// req and res are same as the final handler is having 
// after doing its ops, if it calls next(), only then control reaches the next handler.




// auth middleware task ---> 
// 1> verify the user's jwt token 
// 2> pass the extracted data out of the decodedInfo to the other endpoints. (modifying the request-response objects)
// middlewares can also modify the request or response objects reaching to the next handlers

const auth = function(req,res,next){

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




app.get("/me", auth, (req,res) => {


    // // now we will findout the user using the extracted username
    // const foundUser = users.find(function(u){
    //     return u.username == req.username

    //     // this will save the instance of the user from the users arr 

    //     // now in next step, we need to use this foundUser to get password 
    // })



    let foundUser = null

    for(let i = 0; i < users.length; i++){
        if (users[i].username === req.username){
            foundUser = users[i]
        }
    }

    if (foundUser){
    
        res.status(200).json({
            username: req.username,
            password: foundUser.password,
            message: "user info returned."
        })
    }


})




app.listen(3000)

