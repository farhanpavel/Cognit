import prisma from "../db.js";
import admin from "firebase-admin";
import "dotenv/config";

export const getMeeting = async (req, res) => {
  const meeting = await prisma.meeting.findMany({});
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

    res.status(201).json(meeting);
  } catch (error) {
    console.error("Error creating meeting:", error);
    res
      .status(500)
      .json({ message: "Failed to create meeting", error: error.message });
  }
};



