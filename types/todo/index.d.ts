import mongoose, { Document } from "mongoose";

declare global {
  namespace Entities {
    export interface ITodo extends Document {
      userId: mongoose.Schema.Types.ObjectId;
      text: string;
      isDone: boolean;
    }
  }
}
