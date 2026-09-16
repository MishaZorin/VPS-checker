import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Server } from './entities/server.entity';
import { CreateServerDto } from './dto/create-server.dto';

@Injectable()
export class ServersService {
  constructor(
    @InjectRepository(Server)
    private readonly repo: Repository<Server>,
  ) {}

  create(dto: CreateServerDto, userId: string) {
    const server = this.repo.create({ ...dto, userId });
    return this.repo.save(server);
  }

  // Только сервера ЭТОГО пользователя — не показываем чужие
  findAllByUser(userId: string) {
    return this.repo.find({ where: { userId } });
  }

  findOne(id: string, userId: string) {
    return this.repo.findOne({ where: { id, userId } });
  }

  async remove(id: string, userId: string) {
    const server = await this.findOne(id, userId);
    if (!server) return null;
    await this.repo.remove(server);
    return server;
  }
}