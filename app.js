const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });


const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const path = require('path');
const userModel = require("./models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');





app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.get("/", (req,res) => {
  res.render("index");
})

app.post("/create", (req,res) => {
  let {username,email,password}=req.body;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
  
      let createduser = await userModel.create({
        username,
        email,
        password: hash
      })

      let token = jwt.sign({email}, "hihihi")
      res.cookie("token", token);

      res.send(createduser);
    })
  })
})

app.get("/login", (req,res) => {
  res.render("login");
})

app.post("/login", async (req,res) => {
  let user = await userModel.findOne({email: req.body.email});
  console.log(user);
  if(!user) return res.send("something went wrong");

  bcrypt.compare(req.body.password, user.password, function(err, result) {
    console.log(result);
    if(result){
      let token = jwt.sign({email: user.email}, "hihihi")
      res.cookie("token", token);
      res.render("profile");
    } 
    else res.send("something went wrong");
});
})

app.post("/logout", (req,res) => {
  res.cookie("token", "");
  res.redirect("/");
})

app.listen(3000);
