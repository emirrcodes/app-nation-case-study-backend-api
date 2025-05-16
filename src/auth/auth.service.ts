import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto, adminKey?: string) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    let role: 'USER' | 'ADMIN' = 'USER';

    const adminSecret = this.config.get<string>('ADMIN_SECRET');
    if (adminKey && adminKey === adminSecret) {
      role = 'ADMIN';
    }
    console.log('adminKey: ', adminKey);
    console.log('adminSecret: ', adminSecret);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword as string,
        role,
      },
    });

    return { message: 'User created', id: user.id };
  }

  async login(dto: LoginDto) {
    const user: User | null = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch: boolean = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }
}
