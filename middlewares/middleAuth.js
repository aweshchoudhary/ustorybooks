module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/login");
    }
  },
  ensureGest: function (req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect(`/dashboard/${req.user.googleId}`);
    } else {
      return next();
    }
  },
};
