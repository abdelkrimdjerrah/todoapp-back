import mongoose from "mongoose";

const userSchema = new mongoose.Schema<Entities.IUser>({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
},
{
  timestamps: true,
});

export default mongoose.model<Entities.IUser>("User", userSchema);
