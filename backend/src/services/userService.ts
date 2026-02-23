import User from '../models/user';
import { IUpdateUserData, ICreateUserData, IUserRepository } from "../repositories/iUserRepository";
import bcrypt from 'bcrypt'

const omitPassword = (user: User) => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

function daysSinceOrNull(date: Date): number | null {
  if (!date) return null;

  const today = new Date();
  const init = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  
  const diffMs = end.getTime() - init.getTime()
  return Math.floor(diffMs / ( 1000 * 60 * 60 * 24 ))
}

export class UserService {
  constructor(private userRepository: IUserRepository) {} // depend. inject -> best testability

  async createUser(data: ICreateUserData): Promise<Omit<User, 'password'>> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("User with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    return omitPassword(newUser);
  }

  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.findAll();
    return users.map(omitPassword);
  }

  async getUserById(id: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepository.findById(id);
    if (!user) {
        return null; // or throw new Error('User not found.');
    }
    return omitPassword(user);
  }

  async updateUser(id: string, data: IUpdateUserData): Promise<Omit<User, 'password'> | null> {
    const userExists = await this.userRepository.findById(id);
    if (!userExists) {
      return null; // or throw new Error('User not found to update.');
    }
    if (data.password) {
      const saltRoads = 10;
      data.password = await bcrypt.hash(data.password, saltRoads);
    }
    const updatedUser = await this.userRepository.update(id, data);
    if (!this.updateUser) {
      return null;
    }

    return omitPassword(updatedUser!);
  }

  async deleteUser(id: string): Promise<void> {
      const userExists = await this.userRepository.findById(id);
      if (!userExists) {
          throw new Error('User not found to delete.');
      }
      await this.userRepository.delete(id);
  }

  async setNewLastSendedEmail(id: string): Promise<void> {
      const userExists = await this.userRepository.findById(id);
      if (!userExists) {
          throw new Error('User not found to change last email send date.');
      }

      const currentDate = new Date()
      const updateUserDate: IUpdateUserData = {
        lastSend: currentDate 
      }

      await this.userRepository.update(id, updateUserDate)
  }

  async canSendEmail(id: string): Promise<boolean> {
    const userExists = await this.userRepository.findById(id);
    if (!userExists) {
      return false; // or throw new Error('User not found to update.');
    }
    
    const lastEmailSentDate = userExists.lastSend

    const daysSinceReference = lastEmailSentDate ? daysSinceOrNull(lastEmailSentDate): 0

    return (daysSinceReference === null || (daysSinceReference > userExists.minIntervalSend && userExists.minIntervalSend > 0))
  }
}