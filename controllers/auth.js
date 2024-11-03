const passport = require("passport");

exports.googleLogin = passport.authenticate("google", { scope: ["profile", "email"] });

exports.googleCallback = passport.authenticate("google", {
  failureRedirect: "/", 
  successRedirect: "/dashboard"
});

exports.logout = (req, res) => {
  req.logout(() => {
    req.redirect("/");
  });
};