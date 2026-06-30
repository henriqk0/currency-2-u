import User from "../models/user";
import { CreateUserInput, UpdateUserInput } from "../types/userSchemas";

export interface ICreateUserData extends CreateUserInput {
  lastSend: Date | null;
}

export interface IUpdateUserData extends UpdateUserInput {}

export interface IPutUserLastSendData {
  lastSend: Date;
}

export interface IUserRepository {
  create(data: ICreateUserData): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, data: IUpdateUserData): Promise<User | null>;
  delete(id: string): Promise<void | null>;
}
