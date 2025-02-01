// in express.js,, middlewares are functions that have access to the request object(req), response obj(res) and the next function in the application request-response cycle.

// it can perfrom majorly three things:
// 1. it can modify the request-or-response object.
// 2. it can stop the request at itself if he wants.
// 3. calling the next middleware function in the stack.

// **********************************************************************


// // lets say we want to count the no oof times either of the two routes were hit 



// const express = require("express")
// const app = express()


// let requestCount = 0 // global req count variable - every time either of the route gets hit, we increase it by one.


// // lets create a func and put the code base to count no of requests hit in it 
// function requestCounter(){
//     requestCount +=1 
//     console.log("Total request count is: " + requestCount);
//     // console.log(`Total request count is ----> ${requestCount}`);
// }


// // route handlers - /sum 

// app.get("/sum", function(req,res){

    
//     // calling the func which calculates the no of requests hit 
//     requestCounter()

//     /*

//     --> this part is put inside a separate function defined outside
//     --> we will directly call that function here
//     requestCount +=1 
//     console.log("Total request count is: " + requestCount);
//     // console.log(`Total request count is ----> ${requestCount}`);

//     */


//     // access the a andd b input first
//     const a = parseInt(req.query.a)
//     const b = parseInt(req.query.b)

//     // now respond back after doing the ops 
//     res.json({
//         answer: a + b
//     })

// })


// // route handler - /multiply
// app.get("/multiply", function(req,res){

//     requestCounter()


//     // access the a andd b input first
//     const a = parseInt(req.query.a)
//     const b = parseInt(req.query.b)

//     // now respond back after doing the ops 
//     res.json({
//         answer: a * b
//     })

// })


// app.listen(3000)




// we have not yet introduced middlewares in the above code. 
// tho, middleware is like that function (requestCounter) only 
// just that it must have 3 args- req, res and next fun. 
// why? bcoz it needs to be able to modify the req content 
// it should be able to stop the request from moving to next function.

// The above func is only just another function now, but we will convert it into a middleware now by giving it 3 args and allowing it to modify the req content, and also making it able to stop or move the request to next middleware function.



// *********** middlewares in code *****************************

// lets say we want to count the no oof times either of the two routes were hit 



// const express = require("express")
// const app = express()


// let requestCount = 0 


// // middleware func --> which calc the no of times the requests are getting hit -- it also has its own functionalities intact.

// function requestCounter(req, res, next){
//     requestCount +=1 
//     console.log("Total request count is: " + requestCount);
    

//     // middleware can modify the req content 
//     // it adds a name in the request 
//     req.name = "randomName123"

//     // only when it calls the next(), the request passes to next middleware func.
//     next()


//     // when it doesnt call the next() func, it must respomnd back to user specifying this, else the request will be hung 
    
//     /*

//     res.json({
//         message: "you are not allowed!"
//     })

//     */

//     // res.json({
//     //     message: "you are not allowed!"
//     // })

// }


// // route handlers - /sum 

// app.get("/sum", requestCounter, function(req,res){


//     // we need to use req.name to see the name set in the request by the middlware above 
//     console.log("inside sum: " + req.name); 
    



//     // access the a andd b input first
//     const a = parseInt(req.query.a)
//     const b = parseInt(req.query.b)

//     // now respond back after doing the ops 
//     res.json({
//         answer: a + b
//     })

// })


// // route handler - /multiply
// app.get("/multiply", requestCounter, function(req,res){


//     // access the a andd b input first
//     const a = parseInt(req.query.a)
//     const b = parseInt(req.query.b)

//     // now respond back after doing the ops 
//     res.json({
//         answer: a * b
//     })

// })



// // admin route handler which doesnt use middleware and simply return total request count until now 

// app.get("/admin", function(req,res){
    
//     // it doesnt increase the request count upon calling.
//     // simply return ab tak ka total request count 

//     res.json({
//         message: " Total request count ab tak is: " + requestCount
//     })
// })


// app.listen(3000)


// /*
// - name is not a global variable. Use req.name inside the route.
// - Middleware modifies req before passing it to the next function.
// - Always use req.<property> when setting or getting middleware-injected values.

// */







// ~~~~~~~~~~~~~~~~~ app.use(middleware) - global middleware  ~~~~~~~~~~~~~~~~



const express = require("express")
const app = express()


let requestCount = 0 


// middleware func --> which calc the no of times the requests are getting hit -- it also has its own functionalities intact.

function requestCounter(req, res, next){
    requestCount +=1 
    console.log("Total request count is: " + requestCount);

    // only when it calls the next(), the request passes to next middleware func.
    next()

}


// admin route handler which doesnt use middleware and simply return total request count until now 

app.get("/admin", function(req,res){
    
    // it doesnt increase the request count upon calling.
    // simply return ab tak ka total request count 

    res.json({
        message: " Total request count ab tak is: " + requestCount
    })
})



// we will use "app.use(middleware fun)" if we want every route below this uses this middleware. 

// every route handler below this will use this middleware
// route handlers above it wont use this middlewares 

app.use(requestCounter)



// route handlers - /sum 

app.get("/sum", function(req,res){


    // access the a andd b input first
    const a = parseInt(req.query.a)
    const b = parseInt(req.query.b)

    // now respond back after doing the ops 
    res.json({
        answer: a + b
    })

})


// route handler - /multiply
app.get("/multiply", function(req,res){


    // access the a andd b input first
    const a = parseInt(req.query.a)
    const b = parseInt(req.query.b)

    // now respond back after doing the ops 
    res.json({
        answer: a * b
    })

})


app.listen(3000)

