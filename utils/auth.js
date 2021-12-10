const { verify } = require("jsonwebtoken");
const { promisify } = require("util");

const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    let token = req.header("Authorization");
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (!token) {
      return res
        .status(401)
        .json({ status: "error", message: "You are not logged in 🤔" });
    }

    const decoded = await promisify(verify)(token, process.env.TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "The user with this token no longer exists. 😕"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: "You are not logged in 🤔", type: "error", error });
  }
};

module.exports = { auth };
