import { PrismaClient } from '../generated/prisma/client';
import User from '../models/user';
import { ICreateUserData, IUpdateUserData, IUserRepository } from './iUserRepository';

const prisma = new PrismaClient;

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { email } });
  }

  async findAll(): Promise<User[]> {
    return await prisma.user.findMany();
  }

  async create(data: ICreateUserData): Promise<User> {
    return await prisma.user.create({ data });
  }

  async update(id: string, data: IUpdateUserData): Promise<User | null> {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void | null> {
    await prisma.user.delete({
      where: { id }
    });
  }
}