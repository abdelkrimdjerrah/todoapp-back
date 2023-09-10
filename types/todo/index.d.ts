import mongoose, { Document } from "mongoose";

declare global {
  namespace Entities {
    export interface ITodo extends Document {
      userId: mongoose.Schema.Types.ObjectId;
      desc: string;
      mark_as_done: boolean;
    }
  }
}
