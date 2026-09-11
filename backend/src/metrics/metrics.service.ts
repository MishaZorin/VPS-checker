import { Injectable } from '@nestjs/common';
import { Client } from 'ssh2';

@Injectable()
export class MetricsService {
  connectToServer(host: string, username: string, privateKey: string): Promise<Client> {
    return new Promise((resolve, reject) => {
      const conn = new Client();

      conn.on('ready', () => {
        resolve(conn); 
      });

      conn.on('error', (err) => {
        reject('проверьте подключение');
      });

      conn.connect({
        host,
        port: 22,
        username,
        privateKey,
      });
    });
  }
}