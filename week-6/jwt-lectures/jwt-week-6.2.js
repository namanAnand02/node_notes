// jwt is not exactly encrypt and decrypt
// but it is encode and decode -  with the help of JWT_SECRET

// in case of JWTS, anyone can decode it to its original payload (get the data involved in its encoding) but they can't verify it without JWT_SECRET.
// and hence it is different from encrypting thingy, the meaning of encrypt is that it cant ever be decrypted. 
// but jwt can be decoded and ther info involved can be extracted even without the need of JWT_SECRET, but we cant verify those extracted info/ or authenticate the info without the help of JWT_SECRET.


/* 

Jwt can be decoded without the JWT_SECRET 
but for Jwt to be verified, we need JWT_SECRET

in case of encryption, no one can get/ decrypt the data/string back without the key (using which it was made )

hence jwt are encoding - decoding and not encrypting- decrypting

*/

/*

verification of JWT - meaning server trying to make sure this JWT was shared to the user by them only at the time of signin

*/

/*

thats why it was hated ad people thought it has security vulnerabilities -- anyone can decode it even without the JWT_SECRET.

anyone can decode the original payload (org string data) even without the JWT_SECRET from a jwt and hence it was criticised.


can check this on site --> https://jwt.io

**** BUT BUT BUT ---------> ITS ALRIGHT, nothing to worry  ****
*/

/*

its fine - nothing to worry - think of bank cheque example :

---------> if I ever sign a bank cheque, i can show it to anyone and everyone. they all can see that i am transferring the x amt of money to a person/ my friend, but they can't do anything about it. ONLY THE BANK NEEDS TO VERIFY BEFORE DEBITING THE USER's ACC

So, it doesn't matter if everyone sees the cheque, they cant do anything with this information.

only bank with this cheque can do something i.e verify the user by its signature and do whatever it was asked for. 
---------->

---------------> 

** similarly, JWT can be decoded by everyone 
** but it can only be verified by only the person who issued them (using the JWT secret).
** In our case, the server issues them to the user with the help of JWT_SECRET so only that server can verify that Jwt.


-----------------> 

basic backend that has 3 endpoints - a signup, a signin and me 

signup --> pushes to in memory arr 

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


app.get("/me", (req,res) => {

    // the user sends the token via headers so we first need to parse it. 

    const token = req.headers.token
    // we now decode this jwt token and extract all the info out of it.

    const decodedInformation = jwt.verify(token, JWT_SECRET)

    // now out of all the extracted info, we need to pull out the username
    const username = decodedInformation.username

    // now we will findout the user using the extracted username
    const foundUser = users.find(function(u){
        return u.username == username

        // this will save the instance of the user from the users arr 

        // now in next step, we need to use this foundUser to get password 
    })

    if(foundUser){
        res.status(200).json({
            username: username,
            password: foundUser.password,
            message: "user info returned."
        })
    } else{
        res.status(401).json({
            message: "credentials incorrect! "
        })
    }
})



app.listen(3000)





// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


// Assignment: Creating an auth middleware 
// try creating a middleware called auth that verifies if a user is logged in and ends the request early if the user isn't logged in?


// the most important usecase of middleware is authentication purpose.