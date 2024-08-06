const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); 
const dotenv = require("dotenv"); 

const app = express(); 
dotenv.config(); 

const port = process.env.PORT || 3000 ; 

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.n1grmfz.mongodb.net/registrationFormDB` ,
    {
       ssl: true
    }
).then(() => {
    console.log("Connected to MongoDB successfully");
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

const registrationSchema = new mongoose.Schema({
    name : String , 
    email : String , 
    password: String
});

const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({extended: true})); 
app.use(bodyParser.json()); 





app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/index.html");
})

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body; 
        
        
        
         // Check if the user already exists
         const existingUser = await Registration.findOne({ email: email });
         if (!existingUser) {
            const registrationData = new Registration({
                name, 
                email, 
                password
            });
    
            await registrationData.save();
    
            res.redirect("success");
            
           
         }
         else{
            res.redirect("existing")
         }

        
    } catch (error) {
        res.redirect("error"); 
    }
});

app.get("/success", (req,res) =>{
    res.sendFile(__dirname +"/success.html");
}); 
app.get("/error", (req,res) =>{
    res.sendFile(__dirname +"/error.html");
}); 
app.get("/existing", (req,res) =>{
    res.sendFile(__dirname +"/existing.html");
}); 



app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})




