// middleware/authorizeAdmin.js
const authorizeAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    return next();
  }
  res.status(403).json({ message: "Access denied" });
};

module.exports = authorizeAdmin;
