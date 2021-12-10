const mongoose = require("mongoose");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");

const { userRouter } = require("./routes/user");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const uri = process.env.MONGO_URI;

mongoose
  .connect(uri)
  .then(() => console.log("MongoDB connection is established successfully 🎉"))
  .catch(err => console.log(err));

// app.get('/', (req, res) => {
//   res.send("<a href='/user/login'><button>login</button></a> or <a href='/user/register'><button>register</button></a>")
// })

app.use(express.static("build"));
app.use("/user", userRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port} 🚀`));
