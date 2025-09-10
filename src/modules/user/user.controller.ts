import { Request, Response } from "express";
import { userService } from "./user.service";

export const userController = {
  createUser: async (req: Request, res: Response) => {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  getUser: async (req: Request, res: Response) => {
    try {
      const user = await userService.getUser(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      res.json({ success: true, data: user });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  getAllUsers: async (_req: Request, res: Response) => {
    try {
      const users = await userService.getAllUsers();
      res.json({ success: true, data: users });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  updateUser: async (req: Request, res: Response) => {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.json({ success: true, data: user });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  deleteUser: async (req: Request, res: Response) => {
    try {
      await userService.deleteUser(req.params.id);
      res.json({ success: true, message: "User deleted successfully" });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
};
