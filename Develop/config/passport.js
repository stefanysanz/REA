var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var db = require("../models");
// Passport to use Local Strategy. I.E, login with a username/email and password.
passport.use(new LocalStrategy(
  // User will sign in using an email, rather than a "username"
  {
    usernameField: "email"
  },
  function (email, password, done) {
    // When a user tries to sign in this code runs.
    db.User.findOne({
      where: {
        email: email
      }
    }).then(function (dbUser) {
      // If no user is detected with the given email.
      if (!dbUser) {
        return done(null, false, {
          message: "Incorrect email."
        });
      }
      // If user with the given email, but the password the user gives us is incorrect.
      else if (!dbUser.validPassword(password)) {
        return done(null, false, {
          message: "Incorrect password."
        });
      }
      // If none of the above is populated, return the user.
      return done(null, dbUser);
    });
  }
));

// In order to keep authentication state across HTTP requests,

// Sequelize needs to serialize and deserialize the user.

// Just consider this part boilerplate needed to make it all work.
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});
// Exporting our configured passport.
module.exports = passport;