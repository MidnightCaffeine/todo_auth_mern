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

const usersRouter = require('./routes/users.route');
app.use('/users', usersRouter);
const todosRouter = require('./routes/todos.route');
app.use('/todos', todosRouter);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
