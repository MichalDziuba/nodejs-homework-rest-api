const app = require("./app");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const uriDb = process.env.DB_SRV;
const jwt = require("jsonwebtoken");


require("./config/passport");
const connection = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
connection
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(
      `Server not running. Error message : ${error.message.toString()}`
    );
    process.exit(1);
  });
