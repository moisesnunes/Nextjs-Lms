import { app } from "./app";
import connectDb from "./utils/db";
require("dotenv").config();
import { v2 as cloudinary } from "cloudinary";

// cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// criando o servidor
app.listen(process.env.PORT, () => {
  console.log(`Server is running at port ${process.env.PORT}`);
  connectDb();
});
