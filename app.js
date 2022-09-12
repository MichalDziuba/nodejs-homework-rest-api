const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const path = require("path");
const fs = require("fs").promises;
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const Jimp = require("jimp");
const contactsRouter = require("./api/routes/contacts");
const usersRouter = require("./api/routes/users");
const authMiddleware = require("./middlewares/jwt");
const service = require("./service/users");
const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

const uploadDir = path.join(process.cwd(), "tmp");
const storeDir = path.join(process.cwd(), "public/avatars");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}${file.originalname}`);
  },
});

const extensionWhiteList = [".jpg", ".jpeg", ".png", ".gif"];
const mimetypeWhiteList = ["image/png", "image/jpg", "image/jpeg", "image/gif"];

const multerInstance = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const mimetype = file.mimetype;
    if (
      !extensionWhiteList.includes(extension) ||
      !mimetypeWhiteList.includes(mimetype)
    ) {
      return cb(null, false);
    }
    return cb(null, true);
  },
  limits: { fileSize: 1231244 },
});

app.patch(
  "/api/users/avatars",
  authMiddleware,
  multerInstance.single("picture"),

  async (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ message: "this is not a photo" });
    }

    const { path: temporaryName } = req.file;

    const extension = path.extname(temporaryName);
    const fileName = path.join(storeDir, `${uuidv4()}${extension}`);

    try {
      await Jimp.read(temporaryName)
        .then((image) => {
          image.resize(250, 250).write(temporaryName);
        })
        .catch(async (err) => {
          await fs.unlink(temporaryName);
          return res.status(400).json({ message: "this is not a photo" });
        });

      await fs.rename(temporaryName, fileName);
    } catch (err) {
      return next(err);
    }

    const result = await service.updateUserData(req.user._id.toString(), {
      avatarURL: fileName,
    });

    return res.json({ avatarURL: result.avatarURL });
  }
);

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/api", contactsRouter);
app.use("/api", usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = {
  app,
  storeDir,
  uploadDir,
};
