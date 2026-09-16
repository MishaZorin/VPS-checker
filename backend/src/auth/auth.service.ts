import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

 
  async register(dto: RegisterDto) {
    // Проверяем, не занят ли email
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('Пользователь с таким email уже существует');
    }

    
    const newUser = await this.usersService.create(dto);

    // Сразу генерируем JWT-токен и отдаем его
    return this.login(newUser);
  }


  async validateUser(email: string, password: string) {
    const user = await this.usersService.validateCredentials(email, password);
    if (!user) throw new UnauthorizedException('Неверный email или пароль');

    const { password: _, ...result } = user;
    return result;
  }

  // 3. ГЕНЕРАЦИЯ ТОКЕНА
  async login(user: { id: string | number; email: string }) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}