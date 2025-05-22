import prisma from "../db.js";
import admin from "firebase-admin";
import "dotenv/config";
import { sendNotification } from "./userController.js";

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
      "https://cognit.vercel.app",
    )

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

export const getResearchById = async (req, res) => {
  const { id } = req.params;

  try {
    const research = await prisma.meeting.findUnique({
      where: { id: id },
      include: {
        creator: true,
        dataCollectors: true,
      },
    });

    if (!research) {
      return res.status(404).json({ message: "Research not found" });
    }

    res.status(200).json(research);
  } catch (error) {
    console.error("Error fetching research:", error);
    res.status(500).json({ message: "Failed to fetch research" });
  }
}

export const getMyEndrollments = async (req, res) => {
  const userId = req.user.id;

  try {
    const myEndrollments = await prisma.meeting.findMany({
      where: {
        creatorId: userId,
      },
      include: {
        dataCollectors:true
      }
    });

    console.log(myEndrollments);

    let collectors = [];
    myEndrollments.forEach((meeting) => {
      meeting.dataCollectors.forEach((collector) => {
         //if doesn't exist in the array, push it
        if (!collectors.some(item => item.id === collector.id)) {
          collectors.push(collector);
        }
      });
    });

    if (!collectors.length) {
      return res.status(404).json({ message: "No collectors found" });
    }

    res.status(200).json(collectors);
  } catch (error) {
    console.error("Error fetching my enrollments:", error);
    res.status(500).json({ message: "Failed to fetch enrollments" });
  }
}

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
