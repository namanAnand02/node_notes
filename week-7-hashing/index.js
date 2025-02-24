// importing bcrypt library here 
const bcrypt = require("bcrypt")
// next thing- hash the user's sent password before saving it into database at /signup endpoint.

const express = require("express");
const { UserModel, TodoModel } = require("./db");
const { auth, JWT_SECRET } = require("./auth");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

mongoose.connect("add-cluster-url/my-database-name")

const app = express();
app.use(express.json());

app.post("/signup", async function(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    // hash the password using bcrypt before saving it into database using UserModel.create({..})
    const hashedPassword = await bcrypt.hash(password,5)
    console.log(hashedPassword); // just for understanding purpose 

    
    // now, send this salted hashed password into the database using UserModel.create()
    await UserModel.create({
        email: email,
        password: hashedPassword,
        name: name
    });
    
    res.json({
        message: "You are signed up"
    })
});

/*
---> this is what get stored in my mongodb database

{
  "_id": {
    "$oid": "67bcb23085ebf6ac7f0eaf7f"
  },
  "name": "agoda singh",
  "email": "agoda@gmail.com",
  "password": "$2b$05$MjCbhnwcAuYr1jTMV2dvzuIKShk7.26AzSbkWIBuEjNmAAxwKWpcq",
  "__v": 0
}


we can see the password stored is not the plaintext but a salted hashed one.


*/


// signin endpoint

/*
user signs in with email and password 
~~~~~~~~~~ ideal thing to do at /signin ~~~~~~~~~~
step1 : we get the password user is sending at /signin
step2 : we bring saved salt from the database 
step3 : we do the hashing on them - after adding saved salt to this password
step4 : we then compare this hashed password with the already saved salted hashed password at the database during /signup endpoint.

NOTE: thankfully, we dont need to do all these ops separately.
- bcrypt library has a function -> .compare(userPassword at /signin, saved hashed password from the database) which just gives us the final comparison result.

NOTE: we use their email to get the user from the database using UserModel.findOne(...email..)


*/
app.post("/signin", async function(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    // using findOne({...}) function on UserModel gets us all the data saved at the database about this user.
    const response = await UserModel.findOne({

        // give me the user whose email is this
        email: email,
        //// password: password XXXXXXX

    });

    // the response above holds all the user information
    // we will use this to get the user's saved password in the database  --> response.password
    // response.password gives us the salted hashed password saved in the database. 
    // we bring that and give it to bcrypt library to compare it with the password user is sending to sign in.


    // NOTE: we updated the query, we are only sending email sent by the user at /signin and not user's plain text password
    // because the user's plain text password is not something we stored in the database 
    // so when we send this password also inside UserModel.findOne({..email, password}) - it will show no such user exists, bcoz it will also consider finding the user with this plain text password
    // but we have not stored plain text password but the hashed password in our database so its wrong to send password too to find the user, only email will do and find the user for us.

    if (!response){
        // if there is no user in the database which has this email
        // we will simply respond back to the user that he is not authorised.
        res.status(403).json({
            message: "user does not exist in our database"
        })
        // and return from here
        return
    }


    // we now use bycrypt library to compare the saved password with the password user is signing in with 

    const passwordMatched = await bcrypt.compare(password, response.password)

    // bcrypt.compare does all the work, it will extract all the info it requires from the hashed password and do the comparison - basically take care about the comparison thing and give us the result.


    // if the password matched, we then generate token for the user and sends him the token else--
    if (passwordMatched) {
        const token = jwt.sign({
            id: response._id.toString()
        }, JWT_SECRET);

        res.json({
            token
        })
    } else {
        res.status(403).json({
            message: "Incorrect creds"
        })
    }
});


/*

it works beautifully. 
user sends email and password at the /signin endpoint

UserModel.findOne(..) tries to find the existence of user using email
if he finds the user, saves its info into the response variable.

then we use bcrypt.compare(userPlainPasswrd, response.password) to compare the passwords 

if comparison is successful, we generate the token and sends it to the user.

*/


app.post("/todo", auth, async function(req, res) {
    const userId = req.userId;
    const title = req.body.title;
    const done = req.body.done;

    await TodoModel.create({
        userId,
        title,
        done
    });

    res.json({
        message: "Todo created"
    })
});


app.get("/todos", auth, async function(req, res) {
    const userId = req.userId;

    const todos = await TodoModel.find({
        userId
    });

    res.json({
        todos
    })
});

app.listen(3000);