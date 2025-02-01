// in express.js,, middlewares are functions that have access to the request object(req), response obj(res) and the next function in the application request-response cycle.

// it can perfrom majorly three things:
// 1. it can modify the request-or-response object.
// 2. it can stop the request at itself if he wants.
// 3. calling the next middleware function in the stack.


// const express = require("express")
// const app = express()
