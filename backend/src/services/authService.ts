import { IUserRepository } from "../repositories/iUserRepository";
import * as bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import IUserResponse from "../types/iUserResponse";

interface ILoginRequest {
  email: string;
  password: string;
}

interface ILoginResponse {
  token: string,
  user: IUserResponse
}

export class AuthService {
  constructor(private userRepository: IUserRepository) {}

  async login({ email, password }: ILoginRequest): Promise<ILoginResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }

    const secret = process.env.JWT_SECRET;

    const expirationIn =
      (process.env.JWT_EXPIRES_IN?.trim() as SignOptions['expiresIn']) ?? '1d';
  
    if (!secret || !expirationIn) {
      throw new Error('JWT configuration missing');
    }

    const token = jwt.sign({ id: user.id }, secret, { expiresIn: expirationIn});

    const userResponse = { 
      id: user.id,
      email: user.email,
      currencyInLabel: user.currencyInLabel,
      currencyInValue: user.currencyInValue,
      currencyOutLabel: user.currencyOutLabel,
      currencyOutValue: user.currencyOutValue,
      minIntervalSend: user.minIntervalSend,
      toSell: user.toSell
    }

    return { token, user: userResponse};
  }
}
