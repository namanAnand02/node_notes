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