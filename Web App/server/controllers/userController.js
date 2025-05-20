import prisma from "../db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
const generateToken = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

export const getUser = async (req, res) => {
  const userData = await prisma.user.findMany({});
  res.status(200).json(userData);
};

export const userRegister = async (req, res) => {
  const { email, name, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const userData = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role,
    },
  });
  res.status(200).json(userData);
};
export const userLogin = async (req, res) => {
  const { email, password } = req.body;
  const data = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  if (!data) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const isMatch = await bcrypt.compare(password, data.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const token = generateToken(data);
  res.status(200).json({ token, role: data.role });
};
