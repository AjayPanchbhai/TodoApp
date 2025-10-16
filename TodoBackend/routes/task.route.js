import express from "express";
import {
  createTask,
  deleteTaskById,
  getAllTasks,
  getTaskById,
  updateTaskById,
} from "../controllers/task.controller.js";

const router = express.Router();

// create task
router.post("/", createTask);

// get all tasks
router.get("/", getAllTasks);

// get task by id
router.get("/:id", getTaskById);

// update task by id
router.put("/:id", updateTaskById);

// delete task by id
router.delete("/:id", deleteTaskById);

export default router;
