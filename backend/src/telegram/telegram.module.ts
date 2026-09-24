// // telegram.module.ts
// // import { NestjsGrammyModule } from '@grammyjs/nestjs';
// import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { session } from 'grammy'; // <-- добавить импорт

// import { AuthModule } from '../auth/auth.module';
// // import { TelegramUpdate } from './telegram.update';
// import { UsersModule } from '../users/users.module';
// import { ServersModule } from '../servers/servers.module';
// import { MetricsModule } from '../metrics/metrics.module';

// @Module({
//   imports: [
//     ConfigModule,
//     NestjsGrammyModule.forRootAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: (configService: ConfigService) => {
//         const token = configService.get<string>('TG_KEY');

//         if (!token) {
//           throw new Error('TG_KEY is not defined in environment variables');
//         }

//         return {
//   botName: 'default',
//   token,
//   middlewares: [session({ initial: () => ({}) })],
//   onError: (error) => {
//     console.error('BOT ERROR:', error);
//   },
// };
//       },
//     }),
//     UsersModule,
//     ServersModule,
//     MetricsModule,
//     AuthModule,
//   ],
//   providers: [TelegramUpdate],
// })
// export class TelegramModule {}