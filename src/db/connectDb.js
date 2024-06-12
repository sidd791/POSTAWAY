import mongoose from "mongoose"

export const connectDb = async() => {
    try {
        await mongoose.connect(`${process.env.MONGODB}POSTAWAY`)
        console.log("Connected to the Database")
    } catch (error) {
        console.log("Error connecting to the database : ", error)
    }
}