const mongoose = require("mongoose");

const employeeSchma = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    mobile:{
        type: Number,
        required: true
    },
    designation:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    course:{
        type: [String],
        enum: ['MCA', 'BCA', 'BSC'],
        required: true
    },
    file:{
        type: String
    },
    admin:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Admin",
        required: true
    }

},{
    timestamps: true
});


const Employee = mongoose.model("Employee", employeeSchma);
module.exports = Employee;