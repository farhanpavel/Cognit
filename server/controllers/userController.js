import prisma from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import admin from "firebase-admin";

import serviceAccount from "../google-service.json" with { type: "json" };
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const generateToken = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "70d" }
  );
  return { accessToken, refreshToken };
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json("access Denied");
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json("Invalid Refresh TOken");
    }
    const accessToken = jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ accessToken });
  });
};

export const getProfile = async (req, res) => {
  const userId = req.user.id;
  const userData = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!userData) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(userData);
};

export const getUser = async (req, res) => {
  const userData = await prisma.user.findMany({});
  res.status(200).json(userData);
};
export const getUserByroleFalse = async (req, res) => {
  const userData = await prisma.user.findMany({
    where: {
      role: req.params.role,
      status: false,
    },
  });
  res.status(200).json(userData);
};
export const getUserByroleTrue = async (req, res) => {
  try {
    let userData;

    switch (req.params.role) {
      case "Busdriver":
        userData = await prisma.user.findFirst({
          where: {
            role: req.params.role,
            status: true,
            busDriverAssignment: {
              is: {
                routeId: req.params.id,
              },
            },
          },
          include: {
            busDriverAssignment: {
              include: {
                route: true,
              },
            },
          },
        });
        break;

      case "Clubpresident":
        userData = await prisma.user.findFirst({
          where: {
            role: req.params.role,
            status: true,
            clubMemberships: {
              some: {
                clubId: req.params.id,
              },
            },
          },
          include: {
            clubMemberships: {
              include: {
                club: true,
              },
            },
          },
        });
        break;

      case "Cafeteriachef":
        userData = await prisma.user.findFirst({
          where: {
            role: req.params.role,
            status: true,
            chefAssignment: {
              is: {
                restaurantId: req.params.id,
              },
            },
          },
          include: {
            chefAssignment: {
              include: {
                restaurant: true,
              },
            },
          },
        });
        break;

      default:
        return res.status(400).json({ message: "Invalid role provided" });
    }

    if (!userData) {
      return res
        .status(404)
        .json({ message: "No assigned user found for this role and ID" });
    }

    res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user data" });
  }
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

  // Find user by email
  const data = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  // Check if user exists
  if (!data) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Ensure password is provided
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  // Compare provided password with stored hashed password
  const isMatch = await bcrypt.compare(password, data.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Generate token and respond
  const token = generateToken(data);
  res.status(200).json({
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
    role: data.role,
  });
};

const RefreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json("access Denied");
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json("Invalid Refresh TOken");
    }
    const accessToken = jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.json(accessToken);
  });
};

export const subscribeTokenToTopic = async (req, res) => {
  const { token, topic } = req.body;
  admin
    .messaging()
    .subscribeToTopic(token, topic)
    .then(() => {
      console.log(`Subscribed to "${topic}"`);
      res.status(200).json({ message: `Subscribed to "${topic}"` });
    })
    .catch((error) => {
      console.error(`Error subscribing to topic: ${error}`);
      res.status(500).json({ message: `Error subscribing to topic: ${error}` });
    });
};

export const unsubscribeTokenFromTopic = async (req, res) => {
  const { token, topic } = req.body;
  admin
    .messaging()
    .unsubscribeFromTopic(token, topic)
    .then(() => {
      console.log(`Unsubscribed from "${topic}"`);
      res.status(200).json({ message: `Unsubscribed from "${topic}"` });
    })
    .catch((error) => {
      console.error(`Error unsubscribing from topic: ${error}`);
      res
        .status(500)
        .json({ message: `Error unsubscribing from topic: ${error}` });
    });
};

export const makeNotification = async (req, res) => {
  const { title, body, topic } = req.body;
  const message = {
    notification: {
      title: title,
      body: body,
    },
    topic: topic,
    webpush: {
      headers: {
        TTL: "86400",
      },
      notification: {
        icon: "https://i.ibb.co.com/q4y0gbw/logo.png",
        click_action: "https://bidyarthi.vercel.app",
      },
    },
    android: {
      notification: {
        icon: "https://i.ibb.co.com/q4y0gbw/logo.png",
        click_action: "https://bidyarthi.vercel.app",
      },
    },
  };

  admin
    .messaging()
    .send(message)
    .then(() => {
      console.log("Notification sent successfully");
      res.status(200).json({ message: "Notification sent successfully" });
    })
    .catch((error) => {
      console.error("Error sending notification:", error);
      res.status(500).json({ message: "Error sending notification" });
    });
};

export const sendDataMessage = async (data, topic) => {
  const message = {
    data: data,
    topic: topic,
  };

  admin
    .messaging()
    .send(message)
    .then(() => {
      console.log("Data message sent successfully");
    })
    .catch((error) => {
      console.error("Error sending data message:", error);
    });
};

export const sendNotification = async (
  notification,
  topic,
  data,
  redirection
) => {
  const message = {
    notification: notification,
    topic: topic,
    data: data,
    webpush: {
      headers: {
        TTL: "86400",
      },
      notification: {
        icon: "https://i.ibb.co.com/q4y0gbw/logo.png",
        click_action: redirection,
      },
    },
  };

  admin
    .messaging()
    .send(message)
    .then(() => {
      console.log("Data message sent successfully");
    })
    .catch((error) => {
      console.error("Error sending data message:", error);
    });
};

export const sendNotificationWData = async (req, res) => {
  const { title, body, topic, data } = req.body;
  const notification = {
    title: title,
    body: body,
  };

  sendNotification(notification, topic, data, "https://bidyarthi.vercel.app");
  console.log(data);
  //save to db
  await prisma.notification.create({
    data: {
      title: title,
      message: body,
      topic: topic,
      meetLink: data.meetUrl ? data.meetUrl : "",
      formLink: data.formUrl ? data.formUrl : "",
    },
  });
  res.status(200).json({ message: "Notification sent successfully" });
};

export const getNotifications = async (req, res) => {
  const notifications = await prisma.notification.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  res.status(200).json(notifications);
};
