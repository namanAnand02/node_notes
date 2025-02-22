// we have already installed two dependencies so far - express and mongoose 
// later on- we will also install jwtwebtoken 

// create the skeleton for 4 routes - post /signup, post /login, post /todo(authenticated), Get /todos (authenticated)



// ~~~~~~~~~~~ MAIN CODE ~~~~~~~~~~~~~~~~~~~~~~~~

// 1. importing express
const express = require("express")
const app = express()

// 2. importing the data models from db.js
const { UserModel, TodoModel } = require("./db") 


// 3. require jwt from jsonwebtoken library
const jwt = require("jsonwebtoken")
const JWT_SECRET = "hareRamHareKrishna"

// 4. import mongoose 
const mongoose = require("mongoose")
// NOTE: we must connect our mongodb databse using mongoose.connect(cluster_URL/my_database_name)
mongoose.connect("mongodb+srv://anandnaman02:v9jPNDcVAXn0QXxN@cluster0.6k4iz.mongodb.net/todo-naman-2277")





// middlewares to parses the data sent in the body in POST endpoints 
app.use(express.json())

app.post("/signup", async (req,res)=>{

    // usual /signup endpoints stuffs, user sends the data through the body alongside, and hence we first parses the data 
    // user is expected to send email, username and password using body at the time of signup
    const email = req.body.email
    const username = req.body.username
    const password = req.body.password



    // we have imported the data models at the top 
    // we can call certain methods/func on those data models by calling them like UserModel.create({..data..})


    // this is an async operation and hence we must await this and thus make the function handler a async function 
    // await on database call, make the function handler an async func 
    // respond the user that he is logged inn 

    await UserModel.create({
        email: email,
        username: username,
        password: password
    })

    // respond the user that he is logged in 

    res.json({
        message: "You are signed up."
    })



    /*

    handle cases when user tries to signup using same email id etc so that it doesnt crashes 
    we can do that by adding constraints on user sending email id

    */

})


app.post("/signin", async (req,res)=>{
    const email = req.body.email
    const password = req.body.password // they can get parsed as we have introduced express.json() middleware at the top

    // now we need to check if this user exists or not 
    /*
        -- UserModel is someone which transfers users data from backend to database (users collection) - using UserMode.create({..data.})
        -- so we will take help of UserModel again to check for this user existence in our database 
        -- we will call .findOne({data....sent by user...}) on UserModel 
    */

    // .findOne is another function which helps find the user with the given data in the database if ofc he exists
    // again -> it returns a PROMISE - its an async operation - so we need to await their response - and thus put them inside a async function.
    const user = await UserModel.findOne({
        email:email,
        password:password
    })

    console.log(user)

    // now if the user exists with these credentials - we need to create a JWT token for the user
    if (user){

        // generate a JWt token for the user 

        /*
        1. install jsonwebtoken library - npm install jsonwebtoken
        2. require jwt from jsonwebtoken library
        3. create a JWT_SECRET for the token - at the top only after require
        4. this is so that whenever we are generating the token, we signin using this SECRET and again whenever we need to verify the token, we verify it using this SECRET (similar to my unique signature on cheque)

        */

        /*

        - TOKEN GENERATION -

        1. sign a jwt token using JWT_SECRET whose payload is "_id " ---> jwt.sign(payload, JWT_SECRET)
        2. what shoould be keep as payload here inside token - what json data do we want to store about the user inside this token so as to uniquely identify them??? 
        3. Ans = id 
        4. entries in the database is through _id field (an object id which mongodb gives us when we fill any data) 
        5. every user has a unique object id (reps by _id)
        6. we will search their this unique id to generate unique tokens 
        7. so that in future - during authentication, we can directly extract the _id from the token and search in our database for that user.
        8. using _id, we can always extract all that user's particular information

        conclusion : we are trying to create a JWT token using user's unique object id from the database as a payload and JWT_SECRET that we set.


        NOTE: payload - meaning what do we want to store - what json data do we want to store - (think about what do we need to store to uniquely identify the user? ----> id, their object id in particular )
        
        */
        
        const token = jwt.sign({
            id : user._id
            // we generated a token using the user's object id 
        }, JWT_SECRET) 

        res.json({
            token: token
        })

    } else{
        res.status(403).json({
            message: "Incorrect credentials" 
        })

    }



})

/*
so far

~~~~~~~~~~~~ /signup endpoint story ~~~~~~~~~~~
- we created a /signup endpoint which takes the user credentials and stores it in the database
-- we have used UserModel which does the transfer of data from this endpoint to users collection in the database. we call .create(..the user data..) on this UserModel - which inserts the user data to the UserModel and it does its work of transferring it at the database.
(rem that this UserMode.create({..data...}) returns a promise, so we must await this and put it inside a async function)
--- we then respond back the user that they have signed up.

~~~~~~~~~~ /signin endpoint story ~~~~~~~~~~~

- user hits this endpoint and send the credentials 
-- we check if this user exists or not using UserModel.findOne({..data..})
(rem this again returns a PROMISE - so we must await it and put it inside a async function)
--- if user exists, we create a JWT token for them using their unique objectId (_id) assigned to them by mongodb at the time of storing and then we respond them back with that generated token.


NOTE: 

- Before we run and check this two endpoints working correctly - we first need to do one thing

- our code should know where my mongodb database is - we do that by connecting our mongoDB database to our code.

** mongoose.connect() with our database credentials - cluster url and the name of the database 
**** rem - if we dont have any already made database collection in our cluster or if we want to make a new database collection in our cluster- we can do that- attach that into our cluster url at the last

** mongoose.connect(mongodb+srv://anandnaman02:v9jPNDcVAXn0QXxN@cluster0.6k4iz.mongodb.net/my_database_name)

*/


/*

~~~~~~~~~ checking if these two endpoints are working or not ~~~~~~~~~~~

- we run this using node index.js 
- open postman and send a signup request with the email, password and username 

- it should store my credentials inside the database 


====> inside todo-naman-2277 collection - we can see the user's credentials stored.

_id: 67b9e8dfc87ba559a8756d24
email: "naman@gmail.com"
password: "123123"
__v: 0



NOTE: 

even when sometimes, our backend application crashes- we are not needed to re put the data of user - it persists in the database.
this is the whole point of database- backend may or may not crash- but data should persist in the database.
*/






// both the below endpoint will be authenticated - only when user is logged in, can they be able to hit those.

// endpoint that user can hit from the frontend to create the new todo 
app.post("/todo", (req,res)=>{

})


app.get("/todos", (req,res)=>{

})


app.listen(3000)



// up until now, we used to shove everything in the backend only, now we will add all of our database logic separately.

// for that, we will create a new file - db.js and put all the databse logics over there.

// NOTE that we can even put those code here but to structure them better, we want to put them in separate file 
