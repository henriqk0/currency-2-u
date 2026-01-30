import { Request, Response, NextFunction } from 'express'; 
import User from '../models/user';
import { UserRepository } from '../repositories/userRepository';
import { UserService } from '../services/userService';
import { ICreateUserData, IUpdateUserData } from '../repositories/iUserRepository';
import { Acronyms } from '../generated/prisma/enums';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export class UserController {
  async getById(req: Request, res: Response): Promise<Response> {
    const id = req.params.id as string;

    const user = await userService.getUserById(id); 

    if (user)
      return res.json(user); 
    else
      return res.sendStatus(404).json({ error: "User not found"});
  }

  async getUsers(req: Request, res: Response): Promise<Response> {
    const users = await userRepository.findAll();
    return res.json(users);
  }  

  async postUser(req: Request, res: Response): Promise<Response> {
    const user = req.body;

    const userDto: ICreateUserData =  {
      ...user,
      currencyInLabel: user.currencyInLabel as Acronyms
    }

    const result = await userRepository.create(userDto);

    if (result)
      return res.status(201).json(result);
    else
      return res.sendStatus(400);
  }

  async patchUser(req: Request, res: Response): Promise<Response> {
    const id = req.params.id as string;

    const user = req.body;

    const userDto: IUpdateUserData =  {
      ...user,
      currencyInLabel: user.currencyInLabel as Acronyms
    }

    const result = await userRepository.update(id, userDto);

    if (result)
      return res.json(result);
    else
      return res.sendStatus(404);
  }

  async deleteUser(req: Request, res: Response): Promise<void | null> {
    const id = req.params.id as string;

    const success = await userRepository.delete(id);

    if (success)
      res.sendStatus(204);
    else
      res.sendStatus(404);
  }
}

 
