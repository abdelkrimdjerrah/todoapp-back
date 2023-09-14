import UserModel from "../models/UserModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

import dotEnvExtended from 'dotenv-extended';
dotEnvExtended.load(); 

// @desc Login
// @route POST api/auth/login
// @access Public
const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const foundUser = await UserModel.findOne({ email }).exec();

  if (!foundUser) {
    return res.status(401).json({ message: "Email or password is incorrect" });
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) return res.status(401).json({ message: "Email or password is incorrect" });

  const accessToken = jwt.sign(
    {
      UserInfo: {
        userId: foundUser._id,
        email: foundUser.email,
      },
    },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    {
      email: foundUser.email,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "7d" }
  );

  const userData = await UserModel.findOne({ email }).select("-password").lean();

  // Create secure cookie with refresh token
  return res
    .status(200)
    .header("Access-Control-Allow-Credentials", 'true')
    .cookie("jwt", refreshToken, {
      httpOnly: true, 
      secure: true, 
      sameSite: "none", 
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    })
    .json({ userData, accessToken, success: true });
};

// @desc Refresh
// @route GET api/auth/refresh
// @access Public - because access token has expired
const refresh = (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });
  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET!,
    async (err: any, decoded: any) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const foundUser = await UserModel.findOne({ email: decoded.email }).exec();

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

      const accessToken = jwt.sign(
        {
          UserInfo: {
            userId: foundUser._id,
            email: foundUser.email,
          },
        },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: "15m" }
      );

      res.json({ accessToken });
    }
  );
};

// @desc Logout
// @route POST api/auth/logout
// @access Public - just to clear cookie if exists
const logout = (req: Request, res: Response) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: "none", //cross-site cookie
    maxAge: 0, //cookie expiry: set to match rT
  });
  res.json({ message: "Cookie cleared" });
};

export default {
  login,
  refresh,
  logout,
};
