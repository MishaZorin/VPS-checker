import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller("auth")
export default class AuthController { // Убрали default
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard("local"))
  @Post('login')
  async login(@Body() dto: LoginDto, @Request() req: any) { 

    return this.authService.login(req.user);
  }

  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }
}