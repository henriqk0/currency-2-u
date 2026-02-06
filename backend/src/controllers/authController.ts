import { Request, Response } from "express";
import { AuthService } from "../services/authService";

import { UserRepository } from "../repositories/userRepository";


const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

export class AuthController {
  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      
      if ( !email || !password ) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      
      const { token } = await authService.login({ email, password });

      return res.status(200).json({ token });
    } catch (err: any) {
      return res.status(401).json({ error: err.message });
    }
  }
}