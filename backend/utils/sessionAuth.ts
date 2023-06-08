export const sessionAuth = (req: any, res: any, next: any) => {
  if (req.session.user) {
    next();
  } else {
    res.status(400).json({ message: "No User Session Found" });
  }
};
