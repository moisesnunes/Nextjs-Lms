import { NextFunction, Request, Response } from "express";
import { ErrorMiddleWare } from "./middleware/error";
import analyticsRouter from "./routes/analytics.route";
import courseRouter from "./routes/course.route";
import notificationRouter from "./routes/notification.route";
import orderRouter from "./routes/order.route";
import useRouter from "./routes/user.route";
import layoutRouter from "./routes/layout.route";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

export const app = express();

// body porser
app.use(express.json({ limit: "50mb" }));

// cookei parser
app.use(cookieParser());

// cors => cross origin resource sharing
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

// routes
app.use(
  "/api/v1",
  useRouter,
  courseRouter,
  orderRouter,
  notificationRouter,
  analyticsRouter,
  layoutRouter
);

// test api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "Api is runnig",
  });
});

// all routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

app.use(ErrorMiddleWare);
