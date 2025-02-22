const mongoose = require("mongoose")

// next part - create the schema of our database 
// so first we import the schema class which mongoose library provides us. 

const Schema = mongoose.Schema
const ObjectId = mongoose.ObjectId



// defining different schemas 

// rem we have two databse collection - users and todos
// so we need to define schemas for users table and todos table - i.e user schema and todo schema 


// 1. defining users schema 
const User = new Schema({
    // what all data will be in users collection 
    // explain their schema here - structure or form they will be in here 

    email: String,
    password: String,
    name: String
})


/*

// 1️. Define Users Schema
const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true }
});

✔ Ensures data validation
✔ Prevents duplicate emails
✔ Defines required fields


*/

// 2. defining todos schema - how all the data related to todos schemas will be inside todos collection 

const Todo = new Schema({
    title: String,
    done: Boolean,
    userId: ObjectId

    // NOTE: since the userId will be objectId and not string, we need to import ObjectId beforehand from mongoose 

})

/*

// 2️. Define Todos Schema
const TodoSchema = new Schema({
    title: { type: String, required: true },
    done: { type: Boolean, default: false }, // ✅ Default value for 'done'
    userId: { type: ObjectId, ref: "users", required: true } // ✅ Reference to UserModel
});

*/


// next we need DATA MODEL which could help us call the functions defined in the backend endpoints such as /signup - so that the data sent at those backend endpoints gets stored in our database.


// ~~~~~~~ CREATE MODELS ~~~~~~~~~~~~~~~~~~~~


// 1. UserModel defined
const UserModel = mongoose.model('users', User) // (database collection, Schema to follow while putting)


// mongoose.model says ki aapko kaun se collection mein data dalna hai- which collection (existing in the database) do you want to put the data in??
// ---> I want to put my data in Users collection 
// ---> and the next argument (User) is the schema in which i want to put 

// 2. TodoModel defined
const TodoModel = mongoose.model("todos", Todo) // (put the data in todos collection, follow Todo schema while putting the data in that collection)



// next we need to export these models so that it could get imported in index.js (backend server) and get used.


// we export like this in js 
module.exports={
    UserModel: UserModel,
    TodoModel: TodoModel
}

// now, in index.js, we can import these datamodels and use it 