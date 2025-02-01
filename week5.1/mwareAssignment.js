// create a middleware function that logs each incoming requests http method, URL, and timestamp to the console.



const express = require("express")
const app = express()


// middleware function 

function loggerMiddleware(req,res,next){

    // logs the http method 
    console.log("method is "+ req.method);

    // just google these if dont know how 

    //2. log URL
    console.log("URL is " + req.url);
    

    // 3. log the timestamp- we'll use new Date()

    console.log(new Date());

    /*
    // 4.5.6.
    console.log(req.protocol); // HTTP or HTTPS
    console.log(req.host);     // Hostname (deprecated, use req.get('host'))
    console.log(req.url);       // path after the domain
    console.log(req.originalUrl); // original url requested
    
    */

    // calling next function is imp 
    next()
    
}



// we want to set this middleware to all the routes handler below. so we use "app.use(middleware)"


app.use(loggerMiddleware)


// "/sum" route handler

app.get("/sum", function(req,res){
    const a = parseInt(req.query.a)
    const b = parseInt(req.query.b)

    res.json({
        sum: a + b
    })
})

// "/multiply" route handler
app.get("/multiply", function(req,res){
    const a = parseInt(req.query.a)
    const b = parseInt(req.query.b)

    res.json({
        multiple: a * b
    })
})

app.listen(3000)


/*

when i hit http://localhost:3000/sum?a=3&b=1


~~~~~~~~~ console output ~~~~~~~~~
method is GET
URL is /sum?a=3&b=1     
2025-02-01T07:36:17.173Z

~~~~~~~~~~ browser ~~~~~~~~~
{
  "sum": 4
}

*/




// *************************************************************** //


// another example : 

// // more detailed code which handles all the different methods 


// const express = require("express")
// const app = express()


// // middleware function 
// function loggerMiddleware(req,res,next){

//     // logs the http method 
//     console.log("method is "+ req.method);

//     // just google these if dont know how 

//     //2. log URL
//     console.log("URL is " + req.url);
    

//     // 3. log the timestamp- we'll use new Date()

//     console.log(new Date());

//     /*
//     // 4.5.6.
//     console.log(req.protocol); // HTTP or HTTPS
//     console.log(req.host);     // Hostname (deprecated, use req.get('host'))
//     console.log(req.url);       // path after the domain
//     console.log(req.originalUrl); // original url requested
    
//     */

//     // calling next function is imp 
//     next()
    
// }



// // we want to set this middleware to all the routes handler below. so we use "app.use(middleware)"


// app.use(loggerMiddleware)

// // handle all GET requests ( * means any route)

// app.get("*", function(req,res){
//     // any GET request be responded with hi there, GET request is successful.

//     res.json({
//         message: "hi there, GET request successful!"
//     })
// })


// // handle all POST requests ( * means any route)

// app.post("*", function(req,res){
//     // any POST request be responded with ---
//     res.json({
//         message: "Hello from POSt!"
    
//     })
    
// })



// // handle all PUT requests ( * means any route)

// app.put("*", function(req,res){
//     // any PUT request be responded with ---

//     res.json({
//         message: "Hello from PUT!"
//     })
// })


// // handle all DELETE requests ( * means any route)

// app.delete("*", function(req,res){
//     // any PUT request be responded with ---

//     res.json({
//         message: "Hello from delete!"
//     })
// })

// app.listen(3000)