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

  async create(dto: CreateServerDto, userId: string) {
    const server = this.repo.create({
      host: dto.host,
      port: dto.port ?? 22,
      username: dto.username,
      authType: dto.authType,
      password: dto.password,
      userId,
    });

    const savedServer = await this.repo.save(server);

    return savedServer;
  }

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