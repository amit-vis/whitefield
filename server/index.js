const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require('express-fileupload');
const port = 5000;
const app = express();
require("./config/database");
require("./config/passport-jwt")

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload({
    useTempFiles: true
}))

app.use("/", require("./routes"))
app.listen(port, (err)=>{
    if(err){
        console.log("error in listening the server", err);
    }
    console.log("server is listening the port", port);
})