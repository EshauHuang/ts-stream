export const sessionAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(400).json({ message: "No User Session Found" });
  }
};
