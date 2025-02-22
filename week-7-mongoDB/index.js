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
    const name = req.body.username // User schema defines the field as name, not username.
    const password = req.body.password



    // we have imported the data models at the top 
    // we can call certain methods/func on those data models by calling them like UserModel.create({..data..})


    // this is an async operation and hence we must await this and thus make the function handler a async function 
    // await on database call, make the function handler an async func 
    // respond the user that he is logged inn 

    await UserModel.create({
        email: email,
        name: name,
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

            //_id is an object class which has .toString function that we use
            userId : user._id.toString() // must convert this object id into string to be able to see it 
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
(rem that this UserMode.create({..data...}) returns a promise, so we must await this - because without this even if it fails, the code would respond the user that they signedup- and also put it inside a async function)
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

- open postman

- 1.  send a /SIGNUP request with the email, password and username 
(it should store my credentials inside the database )

output:
====> inside todo-naman-2277 collection - we can see the user's credentials stored.

_id: 67b9e8dfc87ba559a8756d24
email: "naman@gmail.com"
password: "123123"
__v: 0



- 2. /SIGNIN endpoint

we put the correct emaid id and password of the user
## so we get jwt token in the postman as a response
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YjllOTBkYzg3YmE1NTlhODc1NmQyNiIsImlhdCI6MTc0MDIzNzY5MH0.lepDb4V7Uz2AuwGkrYkk-c6zUP7jKEx_qUlsRjUW2Rw"
}
    

## also since we have console.log(user) - we get to see the user complete details stored at the database in the console.

{
  _id: new ObjectId('67b9e90dc87ba559a8756d26'),
  email: 'ramesh@gmail.com',
  password: '112233',
  __v: 0
}

NOTE: 

even when sometimes, our backend application crashes- we are not needed to re put the data of user - it persists in the database.
this is the whole point of database- backend may or may not crash- but data should persist in the database.

*/



// ~~~~~~~~~~ NEXT PARTS OF THE CODE - authenticated endpoints ~~~~~~~~~



// both the below endpoint will be authenticated - only when user is logged in, can they be able to hit those.
// at below endpoints - we first do token check (authentication) and basically use TodoModel on them as they are related to todos. 

// to authenticate beforehand the tokens, we will use authMiddleware

// NOTE: we can define middleware anywhere, just keep that in the middle argument of the endpoint where you want to use this




function authMiddleware(req,res,next){

    // we expect the user to give us the token they got in /signin via headers
    const token = req.headers.token

    // after we fetch the token, we extract the decodedData from the token using verify
    const decodedInfo = jwt.verify(token, JWT_SECRET) // verify this token the user sent me with my JWT_SECRET - to ensure my backend only gave this user this token or not 

    // if decodedInfo is correct, we can say user is authenticated and then he is allowed to hit the endPoint he wants to hit - we call next()
    // but also, we want to modify the req and populate it with the userId of the user after it is done checking its authentication.

    // remember - middlewares can modify the req/res objects
    // that way, it is sending an extra info about the user for the endpoints the user is hitting


    if (decodedInfo){
        // populate the req with this user's id
        req.userId = decodedInfo.userId
        // call next()
        next()
    } else{
        res.status(403).json({
            message: "Incorrect Credentials."
        })
    }
} 





// endpoint that user can hit from the frontend to create the new todo 
app.post("/todo", authMiddleware, async (req,res)=>{

    // at authMiddleware - after authenticating the user- modifies the req and adds the user's id into it and then calls next() - so we can access user id using req.userId here 
    const userId = req.userId

    // now with this userId - we can get any details about this user - hit the database and find its details
    // given this userId , how can we put a new todo at this endpoint?

    const title = req.body.title // user sends the title of this new todo - getting it from body
    const done = req.body.done  // user also sends the done status of this new todo - getting it from body

    await TodoModel.create({
        // we are giving the details of the todo the user wants to create
        // we trust TodoModel whose sole work is to put data from backend to the database.

        title: title,
        done: done,
        userId: userId

        // the field should be similar to todo schema defined in the db.js

        // must add userId of the user to the Todo they are creating - it will help us identify this todo belongs to which user.

    })


    res.json({
        message: "new todo created",
        userId : userId
    })



    /* for the moment, just simply returns the userId to the user on hitting this endPoints for understanding purpose.
     we are not putting a new todo or get the todos in the next endpoint - we simply respond the user with the userId on hitting these for the moment for understanding purpose.

    res.json({
        userId : userId
    })

    - it worked ✔✅


    */
})


// endpoint to fetch the existing todos
app.get("/todos", authMiddleware, async (req,res)=>{
    const userId = req.userId // authmware had put this userId inside req, so we are directly accessing it

    const todos = await TodoModel.find({
        userId: userId
    })

    res.json({
        todos
    })



    /*
    // res.json({
    //     userId : userId
    // })
    */

})


app.listen(3000)



// up until now, we used to shove everything in the backend only, now we will add all of our database logic separately.

// for that, we will create a new file - db.js and put all the databse logics over there.

// NOTE that we can even put those code here but to structure them better, we want to put them in separate file 


/*

---> 1. Await mongoose.connect() before starting the server.

--> 2. at /signup endpoint - make sure we ask the user to give details just as things are set in schema 

- User schema is set in db.js - where it defines email, password and name 
- so we must ask user to give their details - email, name and password 
(name and not username - take care of these mistakes)


---> 3. we can also separate the auth related code parts in separate auth file just like db.js to structure our code better.
and then exports the authMiddleware and the JWT_SECRET there bcoz we'll be using these in index.js (use after importing them using require)

go to 100xdevs-cohort-3/week-7-mongo repo for complete code 


*/



/*
~~~~~~~~~~~~ improvements ~~~~~~~~~~~~~~~~

1. password is not hashed 
2. a single crash (duplicate email) crashes the whole app
3. add more endpoints (mark todo as done)
4. add timestamp at which todo was created/ time it needs to be done by 
5. relationships in mongo
6. add validations to ensure email and password are of correct format.


*/