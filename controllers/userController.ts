import User from "../models/UserModel";
import bcrypt from "bcrypt";

// @desc Create new user
// @route POST /api/users
// @access Private
const createUser = async (req: any, res: any) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email" });
  }

  const duplicateEmail = await User.findOne({ email }).lean().exec();

  if (duplicateEmail) {
    return res
      .status(409)
      .json({ success: false, message: "Email already registered" });
  }

  const hashedPwd = await bcrypt.hash(password, 10);

  const userObj = {
    email,
    password: hashedPwd,
  };

  const user = await User.create(userObj);

  if (user) {
    res.status(201).json({
      success: true,
      message: `New user ${email} has been created`,
    });
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Invalid user data received" });
  }
};

export default {
  createUser,
};
