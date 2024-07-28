const mongoose = require("mongoose");
require("dotenv").config();

async function connectDB(){
    try {
        await mongoose.connect(process.env.mongourl,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("connected to database successfully!")
    } catch (error) {
        console.log("error in connecting to database", error)
    }
}

connectDB();

module.exports = mongoose.connection;