import { Response, NextFunction } from "express";

import { CustomRequest } from "..";


export const sessionAuth = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.session.user) {
    next();
  } else {
    res.status(400).json({ message: "No User Session Found" });
  }
};
