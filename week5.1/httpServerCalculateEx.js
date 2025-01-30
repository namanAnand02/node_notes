// create a HTTP server 

// it should have 4 routes 
// 1. http:// localhost:3000/multiply?a=1&b=2
// 1. http:// localhost:3000/add?a=1&b=2
// 1. http:// localhost:3000/divide?a=1&b=2
// 1. http:// localhost:3000/subtract?a=1&b=2


/*

Inputs given at the end after ? are known as query parameters (usually used in GET requests)
The way to get them in an HTTP route is by extracting them from the req argument (req.query.a , req.query.b)


(req.query.a, req.query.b)

*/


// const express = require("express")

// const app = express()

// // multiply route 
// app.get("/multiply", function(req,res){
    
//     // first access the inputs being gives as query params 
//     const a = req.query.a
//     const b = req.query.b

//     // respond back the multiplication of a and b output 
//     res.json({
//         ans: a*b
//     })
// })


// // divide route 
// app.get("/divide", function(req,res){
    
//     // first access the inputs being gives as query params 
//     const a = req.query.a
//     const b = req.query.b

//     // respond back the division of a and b output 
//     res.json({
//         ans: a/b
//     })
// })



// // add route 
// app.get("/add", function(req,res){
    
//     // first access the inputs being gives as query params 
//     const a = req.query.a
//     const b = req.query.b

//     // respond back the addition of a and b output 
//     res.json({
//         ans: a+b
//     })
// })


// // subtract route 
// app.get("/subtract", function(req,res){
    
//     // first access the inputs being gives as query params 
//     const a = req.query.a
//     const b = req.query.b

//     // respond back the addition of a and b output 
//     res.json({
//         ans: a-b
//     })
// })



// // listen them on port 3000 

// app.listen(3000)


/*

now when we run localhost:3000/add/a=1&b=2, the output on page is 

{"ans":"12"}

what is the error? we added the inputs 1 and 2 and get output as 12 

ans ---> ?a=1&b=2 , queryparams always get string inputs. 

--> we first need to convert them into integer 

----> const a = parseInt(req.query.a) // converted string a input to integer
----> const b = parseInt(req.query.b)


*/



// ********** correct code : converted string input into integer input first **********



const express = require("express")

const app = express()

// multiply route 
app.get("/multiply", function(req,res){
    
    // first access the inputs being gives as query params 
    const a = parseInt(req.query.a)
    const b = parseInt(req.query.b)

    // respond back the multiplication of a and b output 
    res.json({
        ans: a*b
    })
})


// divide route 
app.get("/divide", function(req,res){
    
    // first access the inputs being gives as query params 
    const a = parseInt(req.query.a)
    const b = parseInt(req.query.b)

    // respond back the division of a and b output 
    res.json({
        ans: a/b
    })
})



// add route 
app.get("/add", function(req,res){
    
    // first access the inputs being gives as query params 
    const a = parseInt(req.query.a)
    const b = parseInt(req.query.b)

    // respond back the addition of a and b output 
    res.json({
        ans: a+b
    })
})


// subtract route 
app.get("/subtract", function(req,res){
    
    // first access the inputs being gives as query params 
    const a = parseInt(req.query.a)
    const b = parseInt(req.query.b)

    // respond back the addition of a and b output 
    res.json({
        ans: a-b
    })
})



// listen them on port 3000 

app.listen(3000)


// output of localhost:3000/add?a=1&b=2 

// -> {
// "ans":3
// }

//correct !!

// for GET, localhost:3000/divide?a=1&b=2 
/*
{
    "ans": 0.5
}
*/