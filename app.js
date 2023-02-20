//jshint esversion:6
require('dotenv').config()
//console.log(process.env) // remove this after you've confirmed it is working
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const app=express();
const session = require('express-session');
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");

mongoose.set('strictQuery', true);
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));


app.use(session({
    secret: 'This is out little secret',
    resave: false,
    saveUninitialized: true
  }));

  app.use(passport.initialize());
  app.use(passport.session());


mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

//for encrytption we will use this type of model
const userSchema=new mongoose.Schema({
    email:String,
    password:String
});
userSchema.plugin(passportLocalMongoose);




const User=new mongoose.model("User",userSchema);


passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());//creating cookies
passport.deserializeUser(User.deserializeUser());//deleting cookies


app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});


app.get("/register",function(req,res){
    res.render("register");
});
app.get("/logout",function(req,res){
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
});

app.get("/secrets",function(req,res){
    if(req.isAuthenticated()){
        res.render("secrets");
    }
    else
    res.redirect("/login");
});

app.post("/register",function(req,res){
   User.register({username:req.body.username},req.body.password,function(err,answer){
    if(err)
    {
        console.log(err);
        res.redirect("/register");
    }
    else
    {
        passport.authenticate("local")(req,res,function(){
            res.redirect("/secrets");
        })
    }
   })
});
app.post("/login",function(req,res){
   const user=new User({
    username:req.body.username,
    password:req.body.password
   });
   req.login(user,function(err){
    if(err)
    console.log(err)
    else
    {
        passport.authenticate("local")(req,res,function(){
            res.redirect("/secrets");
        })
    }
   });
});


app.listen(3000,function(err){
    console.log("running at 30000")
});