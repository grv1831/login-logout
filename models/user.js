const mongoose = require('mongoose');
const uri = "mongodb+srv://1831gkumar:grv%40123@cluster0.l8fn9i7.mongodb.net/login?retryWrites=true&w=majority&appName=Cluster0";

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String
});

module.exports = mongoose.model("user", userSchema);
