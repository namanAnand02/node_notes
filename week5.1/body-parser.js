// commonly used middlewares 

// express.json()
// bodyParser.json()

// they parse the json data being sent by the user in POST/ PUT request.



//************** express.json() middleware **********


// const express = require("express")
// const app = express()

// app.use(express.json())

// app.post("/sum", (req,res)=>{
//     // user sends some json data using body - in POSTMAN

//     // we try to access them here using req.body
//     // it will work because we have used express.json() function middleware which parse the json data sent by the user for us.

//     console.log(req.body);
    
//     const a = parseInt(req.body.a)
//     const b = parseInt(req.body.b)

//     res.json({
//         sum: a + b
//     })


// })

// app.listen(3000)


/*

--> in case of express.json() middleware, we can direct use this, we dont need to require this. 
-----> express.json() is the newer one, under the hood, it has used body-parser only and developed itself.


--> but in case of bodyParser.json() middleware, we are needed to require it first for us to use it. 

*/


// ****************** bodyParser.json() middleware ****************


const express = require("express")
const app = express()

const bodyParser = require("body-parser")

app.use(bodyParser.json())
// note: unlike our-made middlewares, we need to call the full bodyParser,json() function here and not just reference.


app.post("/sum", (req,res)=>{
    // user sends some json data using body - in POSTMAN

    // we try to access them here using req.body
    // it will work because we have used express.json() function middleware which parse the json data sent by the user for us.

    console.log(req.body);
    
    const a = parseInt(req.body.a)
    const b = parseInt(req.body.b)

    res.json({
        sum: a + b
    })


})

app.listen(3000)


/*

now when we send request data in POST using POSTMAN body-raw-json form data

it works

*/