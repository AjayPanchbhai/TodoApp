import { Task } from "../models/task.model.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

// Email configuration
const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendCompletionEmail = async (task) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: task.ownerEmail,
      subject: "Task Completed Successfully!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a936f; text-align: center;">Task Completed! </h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 10px;">${task.title}</h3>
            <p style="color: #666; margin-bottom: 10px;"><strong>Description:</strong> ${
              task.description || "No description"
            }</p>
            <p style="color: #666; margin-bottom: 0;"><strong>Completed on:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p style="text-align: center; color: #888; font-size: 14px;">
            Congratulations on completing your task! 
          </p>
        </div>
      `,
    });
    console.log("Completion email sent to:", task.ownerEmail);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Create a task
export const createTask = async (req, res) => {
  try {
    const task = new Task({
      title: req.body.title,
      description: req.body.description,
      ownerEmail: req.body.ownerEmail,
    });

    const newTask = await task.save();

    // Emit real-time update
    const io = req.app.get("io");
    io.emit("taskCreated", newTask);

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: newTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(400).json({
      success: false,
      message: error.message,
      error: error.errors,
    });
  }
};

// get all tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find() ;
    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
};

// get task by id
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }
    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch task",
      error: error.message,
    });
  }
};

// update task by id
export const updateTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const previousStatus = task.status;

    if (req.body.title !== undefined) task.title = req.body.title;
    if (req.body.description !== undefined)
      task.description = req.body.description;
    if (req.body.status !== undefined) task.status = req.body.status;

    const updatedTask = await task.save();

    // Send email if status changed to Completed
    if (previousStatus !== "Completed" && updatedTask.status === "Completed") {
      await sendCompletionEmail(updatedTask);
    }

    // Emit real-time update
    const io = req.app.get("io");
    io.emit("taskUpdated", updatedTask);

    res.json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(400).json({
      success: false,
      message: "Failed to update task",
      error: error.message,
    });
  }
};

export const deleteTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    // Emit real-time update
    const io = req.app.get("io");
    io.emit("taskDeleted", req.params.id);

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete task",
      error: error.message,
    });
  }
};
