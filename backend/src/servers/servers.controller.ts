import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ServersService } from './servers.service';
import { CreateServerDto } from './dto/create-server.dto';

@Controller('servers')
export class ServersController {
  constructor(private readonly service: ServersService) {}

  @Post()
  create(@Body() dto: CreateServerDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}