const express = require("express");
const app = express();

const port = "3000";

const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/RestAPI');
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const postsRoute = require("./routes/post_route");
app.use("/", postsRoute);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});