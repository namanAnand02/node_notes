
// // --------- create a http server using express --------------------//

// installing express first as it is an external library 
// import express module using require function and store it in express variable 
const express = require("express")

// create an express application using express function 
const app = express()



// console.log(express);

// console.log("----------------------");

// console.log(app);



// handle route handler --> defining / route handler 
// i.e if a request comes on "/" endpoint, what should happen?- (get request)

// create a route handler for GET request on the root URL 
app.get("/", function(req,res){

    // send a response to the client 
    // res.send("hello world")
    res.send("<h1>hello world</h1>")
})

// listen at 3000 port
// i.e start the server on port 3000 
app.listen(3000) 


// -----------------------------------------------------------//

