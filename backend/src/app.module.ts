import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; // 1. Импортируем ConfigModule
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServersModule } from './servers/servers.module';
import { MetricsModule } from './metrics/metrics.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 2. Делаем конфигурацию глобальной для всего приложения
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1', 
      port: 5434,        
      username: 'postgres',
      password: 'my_super_secure_password_123', 
      database: 'vps_checker_hub',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ServersModule,
    MetricsModule,
    AuthModule,
    UsersModule,
    TelegramModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
