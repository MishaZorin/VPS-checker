import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { randomBytes } from 'crypto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const hash = await bcrypt.hash(dto.password, 10);

    
    const newUser = this.usersRepository.create({
      ...dto,
      password: hash,
    });

    return await this.usersRepository.save(newUser);
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async validateCredentials(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) return null;

    // Проверяем совпадение введенного пароля с хешем в БД
    const ok = await bcrypt.compare(password, user.password);
    return ok ? user : null;
  }
  async generateTelegramLinkCode(userId: string): Promise<string> {
  const code = randomBytes(4).toString('hex'); // например "a1b2c3d4"
  await this.usersRepository.update(userId, { telegramLinkCode: code });
  return code;
}
 
// 2. Ищет юзера по коду (когда бот получил /start с кодом)
async findByTelegramLinkCode(code: string) {
  return this.usersRepository.findOne({ where: { telegramLinkCode: code } });
}

async findByTelegramChatId(telegramChatId: string) {
  return this.usersRepository.findOne({ where: { telegramChatId } });
}
 
// 3. Сохраняет chatId юзеру и стирает использованный код
async attachTelegramChatId(userId: string, chatId: string) {
  await this.usersRepository.update(userId, {
    telegramChatId: chatId,
    telegramLinkCode: undefined,
  });
}
}
