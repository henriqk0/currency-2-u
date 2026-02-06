import { Request, Response } from 'express'; 
import { UserRepository } from '../repositories/userRepository';
import { UserService } from '../services/userService';
import { ICreateUserData, IUpdateUserData } from '../repositories/iUserRepository';
import { Acronyms } from '../generated/prisma/enums';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export class UserController {

  // only to debug (remove this later, in production)
  async getUsers(req: Request, res: Response): Promise<Response> {
    const users = await userService.getAllUsers();
    return res.json(users);
  }  

  async postUser(req: Request, res: Response): Promise<Response> {
    const user = req.body;

    const userDto: ICreateUserData =  {
      ...user,
      currencyInLabel: user.currencyInLabel as Acronyms
    }

    const result = await userService.createUser(userDto);

    if (result)
      return res.status(201).json(result);
    else
      return res.sendStatus(400);
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const targetUserId = req.params.id;
      const authenticatedUserId = req.userId; 

      if (targetUserId !== authenticatedUserId) {
        return res.status(403).json({error: "Forbidden: You can only see your own account."})
      }

      const user = await userService.getUserById(targetUserId); 

      if (!user) return res.status(404).json({ error: 'User not found' });

      return res.status(200).json(user); 
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async patchUser(req: Request, res: Response): Promise<Response> {
    try {
      const targetUserId = req.params.id;
      const authenticatedUserId = req.userId; 

      if (targetUserId !== authenticatedUserId) {
        return res.status(403).json({error: "Forbidden: You can only update your own account."})
      }

      const user = req.body;
      const userDto: IUpdateUserData =  {
        ...user,
        currencyInLabel: user.currencyInLabel as Acronyms
      }

      const result = await userService.updateUser(targetUserId, userDto);

      if (!result) return res.sendStatus(404);

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<Response> {

    try{
      const targetUserId = req.params.id as string;
      const authenticatedUserId = req.userId;

      if (targetUserId !== authenticatedUserId) {
        return res.status(403).json({ error: "Forbidden: You can only delete your own account."});
      }

      await userService.deleteUser(targetUserId);

      return res.sendStatus(204);
    } catch (error: any) {
      return res.status(404).json({ error: error.message});
    }
  }
}

 
