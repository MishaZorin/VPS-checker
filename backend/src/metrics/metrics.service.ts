import { Injectable } from '@nestjs/common';
import { Client } from 'ssh2';
import * as crypto from 'crypto';

@Injectable()
export class MetricsService {
  execCommand(conn: Client, command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      conn.exec(command, (err, stream) => {
        if (err) {
          reject(err);
          return;
        }

        let output = '';

        stream.on('data', (data: Buffer) => {
          output += data.toString();
        });

        stream.on('close', () => {
          resolve(output.trim());
        });
      });
    });
  }

  async getUptime(host: string, username: string, password: string): Promise<string> {
    const conn = await this.connectToServer(host, username, password);
    const uptimeRaw = await this.execCommand(conn, 'uptime');
    conn.end();
    return uptimeRaw;
  }

  async getTop(host: string, username: string, password: string): Promise<string> {
    const conn = await this.connectToServer(host, username, password);
    const topRaw = await this.execCommand(conn, 'top -bn1');
    conn.end();
    return topRaw;
  }

  async getRam(host: string, username: string, password: string): Promise<string> {
    const conn = await this.connectToServer(host, username, password);
    const ramRaw = await this.execCommand(conn, 'free -h');
    conn.end();
    return ramRaw;
  }

  async getDisk(host: string, username: string, password: string): Promise<string> {
    const conn = await this.connectToServer(host, username, password);
    const diskRaw = await this.execCommand(conn, 'df -h /');
    conn.end();
    return diskRaw;
  }

  async getCpu(host: string, username: string, password: string): Promise<string> {
    const conn = await this.connectToServer(host, username, password);
    const cpuRaw = await this.execCommand(conn, 'top -bn1 | grep "Cpu(s)"');
    conn.end();
    return cpuRaw;
  }

  async getPorts(host: string, username: string, password: string): Promise<string> {
    const conn = await this.connectToServer(host, username, password);
    const portsRaw = await this.execCommand(conn, 'ss -tuln');
    conn.end();
    return portsRaw;
  }

  async getTopProcesses(host: string, username: string, password: string): Promise<string> {
    const conn = await this.connectToServer(host, username, password);
    const processesRaw = await this.execCommand(conn, 'ps aux --sort=-%cpu | head -5');
    conn.end();
    return processesRaw;
  }

  async getDockerContainers(host: string, username: string, password: string): Promise<string> {
    const conn = await this.connectToServer(host, username, password);
    const dockerRaw = await this.execCommand(conn, 'docker ps --format "{{.Names}}\t{{.Status}}"');
    conn.end();
    return dockerRaw;
  }

  async getFailed(host: string, username: string, password: string): Promise<string> {
    const conn = await this.connectToServer(host, username, password);
    try {
      return await this.execCommand(
        conn,
        'systemctl list-units --failed --no-legend --no-pager 2>/dev/null || true',
      );
    } finally {
      conn.end();
    }
  }

  async getFailedConnections(host: string, username: string, password: string): Promise<string> {
    const conn = await this.connectToServer(host, username, password);
    try {
      return await this.execCommand(
        conn,
        "(grep -h 'Failed password' /var/log/auth.log /var/log/secure 2>/dev/null || true) | awk '{print (NF-5), (NF-3)}' | sort | uniq -c | sort -rn | head -10",
      );
    } finally {
      conn.end();
    }
  }

  connectToServer(host: string, username: string, password: string): Promise<Client> {
    return new Promise((resolve, reject) => {
      const conn = new Client();

      conn.on('ready', () => {
        resolve(conn); 
      });

      conn.on('error', (err) => {
        console.error(`[SSH Connection Error] Ошибка подключения к ${host}:`, err.message);
        reject('проверьте подключение');
      });

      try {
        conn.connect({
          host,
          port: 22,
          username,
          password, 
        });
      } catch (err: any) {
        console.error(`Критическая ошибка дешифрации для host ${host}:`, err);
        reject('Ошибка расшифровки ключа');
      }
    });
  }
}
