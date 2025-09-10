import bcrypt from "bcrypt";
import { userRepository } from "./user.repository";

export const userService = {
  createUser: async (data: any) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return userRepository.create({
      ...data,
      password: hashedPassword,
    });
  },

  getUser: async (id: string) => {
    return userRepository.findById(id);
  },

  getAllUsers: async () => {
    return userRepository.findAll();
  },

  updateUser: async (id: string, data: any) => {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return userRepository.update(id, data);
  },

  deleteUser: async (id: string) => {
    return userRepository.delete(id);
  },
};
