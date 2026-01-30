import User from '../models/user';
import { IUpdateUserData, ICreateUserData, IUserRepository } from "../repositories/iUserRepository";

export class UserService {
  constructor(private userRepository: IUserRepository) {} // depend. inject -> best testability

  async createUser(data: ICreateUserData): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("User with this email already exists.");
    }
    return this.userRepository.create(data);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.userRepository.findById(id);
    if (!user) {
        return null; // or throw new Error('User not found.');
    }
    return user;
  }

  async updateUser(id: string, data: IUpdateUserData): Promise<User | null> {
    const userExists = await this.userRepository.findById(id);
    if (!userExists) {
      return null; // or throw new Error('User not found to update.');
    }
    return this.userRepository.update(id, data);
  }

  async deleteUser(id: string): Promise<void> {
      const userExists = await this.userRepository.findById(id);
      if (!userExists) {
          throw new Error('User not found to delete.');
      }
      await this.userRepository.delete(id);
  }
}