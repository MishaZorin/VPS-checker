import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Server } from './entities/server.entity'
import { CreateServerDto } from './dto/create-server.dto';

@Injectable()
export class ServersService {
  constructor(
    @InjectRepository(Server)
    private repo: Repository<Server>,
  ) {}

  create(dto: CreateServerDto) {
    const server = this.repo.create(dto);
    return this.repo.save(server);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOneBy({ id });
  }
}