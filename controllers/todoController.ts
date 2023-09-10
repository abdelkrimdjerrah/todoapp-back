import TodoModel from "../models/TodoModel";
import { Request, Response } from "express";

// @desc Get all todos
// @route GET /api/todos
// @access Private
const getTodos = async (req: Request, res: Response) => {
  try {
    const todos = await TodoModel.find().lean();

    if (!todos?.length) {
      return res
        .status(400)
        .json({ success: false, message: "No todos found" });
    }

    res.json({ success: true, todos });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc Create new todo
// @route POST /api/todos
// @access Private
const createTodo = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    const userId = req.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "Not authorized" });
    }
    if (!text) {
      return res
        .status(400)
        .json({ success: false, message: "Empty todo" });
    }

    const todo = await TodoModel.create({ userId, text });

    if (todo) {
      return res.status(201).json({ success: true, message: "Todo has been created!" });
    } else {
      return res.status(400).json({ success: false, message: "Failed to create todo" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// @desc Delete a todo
// @route DELETE /api/todos/:todoId
// @access Private
const deleteTodo = async (req: Request, res: Response) => {
  try {
    const { todoId } = req.params;

    if (!todoId) {
      return res.status(400).json({ message: "Todo ID required" });
    }

    const todo = await TodoModel.findById(todoId).exec();

    if (!todo) {
      return res
        .status(400)
        .json({ success: false, message: "Todo not found" });
    }

    await todo.deleteOne();

    res.json({ success: true, message: `Todo with ID ${todoId} has been deleted` });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc Delete a todo
// @route DELETE /api/todos/:todoId
// @access Private
const isDoneTodo = async (req: Request, res: Response) => {
  try {
    const { todoId } = req.params;

    if (!todoId) {
      return res.status(400).json({ message: "Todo ID required" });
    }

    const todo = await TodoModel.findById(todoId);

    if (!todo) {
      return res
        .status(400)
        .json({ success: false, message: "Todo not found" });
    }

    todo.isDone = true;
    await todo.save();

    res.json({ success: true, message: `Todo with ID ${todoId} has been deleted` });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export default {
  getTodos,
  createTodo,
  deleteTodo,
  isDoneTodo,
};
