import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/router.js";
import mongoDbConnect from "./database/conn.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoDbConnect();

app.use(router);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
