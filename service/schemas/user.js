const { Schema, model } = require("mongoose");
const bCrypt = require("bcrypt");
const gravatar = require("gravatar");

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
});
userSchema.methods.setPassword = async function (password) {
  this.password = await bCrypt.hash(password, bCrypt.genSaltSync(6));
};
userSchema.methods.validatePassword = function (password) {
  return bCrypt.compare(password, this.password);
};
userSchema.methods.createDefaultAvatar = async function (url) {
  this.avatarURL= await gravatar.url(url)
}
const User = model("user", userSchema, "users");

module.exports = User;
