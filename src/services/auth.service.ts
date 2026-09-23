import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { userRepository } from '../repositories';
import { AppError } from '../errors/AppError';
import { config } from '../config/env';
import { UserDTO } from '../dtos/user.dto';
import { User } from '@prisma/client';

export class AuthService {
  
  async register(name: string, email: string, password: string) {
    const existingUser = await userRepository.findByEmail(email);
    if(existingUser) 
        throw new AppError('Email already registered', 409);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.create({ name, email, password: hashedPassword });
    const token = this.generateToken(user.id);

    return { user: this.formatUserDTO(user), token };
  }

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if(!user) 
        throw new AppError('Invalid email or password', 401);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) 
        throw new AppError('Invalid email or password', 401);

    const token = this.generateToken(user.id);
    return { user: this.formatUserDTO(user), token };
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, config.jwtSecret, { expiresIn: '7d' });
  }

  private formatUserDTO(user: User): UserDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}

export const authService = new AuthService();