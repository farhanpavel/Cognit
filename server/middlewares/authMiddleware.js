import jwt from "jsonwebtoken";
import "dotenv/config";
export const jwtAuthentication = (req, res, next) => {
  const head = req.header("Authorization");
  const token = head && head.split(" ")[1];
  if (!token) {
    res.status(404).json({ message: "Jwt Required pavel" });
  }
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  req.user = decoded;
  next();
};
