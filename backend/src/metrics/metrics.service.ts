import { Controller, Get } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Client } from 'ssh2';
import { readFileSync } from 'fs';

//  здесь промис это ожидание, а resolve это успех типо сначла хдем а потом уже resolve
@Injectable()
export class MetricsService {
  checkConnection(): Promise<string> {
    return new Promise((resolve) => {
      const conn = new Client();

      conn.on('ready', () => {
        conn.end();
        resolve('Успешно: Подключение к SSH установлено!');
      });

      conn.on('error', (err) => {
        resolve(`Ошибка подключения: ${err.message}`);
      });

      conn.connect({
        host: '78.24.222.54', 
        port: 22,
        username: 'root',
        privateKey: readFileSync('/path/to/your/private_key'), 
      });
    });
  }
}