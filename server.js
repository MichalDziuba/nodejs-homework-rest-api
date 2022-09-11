const app = require("./app");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const uriDb = process.env.DB_SRV;
const jwt = require("jsonwebtoken");

// const payload ={ id:1111, username: "name", email:"email@email.pl"}
// const secret = "jakiściągznaków";
// const token=jwt.sign(payload,secret,{expiresIn:'12h'})
// console.log(token)
// const userToken ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTExMSwidXNlcm5hbWUiOiJuYW1lIiwiZW1haWwiOiJlbWFpbEBlbWFpbC5wbCIsImlhdCI6MTY2MjgwOTI3MiwiZXhwIjoxNjYyODUyNDcyfQ.7jnjUaCvVbmvjyID35gVggZI3PtYXsHJH9dlOlfxzh4"
// try {
//   const payload = jwt.verify(userToken, secret)
//   console.log("veryfiy",payload)
// } catch (e) {
//   console.log(e)
// }
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
