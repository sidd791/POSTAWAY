import dotenv from "dotenv"
dotenv.config()
import app from "./app.js"
import { connectDb } from "./src/db/connectDb.js"

connectDb()
.then(()=>{
    app.listen(process.env.PORT, ()=>{
        console.log(`⚙️  Server is running on port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("Error connecting to the Database.", err)
})