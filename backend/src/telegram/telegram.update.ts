import { Update, Ctx, Start } from '@grammyjs/nestjs';
import { Context } from 'grammy';
import { UsersService } from '../users/users.service';

@Update()
export class TelegramUpdate {
  constructor(private readonly usersService: UsersService) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    const code = ctx.match as string; // это то, что стоит после ?start=

    // Если код не пришёл — юзер просто написал /start без ссылки
    if (!code) {
      await ctx.reply('Привет! Чтобы привязать аккаунт — зайди на дашборд и нажми "Подключить Telegram".');
      return;
    }

    const user = await this.usersService.findByTelegramLinkCode(code);

    if (!user) {
      await ctx.reply('Код недействителен. Сгенерируй новую ссылку на дашборде.');
      return;
    }

    const chatId = ctx.chat!.id.toString();
    await this.usersService.attachTelegramChatId(user.id, chatId);

    await ctx.reply('✅ Готово! Твой Telegram привязан к аккаунту.');
  }
}