import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Server } from './entities/server.entity';
import { CreateServerDto } from './dto/create-server.dto';
import * as crypto from 'crypto';
@Injectable()
export class ServersService {
  constructor(
    @InjectRepository(Server)
    private readonly repo: Repository<Server>,
  ) {}

  create(dto: CreateServerDto, userId: string) {
  // Шифруем ключ в одну строку перед тем, как засунуть в базу
  const encryptedKey = crypto.createCipheriv('aes-256-cbc', Buffer.from('12345678901234567890123456789012'), Buffer.alloc(16, 0)).update(dto.privateKey, 'utf8', 'hex') + crypto.createCipheriv('aes-256-cbc', Buffer.from('12345678901234567890123456789012'), Buffer.alloc(16, 0)).final('hex');

  const server = this.repo.create({ 
    ...dto, 
    userId,
    privateKey: encryptedKey // Перезаписываем чистый ключ на зашифрованную строку
  });

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