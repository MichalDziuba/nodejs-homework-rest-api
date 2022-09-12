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
const verifyUser = async (verificationToken) => {
  await User.findOneAndUpdate(
    {
      verificationToken: verificationToken,
    },
    { $set: { verify: true, verificationToken: "null" } },
    {
      new: true,
      runValidators: true,
      strict: "throw",
    }
  );
};
const resendEmailToUser = async (email) => {
  const user = await User.findOne({ email: email });
  if (user.verify) {
    throw new Error();
  }
  await user.sendMail(user.email, user.verificationToken);
};
module.exports = {
  findUserByEmail,
  updateUserData,
  findUserById,
  verifyUser,
  resendEmailToUser,
};
