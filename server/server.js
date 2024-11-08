import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config'

const server = express();
let PORT = 3000;
// json parser
server.use(express.json());
mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true
});

server.post("/signup", (req, res) => {
    
    let {fullname, email, password} = req.body;

    // validating the data from the frontend 
    if(fullname.length < 3)
    {
        return res.status(403).json({
            "error": "Fullname must be at least 3 letter long"
        })
    }

    return res.status(200).json({
        "Status": "Okay",
        "Success": true
    })
})
server.listen(PORT, ()=>{
    console.log('Listening on port -> '+ PORT);
})