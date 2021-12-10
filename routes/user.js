const userRouter = require("express").Router();
const { sign, verify } = require("jsonwebtoken");
const { hash, compare } = require("bcryptjs");

const User = require("../models/user");
const { auth } = require("../utils/auth");

// 1. Register a user
userRouter.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password, phone, address } = req.body;
    const user = await User.findOne({ email: email });

    // 1. Check if user already exists
    if (user)
      return res
        .status(500)
        .json({
          message: "User already exists! Try logging in. 😄",
          type: "warning"
        });

    // 2. Encrypt password
    const passwordHash = await hash(password, 12);

    // 3. Create a user in database
    const newUser = new User({
      firstname,
      lastname,
      email: email,
      password: passwordHash,
      phone,
      address
    });
    await newUser.save();
    res
      .status(200)
      .json({ message: "Registered Successfully 🥳", type: "success" });
  } catch (error) {
    return res.status(500).json({ message: error.message, type: "error" });
  }
});

// 2. Login a user
userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. check if user exists
    const user = await User.findOne({ email: email });

    // 2. If user dosen't exists
    if (!user)
      return res
        .status(500)
        .json({ message: "User does not exist. 😕", type: "warning" });

    // 3. Check for password match
    const isMatch = await compare(password, user.password);
    if (!isMatch)
      return res
        .status(500)
        .json({ message: "Incorrect password. ⚠️", type: "error" });

    // 4. if login success, create a token
    const payload = { id: user._id };
    const token = sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: "1d"
    });

    res.json({
      token,
      message: "Sign in Successful ✌️",
      type: "success",
      user
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, type: "error" });
  }
});

// 3. Get the user data
userRouter.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({ message: "User found 🥳", type: "success", user });
  } catch (error) {
    res.status(400).json({ message: error.message, type: "error" });
  }
});

// 4. Verify a user
userRouter.get("/verify", async (req, res) => {
  try {
    const token = req.header("Authorization");

    // 1. if there is no token
    if (!token) return res.send(false);

    // 2. Verify the token
    const verified = verify(token, process.env.TOKEN_SECRET);
    if (!verified) return res.send(false);

    // 3. if the user exists in our database
    const user = User.findById(verified.id);
    if (!user) return res.send(false);
    console.log(user);

    return res.status(200).send(true);
  } catch (error) {
    return res.status(500).json({ message: error.message, type: "error" });
  }
});

module.exports = { userRouter };
