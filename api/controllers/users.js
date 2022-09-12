const service = require("../../service/users");
const User = require("../../service/schemas/user");
const { userSchema } = require("../../service/schemas/validation");
const jwt = require("jsonwebtoken");
const path = require("path");
const storeDir=require("../../app")
const fs = require("fs").promises;


const registerUser = async (req, res, next) => {
  const { email, password } = req.body;
  const userExist = await service.findUserByEmail(email);
  const validationResult = userSchema.validate(req.body);
  if (validationResult.error) {
    res.status(400).json(validationResult.error.message);
  } else {
    if (userExist) {
      return res.status(409).json({ message: "Email in use" });
    }

    try {
      const newUser = new User({ email });
      await newUser.setPassword(password);
      await newUser.createDefaultAvatar({email})
      await newUser.save();
      res
        .json({
          user: {
            email: newUser.email,
            subscription: newUser.subscription,
          },
        })
        .status(201);
    } catch (e) {
      next(e);
    }
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  const validationResult = userSchema.validate(req.body);
  if (validationResult.error) {
    res.status(400).json(validationResult.error.message);
  }
  const user = await service.findUserByEmail(email);

  const isPasswordCorrect = await user?.validatePassword(password);
  if (!user || !isPasswordCorrect) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }
  const payload = {
    _id: user._id,
    email: user.email,
  };
  const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "72h" });

  await service.updateUserData(user._id, { token: token });
  res.status(200).json({
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};
const logoutUser = async (req, res, next) => {
  const data = req.user;
  const userId = data._id;

  const user = await service.findUserById(userId);
  if (!user) {
    res.status(401).json({ message: "Not authorized" });
  }
  try {
    await service.updateUserData(userId, { token: null });
    res.json(204);
  } catch (e) {
    next(e);
  }
  next();
};
const currentUser = async (req, res, next) => {
  const data = req.user;
  const userId = data._id;

  const user = await service.findUserById(userId);
  if (!user) {
    res.status(401).json({ message: "Not authorized" });
  }
 
    res.status(200).json({
      email: user.email,
      subscription:user.subscription
    })

  
};

const updateAvatar = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({message:"there is no file"})
  }
  const { description } = req.body;
  const { path: temporaryName } = req.file;
  const fileName = path.join(storeDir, req.file.filename);
  try {
    await fs.rename(temporaryName, fileName);
  } catch (e) {
    await fs.unlink(temporaryName);
    return next(err);
  }
  const isValid = await isImage(filename);
  if (!isValid) {
    await fs.unlink(fileName)
      return res
        .status(400)
        .json({ message: "File isn't a photo but it's pretending" });
  }
  res.json({
    description,
    fileName,
    message: "File uploaded correctly",
    status: 200,
  });
}
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  updateAvatar,
};
