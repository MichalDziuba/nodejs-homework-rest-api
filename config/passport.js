const passport = require("passport");
const passportJWT = require("passport-jwt");
const User= require("../service/schemas/user.js")
const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

const secret = process.env.SECRET;
const params = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new Strategy(params, function (payload, done) {
    User.findOne({ _id: payload._id })
      .then((user) => {
        if (!user) {
          return done(new Error("user not found"));
        }
        return done(null, user);
      })
      .catch((err) => {
        done(err);
      });
  })
);
