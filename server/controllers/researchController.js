import prisma from "../db.js";
import admin from "firebase-admin";
import "dotenv/config";
import { sendNotification, sendNotificationWData } from "./userController.js";
export const getMeeting = async (req, res) => {
  const userId = req.user.id;
  console.log(userId);
  const meeting = await prisma.meeting.findMany({
    where: {
      creatorId: userId,
    },
  });
  res.status(201).json(meeting);
};

export const updateMeeting = async (req, res) => {
  const meeting = await prisma.meeting.update({
    where: {
      id: req.body.data,
    },
    data: {
      schedule: req.body.schedule,
    },
  });
  res.status(201).json(meeting);
};

export const createMeeting = async (req, res) => {
  try {
    const {
      title,
      description,
      meetingLink,
      meetingDate,
      duration,
      agenda,
      notes,
      formLink,
    } = req.body;
    const userId = req.user.id;
    console.log(userId);
    const meeting = await prisma.meeting.create({
      data: {
        title,
        description,
        meetingLink,
        meetingDate: new Date(meetingDate),
        duration: parseInt(duration),
        agenda,
        formLink,
        creatorId: userId,
      },
    });
    sendNotification(
      {
        title: title,
        body: description,
      },
      "research",
      {
        meetUrl: meetingLink,
        formUrl: formLink,
      },
      "https://cognit.vercel.app"
    );
    res.status(201).json(meeting);
  } catch (error) {
    console.error("Error creating meeting:", error);
    res
      .status(500)
      .json({ message: "Failed to create meeting", error: error.message });
  }
};

export const getResearches = async (req, res) => {
  const researchData = await prisma.meeting.findMany({
    include: {
      creator: true,
      dataCollectors: true,
      _count: {
        select: {
          dataCollectors: true,
        },
      },
    },
  });
  res.status(200).json(researchData);
};

export const enrollResearch = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if the research exists
    const research = await prisma.meeting.findUnique({
      where: { id: id },
    });

    if (!research) {
      return res.status(404).json({ message: "Research not found" });
    }

    // Enroll the user in the research
    await prisma.meeting.update({
      where: { id: id },
      data: {
        dataCollectors: {
          connect: { id: userId },
        },
      },
    });

    res.status(200).json({ message: "Successfully enrolled in research" });
  } catch (error) {
    console.error("Error enrolling in research:", error);
    res.status(500).json({ message: "Failed to enroll in research" });
  }
};
