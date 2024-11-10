const passport = require("passport");

exports.googleLogin = passport.authenticate("google", { 
  scope: ["profile", "email"], 
  // Force re-consent, to avoid cached sessions
  prompt: "consent"
});

exports.googleCallback = passport.authenticate("google", {
  failureRedirect: "/", 
  // successRedirect: "/dashboard"
  successRedirect: "/schedule"
});

exports.logout = (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
};