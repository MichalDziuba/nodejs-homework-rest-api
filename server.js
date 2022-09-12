const { app, uploadDir, storeDir } = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();
const { createFolderIfItDoesntExist } = require("./service/index.js");
const PORT = process.env.PORT || 3000;
const uriDb = process.env.DB_SRV;

require("./config/passport");

const connection = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
connection
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT, async () => {
      await createFolderIfItDoesntExist(uploadDir);
      await createFolderIfItDoesntExist(storeDir);
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(
      `Server not running. Error message : ${error.message.toString()}`
    );
    process.exit(1);
  });
