const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensure username is unique
    trim: true, // Remove whitespace
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
    lowercase: true, // Convert to lowercase for uniformity
    trim: true, // Remove whitespace
  },
  password: {
    type: String,
    required: true,
  }
});

// Secure the password with bcrypt
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }

  try {
    const saltRound = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(user.password, saltRound);
    user.password = hash_password;
    next();
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

// Compare the password
userSchema.methods.comparePassword = async function(password){
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.error(error);
    throw new Error("Password comparison failed");
  }
}

// Generate JWT token
// userSchema.methods.generateToken = async function () {
//   try {
//     return jwt.sign(
//       {
//         userId: this._id.toString(),
//         email: this.email,
//       },
//       process.env.JWT_SECRET_KEY,
//       { expiresIn: "24h" }
//     );
//   } catch (error) {
//     console.error(error);
//     throw new Error("Token generation failed");
//   }
// };

userSchema.methods.generateToken = function () {
    const user = this;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Set your token expiration as needed
    });
    return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
