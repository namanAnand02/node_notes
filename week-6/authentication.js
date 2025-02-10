const express = require("express")
const app = express()

// 2. middleware to parse the body sent with post requests 
// if we dont use this, req.body inside post wont be able to get user body.
app.use(express.json())


// 3. create an in memory variable called users where we store the username, password, and a token.
const users = []

// 5. a func called generateToken which generates a random token of length 32 
function generateToken() {
    let options = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let token = "";
    for (let i = 0; i < 32; i++) {
        // use a simple function here
        token += options[Math.floor(Math.random() * options.length)];
    }
    return token;
}



// 1. handle two route handlers here --> one for signing up and other for signing in 

app.post("/signup", (req,res)=>{
    // to parse the body passes with post request, we must first parse them using express.json() middleware
    
    // we only demand username and password for the moment from the user to signup at our website.
    const username = req.body.username;
    const password = req.body.password;

    // // can add some checks on password or the username provided by the user here 
    // if (username.length < 5){
    //     res.json({
    //         message: "Your username is very small"
    //     })
    //     return; 
    // }

    // NOTE: input validation later on using ZOD
    
    // checks to ensure same user doesnt do more than one signup 
    // if (users.find(u => u.username === username)){
    //     res.json({
    //         message: "You have already signup."
    //     })
    //     return 
    // }


    // we store the user's username and password at the in memory varibale-" users " that we created.
    users.push({
        username: username,
        password: password
    })


    // after storing the user's username and password, we tell them that they are signed in. 
    res.json({
        message: "You are signed in"
    })
    console.log(users);
    

})

app.post("/signin", (req,res)=>{
    // step 6: 
    const username = req.body.username
    const password = req.body.password

    // check for already existing user 

    // users --> it is an in memory variable 
    // users --> array of objects 
    // foundUser ---> one object from users array of objects 
    // foundUser shud be one instance of the users arr (in memory variable) if the user exists 
    // foundUser initially shud contain username and password, we'll match that -- if that matches, we then add a token to this foundUser 
    const foundUser = users.find(function(u){
        if (u.username == username && u.password == password){
            return true
        } else{
            return false
        }
    })

    if (foundUser){
        // if this is existing user, generate a token first using generate token function call
        // then send that token to the user
        // and also store that token into users arr(in memory variable)

        const token = generateToken()
        // adding this token into foundUser 
        foundUser.token = token

        res.json({
            message: token
        }) 
    } else{
        res.status(403).send({
            message: "Invalid username or password"
        })
    }

    console.log(users);
    

})

app.listen(3000) // http server is listening on 3000 port 

// the app instance has two routes at the moment - the signup and the signin routes

// POSTMAN - it lets us send http requests 




/*
1. two post handlers signup and signin 
2. use a middleware (express.json()) to parse the body sent along with post request 
3. create an in memory variable called users where we store the username, password, and a token. 
4. complete the signup endpoint to store user information in the in memory variable.
4.1.1 we accept username and password from user and store them
4.1.2 after storing their credentials, we respond back with a msg
4.1.3 we can also add some checks here like the username must be >= 5 letters etc 
        [certain checks we must include like same user doesnt get sign up more than once] 
NOTE : INPUT validation --> we will learn later using ZOD 

5. Create a func called generateToken that generates a random string for us 
(so that whenever a user signs in, we need to return him a token)

6. finish the signin endpoint. It should generate a token for the user and put it in the memory variable for that user

----> until 5th step, our in memory variable stors only the username and password. we want it to also store that random generated token inside it.

the token will be the recent token stored. 
   
i.e 
users = [{
    username: "naman",
    password: "123@123"
    token: asrj78KJKh

}]

---> how do we do that ?


** inside the /signin POST route, first we take the access to the username and password using req.body....

** then we match this to the saved username and password in the users arr (in memory variable). we check for the user's existance and the password match.

** we only generate the token for them if their username and passwords are correct.


*/