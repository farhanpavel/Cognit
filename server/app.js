import express from "express";
import "dotenv/config";
import cors from "cors";
import userRouter from "./routes/userRouter.js";
import researchRouter from "./routes/researchRouter.js";

const app = express();
app.use(cors());
const PORT = process.env.PORT;

app.use(express.json());
app.get("/", (req, res) => {
  return res.send("hello");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on 0.0.0.0:4000");
});

app.use("/api/user", userRouter);

app.use("/api/research", researchRouter);
