// importing bcrypt library here 
const bcrypt = require("bcrypt")
// next thing- hash the user's sent password before saving it into database at /signup endpoint.

const express = require("express");
const { UserModel, TodoModel } = require("./db");
const { auth, JWT_SECRET } = require("./auth");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { z } = require("zod") 

mongoose.connect("mongodb+srv://a.mongodb.net/zod-learning")

const app = express();
app.use(express.json());

app.post("/signup", async function(req, res) {

    // must perform input validation first thing in any routes 

    // we need to validate req.body - input given by user. So first we need to define the structure we expect the user to send us data in  i.e schema of req.body

    // step 1: define the schema 

    const requireBody = z.object({
        email: z.string().min(5).max(30).email().unique(),
        password: z.string().min(5).max(50),
        name: z.string().min(5).max(40)

    })

    /*
    req.body
    {
        email: String,
        password: String,
        name: String

    } 
    */

    // step 2: parsing of the data 

    //// const parsedData = requireBody.parse(req.body)

    const parsedDataWithSuccess = requireBody.safeParse(req.body)


    // safeParse returns an object with three things - success, body if success, and error. it all gets stored isnide parsedDataWithSuccess. we can use them using dot notation.

    if (!parsedDataWithSuccess.success){
        res.json({
            message: "incorrect format data",
            // to inform the user about their mistake, we can use error that safeParse returns 
            error: parsedDataWithSuccess.error
        })
        // and immediate return after this as parsing gave failure result.
        return
    }

    // if parsing is successful, i.e user sent data in right format - then we move on to do rest of the things.
    
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    // hash the password using bcrypt before saving it into database using UserModel.create({..})
    const hashedPassword = await bcrypt.hash(password,5)
    console.log(hashedPassword); // just for understanding purpose 
    // $2b$05$ym.s1EaTRbx1eTBngsuK7.erh0jI44DlsrXMq
    
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
        //// password: password  XXXX 

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


/*
~~~~~~ Input validation using zod ~~~~~~~~~~

- in /signup endpoint, users can send us anything - we are not validating anything.
- we expect them to give us a string in email, password and name. but user can do bodmashi, can give us any type of data - say he gave object data in email field.


- we have created the backend- people can send any data to the backend.
- and that could result in system shutdown
-- ideally, we should always validate the input sent by user at the start of any route.


- dumb way of doing that - manually write all to be failed cases 

if (typeof email != String || !email.length <5 || !email.includes("@")) {
    res.json({
    message: "email type incorrect"
    })
    return 
} 


- easy and right way of doing input validation is through zod.
- zod is an external library used for schema validation and parsing in typescript.


// how to use zod in our code base 

step 1: install zod library using npm install zod
step 2: import z from zod at the top of the codebase 
const { z } = require("zod")

step 3: define schema to validate inside zod object 

step 4: parsing of the data 

----> parse(req.body) or safeParse(req.body) 

--> safeParse is better to use as it returns an object 

{
success: true/false,
data : (),
error? : [desc of error]
}


we can even show the error to the user using safeParse 

--> parse function either returns the data on success parsing or throws an error which could shut the system and we may need to use try-catch for that.



NOTE : 

- Zod alone can't check uniqueness because it doesn't interact with a database.
- Use a manual database check before proceeding with validation.
- Best practice: Perform validation first, then check uniqueness to avoid unnecessary database queries.

*/