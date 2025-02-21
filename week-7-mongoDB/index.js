// we have already installed two dependencies so far - express and mongoose 
// later on- we will also install jwtwebtoken 

// create the skeleton for 4 routes - post /signup, post /login, post /todo(authenticated), Get /todos (authenticated)


const express = require("express")

// importing the data models from db.js

const { UserModel, TodoModel } = require("./db") 
const app = express()

// middlewares to parses the data sent in the body in POST endpoints 
app.use(express.json())

app.post("/signup", (req,res)=>{

    // usual /signup endpoints stuffs, user sends the data through the body alongside, and hence we first parses the data 
    // user is expected to send email, username and password using body at the time of signup
    const email = req.body.email
    const username = req.body.username
    const password = req.body.password





    // we have imported the data models at the top 
    // we can call certain methods/func on those data models by calling them 

    UserModel.insert({
        email: email,
        username: username,
        password: password
    })

    
})


app.post("/signin", (req,res)=>{

})


// both the below endpoint will be authenticated - only when user is logged in, can they be able to hit those.

// endpoint that user can hit from the frontend to create the new todo 
app.post("/todo", authMiddleware, (req,res)=>{

})


app.get("/todos", authMiddleware, (req,res)=>{

})


app.listen(3000)



// up until now, we used to shove everything in the backend only, now we will add all of our database logic separately.

// for that, we will create a new file - db.js and put all the databse logics over there.

// NOTE that we can even put those code here but to structure them better, we want to put them in separate file 
