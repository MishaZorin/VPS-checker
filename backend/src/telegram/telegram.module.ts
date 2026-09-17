import { NestjsGrammyModule } from '@grammyjs/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TelegramUpdate } from './telegram.update';
import { UsersModule } from '../users/users.module'; // поправь путь под свою структуру папок

@Module({
	imports: [
		ConfigModule,
		NestjsGrammyModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => {
				const token = configService.get<string>('TG_KEY');

				// Если токен не найден в .env, выбрасываем понятную ошибку при старте
				if (!token) {
					throw new Error('TELEGRAM_BOT_TOKEN is not defined in environment variables');
				}

				return {
					botName: 'default',
					token: token,
				};
			},
		}),
		UsersModule, // ← вот эта строка чинит ошибку — теперь TelegramModule видит UsersService
	],
	providers: [TelegramUpdate],
})
export class TelegramModule {}