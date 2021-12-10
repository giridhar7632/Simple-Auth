const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    unique: true
  },
  address: String,
  password: {
    type: String,
    required: true
  }
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the password should not be revealed
    delete returnedObject.password;
  }
});

const User = model("User", userSchema);

module.exports = User;
