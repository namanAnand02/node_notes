const express = require("express")
const app = express()
const jwt = require('jsonwebtoken')

// 3. creating a JWT_SECRET variable
const JWT_SECRET = "randomNamanRamjane"


app.use(express.json())


const users = []



// 1. handle two route handlers here --> one for signing up and other for signing in 

app.post("/signup", (req,res)=>{

    const username = req.body.username;
    const password = req.body.password;


    // we store the user's username and password at the in memory varibale-" users " that we created.
    users.push({
        username: username,
        password: password
    })


    // after storing the user's username and password, we tell them that they are signed in. 
    res.json({
        message: "You are signed up."
    })
    console.log(users);
    

})


// step 4 implemented here.
app.post("/signin", (req,res)=>{

    const username = req.body.username
    const password = req.body.password
 
    const foundUser = users.find(function(u){
        if (u.username == username && u.password == password){
            return true
        } else{
            return false
        }
    })

    if (foundUser){

        // const token = generateToken()

        const token = jwt.sign({
            username: username
        }, JWT_SECRET)


        // this token is a statless token now, so we dont need to store this into a database anymore. as the token itself has the username info inside it, later, when we'll need the username for authentication, we'll extract that from this token itself.

        // we don't need to store this token into a variable anymore 
        // foundUser.token = token // not needed anymore

        res.json({
            token: token
        }) 
    } else{
        res.status(403).send({
            message: "Invalid username or password"
        })
    }

    console.log(users);
    

})

// *********** creating an authenticated EP ******************


// step 5 used here 

app.get("/me", function(req,res){

    // user still send us a JWT token
    const token = req.headers.token 
    // but now we dont need to hit database to check for user existence. we'll extract the username from JWT and compae this username (whether this username exists or not )


    const decodedInformation = jwt.verify(token, JWT_SECRET)
    // it uses the token given by user(jwt token) and the JWT_SECRET to extract all the info encoded into this JWT.
    // decodedInformation = {username: namanAnand}


    // so now, we can directly access the username from this decodedInformation

    const username = decodedInformation.username


    // so we got the username of the user, if we had to return just the username, we would have done it here. like res.json({username: username})

    // but since we also need to return their passwords, we'll still need to look in database. But this time, we'll use username to find the user in our database

    let foundUser = users.find(function(u){
        return u.username == username

        // find() expects the callback to return the actual object when the condition is met
    })

    if (foundUser) {
        res.status(200).json({
            username: foundUser.username,
            password: foundUser.password,
            message: "user info returned."
        })

        // cant send two responses back at user, so merged both in one (username, password and the message part)

    } else{
        res.status(401).send({
            message: "token invalid. Unauthorized."
        })
    }




})

app.listen(3000)



/*

1. get rid of generateToken function
2. install jsonwebtoken dependency using npm install jsonwebtoken
3. create a JWT_SECRET variable
4. Create a JWT for the user instead of generating a token inside the /signin endpoint. Use jwt.sign({..}, JWT_SECRET) to generater JWt token

** inside the /signin endpoint, we used to call the generateToken func to generate a token for the user.
But now, we want to convert the user's username to a JWT and return it to him.

** jsonwebtoken library helps us do that. it has few func defined that we will use 

** but first we need to import jsonwebtoken library using require and then we can use those defined functions

** const token = jwt.sign()
** jwt.sign({username:....}, JWT_SECRET), it creates the token by encoding the info we want(username here) and it does by using the JWT_SECRET.

** jwt.sign({username:....}, JWT_SECRET) ----> it takes the username and encode it into a JWT token using the JWT_SECRET.


** jwt.sign({username:....}, JWT_SECRET) ---> it takes 2 argument. first one --> what do we want to encode into JWT (just theb username in this case, do not put password into it)
second one---> secret/key to create this token (JWT_SECRET)


5. In the /me endpoint, use jwt.verify to verify the token.


** first we parse the jwt token sent by the user from the header

** then we verify the token 
** for that, first we decodeInfo from the JWT using ---> const decodedInformation = jwt.verify(token, JWT_SECRET)

** this decodedInfo has every data which was encoded into JWT. so we can extract those using dot notation.

*/


/*
token --> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhbWVzaCIsImlhdCI6MTczOTI2OTI2OH0.pRgSJfaxbubKtyHYHwS2hvOXrgFKTUZHAl4xw85MK-k


in this case, the JWT sent to user looks like this 

*/
