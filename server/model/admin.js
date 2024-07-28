const mongoose = require("mongoose");

const adminSchma = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
},{
    timestamps : true
});

const Admin = mongoose.model("Admin", adminSchma);
module.exports = Admin;