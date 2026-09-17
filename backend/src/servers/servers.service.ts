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

  async create(dto: CreateServerDto, userId: string) {
  const algorithm = 'aes-256-cbc';
  const rawKey = (process.env.ENCRYPTION_KEY || '12345678901234567890123456789012')
    .slice(0, 32)
    .padEnd(32, ' ');

  const key = Buffer.from(rawKey, 'utf8');
  const iv = Buffer.alloc(16, 0); 

  // Шифруем для записи в БД
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encryptedKey = cipher.update(dto.privateKey, 'utf8', 'hex');
  encryptedKey += cipher.final('hex');

  const server = this.repo.create({ 
    ...dto, 
    userId,
    privateKey: encryptedKey // В базу уходит зашифрованный
  });

  await this.repo.save(server);

  // Возвращаем фронтенду объект ОРИГИНАЛЬНЫМ чистым ключом
  return {
    ...server,
    privateKey: dto.privateKey 
  };
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