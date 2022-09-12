const { Schema, model } = require("mongoose");
const bCrypt = require("bcrypt");
const gravatar = require("gravatar");
const { v4: uuidv4 } = require("uuid");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);


const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: {
    type: String,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, "Verify token is required"],
  },
});
userSchema.methods.setPassword = async function (password) {
  this.password = await bCrypt.hash(password, bCrypt.genSaltSync(6));
};
userSchema.methods.validatePassword = function (password) {
  return bCrypt.compare(password, this.password);
};
userSchema.methods.createDefaultAvatar = async function (url) {
  this.avatarURL = await gravatar.url(url);
};
userSchema.methods.createVerificationToken = async function () {
  const verifyToken = uuidv4();
  this.verificationToken = verifyToken;
};
userSchema.methods.sendMail = async function (email, token) {
  const msg = {
    to: email,
    from: email,
    subject: "Please Verify Your Email",
    text: "Click link to verify your email",
    html: `<p>Click link to verify your email: <p><strong><a href="http://localhost:${process.env.PORT}/api/users/verify/${token}">Verify</a><strong>`,
  };
  sgMail
    .send(msg)
    .then((res) => {
    })
    .catch((err) => {
      console.log(err);
    });
};
const User = model("user", userSchema, "users");

module.exports = User;
