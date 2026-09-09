import { Injectable } from '@nestjs/common';
import { Client } from 'ssh2';

@Injectable()
export class MetricsService {
  checkConnection(host: string, username: string, privateKey: string): Promise<string> {
    return new Promise((resolve) => {
      const conn = new Client();

      conn.on('ready', () => {
        conn.exec('uptime', (err, stream) => {
    if (err) {
      resolve(`Ошибка выполнения команды: ${err.message}`);
      return;
    }

    let output = '';

    stream.on('data', (data: Buffer) => {
      output += data.toString(); // собираем кусочки вывода команды
    });

    stream.on('close', () => {
      conn.end(); // закрываем соединение только теперь, когда команда выполнилась
      resolve(output.trim()); // отдаём результат наружу
    });
  });
        // resolve('Успешно: Подключение к SSH установлено!');
      });

      conn.on('error', (err) => {
        resolve(`Ошибка подключения: ${err.message}`);
      });

      conn.connect({
        host,
        port: 22,
        username,
        privateKey, // теперь это просто строка, а не путь к файлу
      });
    });
  }
}