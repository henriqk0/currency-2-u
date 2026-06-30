import User from '../models/user';
import { IUpdateUserData, ICreateUserData, IUserRepository, IPutUserLastSendData } from "../repositories/iUserRepository";
import bcrypt from 'bcrypt'
import { removeUndefined } from '../utils/removeUndefined';

const omitPassword = (user: User) => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

function daysSinceOrNull(date: Date): number | null {
  if (!date) return null;

  const diff = Date.now() - new Date(date).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export class UserService {
  constructor(private userRepository: IUserRepository) {} // depend. inject -> best testability

  async createUser(data: ICreateUserData): Promise<Omit<User, 'password'>> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("User with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await this.userRepository.create(
      removeUndefined({
        ...data,
        password: hashedPassword,
      })
    );

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

    const updatedUser = await this.userRepository.update(id, data);
    if (!updatedUser) {
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
      const updateUserDate: IPutUserLastSendData = {
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

    const daysSinceReference = lastEmailSentDate ? Number(daysSinceOrNull(lastEmailSentDate)): 0

    const interval = Number(userExists.minIntervalSend)

    if (daysSinceReference === null) return true

    return daysSinceReference >= interval
  }
}