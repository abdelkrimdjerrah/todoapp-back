import mongoose from "mongoose";

declare global{
  namespace Express {
      interface Request {
        userId?: mongoose.Schema.Types.ObjectId;
        email?: string;
      }
  }
}


