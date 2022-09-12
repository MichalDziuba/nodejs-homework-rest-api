const User = require("./schemas/user");

const findUserByEmail = (email) => User.findOne({ email: email });
const findUserById = (id) => User.findOne({ _id: id });
const updateUserData = (id, data) =>
  User.findOneAndUpdate(
    { _id: id },
    {
      $set: data,
    },
    {
      new: true,
      strict: "throw",
      runValidators: true,
    }
  );

module.exports = { findUserByEmail, updateUserData, findUserById };
