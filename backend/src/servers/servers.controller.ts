import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // или твой собственный JwtAuthGuard, если он уже есть
import { ServersService } from './servers.service';
import { CreateServerDto } from './dto/create-server.dto';

@Controller('servers')
@UseGuards(AuthGuard('jwt')) // защищаем ВСЕ эндпоинты этого контроллера сразу
export class ServersController {
  constructor(private readonly serversService: ServersService) {}

  @Post()
create(@Body() dto: CreateServerDto, @Req() req: any) {
  const userId = req.user.userId; // было req.user.id
  return this.serversService.create(dto, userId);
}

@Get()
findAll(@Req() req: any) {
  return this.serversService.findAllByUser(req.user.userId); // было req.user.id
}

@Delete(':id')
remove(@Param('id') id: string, @Req() req: any) {
  return this.serversService.remove(id, req.user.userId); // было req.user.id
}
}