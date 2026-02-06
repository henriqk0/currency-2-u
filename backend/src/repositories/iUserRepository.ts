import User from "../models/user";
import { Acronyms } from "../generated/prisma/enums";

export interface ICreateUserData {
  email: string;
  password: string;
  currencyInLabel: Acronyms;
  currencyInValue: number;
  currencyOutLabel: Acronyms;
  currencyOutValue: number;
  lastSend: Date | null;
  minIntervalSend: number;
  toSell: boolean;
}

export interface IUpdateUserData {
  email?: string;
  password?: string;
  currencyInLabel?: Acronyms;
  currencyInValue?: number;
  currencyOutLabel?: Acronyms;
  currencyOutValue?: number;
  lastSend?: Date | null;
  minIntervalSend?: number;
  toSell?: boolean;
}

export interface IUserRepository {
  create(data: ICreateUserData): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, data: IUpdateUserData): Promise<User | null>;
  delete(id: string): Promise<void | null>;
}