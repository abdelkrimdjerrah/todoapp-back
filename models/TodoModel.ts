import mongoose from "mongoose";

const todoSchema = new mongoose.Schema<Entities.ITodo>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  mark_as_done: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model<Entities.ITodo>("Todo", todoSchema);
