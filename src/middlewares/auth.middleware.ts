// src/middlewares/auth.middleware.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { SECRET } from "@/utils/env";
import { IReqUser } from "@/utils/interfaces";

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const [prefix, accessToken] = token.split(" ");

  if (prefix !== "Bearer" || !accessToken) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const user = jwt.verify(accessToken, SECRET) as { id: string; role: string };

  if (!user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  (req as IReqUser).user = {
    id: user.id,
    role: user.role,
  };

  next();
};
