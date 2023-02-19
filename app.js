//jshint esversion:6
require('dotenv').config()
//console.log(process.env) // remove this after you've confirmed it is working
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const app=express();
var encrypt = require('mongoose-encryption');
mongoose.set('strictQuery', true);
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

//for encrytption we will use this type of model
const userSchema=new mongoose.Schema({
    email:String,
    password:String
});

//For convenience, you can also pass in a single secret string instead of two keys.
var secret=process.env.SECRET;
userSchema.plugin(encrypt, { secret:secret  ,encryptedFields:['password']});


const User=new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});


app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    const newuser=new User({
        email:req.body.username,
        password:req.body.password
    })
    newuser.save(function(err){
        if(err)
        console.log(err)
        else
        res.render("secrets");
    });
});
app.post("/login",function(req,res){
   const email=req.body.username;
    const password=req.body.password;

    User.findOne({email},function(err,answer){
        if(err)
        console.log(err)
        if(answer.password===password)
        res.render("secrets")
        
        
    })
})


app.listen(3000,function(err){
    console.log("running at 30000")
});