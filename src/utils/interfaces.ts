// src/utils/interfaces.ts

import { Request } from "express";

export interface IReqUser extends Request {
  user: {
    role: string;
    id: string;
  };
}
