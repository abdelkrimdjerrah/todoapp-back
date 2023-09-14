import mongoose from "mongoose";

const todoSchema = new mongoose.Schema<Entities.ITodo>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  isDone: {
    type: Boolean,
    default: false,
  }
},
{
  timestamps: true,
});

export default mongoose.model<Entities.ITodo>("Todo", todoSchema);
