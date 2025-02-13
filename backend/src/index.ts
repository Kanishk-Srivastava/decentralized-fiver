import express from "express";

import userRouter from "./routers/user";
import workerRouter from "./routers/worker";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use("/v1/user", userRouter);
app.use("/v1/worker", workerRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
  console.log("http://localhost:3000");
  console.log(process.env.JWT_SECRET);
});
