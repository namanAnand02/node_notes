
// ------------ todo-app (hardcoded new todo)  ----------------//


const express = require("express")

const app = express()

let todo_arr = []

// POST route to add a new todo (without reading req.body)
app.post("/", function (req,res){
    
    // manually adding todos instead of reading from req.body
    let newTodo = {
        title: "todo-" + (todo_arr.length + 1),

        id: todo_arr.length + 1 
    }

    // pushing this new todo into the todo array 
    todo_arr.push(newTodo)

    // response back to the client that the new todo was added successfully.
    res.send("Todo added: " + JSON.stringify(newTodo))
})


// GET route to return all todos 
app.get("/", function(req,res){
    res.send(todo_arr)
})


// listen on port 3000
app.listen(3000)


/*
-------- explanantion --------

res.send(...) → This is used to send a response back to the client.

JSON.stringify(newTodo) → Converts the newTodo object into a string so it can be included in the response.

//
Why Do We Use res.send() in a POST Request?
A POST request is used to create or add new data on the server. However, after handling the request, the server must respond to let the client know what happened.
//

//
If We Don’t Use res.send():
The client (like Postman, a browser, or a frontend app) won’t receive any response, leading to an indefinite request hang.
The request will complete, but the client won’t know if the data was added successfully.
//

//
-res.send() is necessary in POST requests because the client expects a response.
-Using JSON.stringify() inside a string is not the best practice; instead, return structured JSON with res.json().
-A POST request should ideally return a 201 status code and the created data.
//

------------ ------------
*/



// when we'll learn about middlewares, i'd use that to accept json data from the request body.
// express.json() allows the server to accpet the JSON data from the request body.
