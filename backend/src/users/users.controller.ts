import { Controller, Get, Post, Body, Patch, Param, Delete ,Req,UseGuards} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
@Controller('users')
export class UsersController {
   constructor(private readonly userService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }
   @Post('telegram/link')
  @UseGuards(AuthGuard('jwt'))
  async getTelegramLink(@Req() req: any) {
    const code = await this.userService.generateTelegramLinkCode(req.user.userId);
 
    return {

      link: `https://t.me/servers_status_check_bot`,
    };
  }
}
