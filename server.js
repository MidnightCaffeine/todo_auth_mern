const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cookieParser());
app.use(express.json());

const uri = process.env.MERNAUTH_ATLAS_URI;
const port = process.env.PORT || 5000;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const User = require("./models/User");
const userInput = {
  username: "check",
  password: "pass1234",
  role: "user",
};
const user = new User(userInput);
user.save((err, document) => {
  if (err) console.log(err);
  console.log(document);
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
