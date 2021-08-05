const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const Api = require("./routes/api");

const MONGODB_URI =
  "mongodb+srv://ahsan88:ahsan123@cluster0.dtvgd.mongodb.net/socialDB?retryWrites=true&w=majority";

const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// app.use((req, res, next) => {
//   if (!req.session.user) {
//     return next();
//   }
//   User.findById(req.session.user._id)
//     .then(user => {
//       req.user = user;
//       next();
//     })
//     .catch(err => console.log(err));
// });
app.use("/api", Api);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
