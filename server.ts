import express from "express";
import mongoose from "mongoose";
import path, { dirname } from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import corsOptions from "./config/corsOptions";
import { logger, logEvents } from "./middleware/logger";
import errorHandler from "./middleware/errorHandler";
import connectDB from "./config/dbConn";
import dotEnvExtended from 'dotenv-extended';

dotEnvExtended.load(); 

const PORT = process.env.PORT || 27015;

console.log(process.env.NODE_ENV);

const app = express();

connectDB();
app.use(cookieParser());

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", require("./routes/root"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/todos", require("./routes/todoRoutes"));


app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.status(400).json({ message: "404 Not Found" });
  } else {
    res.status(400).type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("connected to MongoDB");
  app.listen(PORT, () => {
    console.log("sever is listening " + PORT);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
