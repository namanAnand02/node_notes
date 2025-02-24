
/*

    try{
        functions or any code part jis par you have strong doubts ki they'll throw error
    
        } catch(error){
                    if error gets caught, do this 
                                ---
            } finally{
                    -- do this always --
     
                }

*/

app.post("/signup", async function(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    let errorThrown = false
    try{
        // hash the password using bcrypt before saving it into database using UserModel.create({..})
        const hashedPassword = await bcrypt.hash(password,5)
        console.log(hashedPassword); // just for understanding purpose 

        
        // now, send this salted hashed password into the database using UserModel.create()
        await UserModel.create({
            email: email,
            password: hashedPassword,
            name: name
        });

    } catch(error){
        // if error is caught - catch the error and implement this thingy
        // do this instead on finding error but dont shut my appn down

        //// console.log("error found- either could be duplicate email or other");

        // 1. make errorThrown var as True
        // 2. respond the user in the json format
        errorThrown = true
        res.json({
            message:"User already exists"
        })

    
        
    }
    
    // there cant be two response being sent to the user at a time - otherwise system poops.

    // if there was no error caught - do this 
    if(!errorThrown){
        res.json({
            message: "You are signed up"
        })
    }

});
