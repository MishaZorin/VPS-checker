import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServersModule } from './servers/servers.module';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1', // Явно указываем локальный IP
      port: 5434,        // Жестко прописываем НАШ НОВЫЙ ПОРТ ИЗ DOCKER
      username: 'postgres',
      password: 'my_super_secure_password_123', // Пароль по умолчанию из вашего docker-compose
      database: 'vps_checker_hub',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ServersModule,
    MetricsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
