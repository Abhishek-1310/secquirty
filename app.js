require('dotenv').config()
const express=require("express");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

mongoose.connect("mongodb://localhost:27017/userdb",{useNewUrlParser:true,useUnifiedTopology:true});

const app=express();

console.log(process.env.API_KEY);
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});


userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:['password']});
const User=new mongoose.model("user",userSchema);

//for register
app.post('/register',function(req,res){

    const newUser=new User({
        email:req.body.username,
        password:req.body.password
    });
    newUser.save(function(err){
        if(!err){
            res.render("secrets");
        }
        else{
            console.log(err);
        }
    });
});
//for login  level1

app.post('/login',function(req,res){

    const username=req.body.username;
    const password=req.body.password;

    User.findOne({email:username},function(err,foundUser){

        if(foundUser){

            if(foundUser.password===password){
                res.render("secrets");
            }
            else{
                res.send("you aren't allow to enter");
            }
        }
        else{
            console.log(err);
            res.send("sorry you aren't allow to enter");
        }
        // if(err){
        //     console.log(err);
        // }
        // else{
        //     if(foundUser){
        //         if(foundUser.password === password){
        //             res.render("secrets");
        //         }
        //         else{
        //             res.send("sorry you aren't allow to enter");
        //         }
        //     }
        // }
    });

//level 2 encryption
    
});

app.get('/', function(req,res){
    res.render("home");
});
app.get('/login', function(req,res){
    res.render("login");
});
app.get('/register', function(req,res){
    res.render("register");
});



app.listen(3000, function(){
    console.log("Serevr started on port 3000");
});