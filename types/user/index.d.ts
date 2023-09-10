import { Document } from "mongoose";

declare global {
  namespace Entities {
    export interface IUser extends Document {
      email: string;
      password: string;
    }
  }
}
