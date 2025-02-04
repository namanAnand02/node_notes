const express = require("express")
const cors = require("cors")
const app = express()

// midddleware 

app.use(express.json())


// to add cors middleware 
app.use(cors()) // this allows cross origin req-res thingy for all URLs


// app.use(cors({
//     "domains": ["https://google.com", "https://employee@google.com"]
// })) // this will only allow these two mentioned domains to fetch cross-origin requests from this server.



app.post("/sum", (req, res)=>{

    const a = parseInt(req.body.a)
    const b = parseInt(req.body.b)

    res.json({
        answer: a + b
    })
})

app.listen(3001)



/*

What Does 204 Preflight Mean?
- Preflight requests happen when your frontend sends a POST request with custom headers (Content-Type: application/json).
- The browser first sends an OPTIONS request to check if the server allows the request.
- A 204 (No Content) response means the preflight request was accepted but doesn’t return any data.




What Does 200 Fetch Mean?
- After the preflight request is accepted, the actual POST request is sent.
- The response status 200 OK confirms that the backend processed the request successfully.
- 278 B → This indicates that 278 bytes of data were returned in the response
*/

// if frontend and backend both are served on the same domain, there would be no problem of cross-origin request anyway.

// to serve html file or any folder using node is ----> npx serve
// it then serve that file on http server and gives us two link 
// one local link and the other network link 
// using network link, we can access the folder from the another device on same wifi 