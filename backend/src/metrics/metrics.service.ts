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
async getUptime(host: string, username: string, privateKey: string): Promise<string> {
  const conn = await this.connectToServer(host, username, privateKey);
  const uptimeRaw = await this.execCommand(conn, 'uptime');
  conn.end();
  return uptimeRaw;
}
async getTop(host: string, username: string, privateKey: string): Promise<string> {
  const conn = await this.connectToServer(host, username, privateKey);
  const topRaw = await this.execCommand(conn, 'top -bn1');
  conn.end();
  return topRaw;
}

async getRam(host: string, username: string, privateKey: string): Promise<string> {
  const conn = await this.connectToServer(host, username, privateKey);
  const ramRaw = await this.execCommand(conn, 'free -h');
  conn.end();
  return ramRaw;
}

async getDisk(host: string, username: string, privateKey: string): Promise<string> {
  const conn = await this.connectToServer(host, username, privateKey);
  const diskRaw = await this.execCommand(conn, 'df -h /');
  conn.end();
  return diskRaw;
}

async getCpu(host: string, username: string, privateKey: string): Promise<string> {
  const conn = await this.connectToServer(host, username, privateKey);
  const cpuRaw = await this.execCommand(conn, 'top -bn1 | grep "Cpu(s)"');
  conn.end();
  return cpuRaw;
}

async getPorts(host: string, username: string, privateKey: string): Promise<string> {
  const conn = await this.connectToServer(host, username, privateKey);
  const portsRaw = await this.execCommand(conn, 'ss -tuln');
  conn.end();
  return portsRaw;
}

async getTopProcesses(host: string, username: string, privateKey: string): Promise<string> {
  const conn = await this.connectToServer(host, username, privateKey);
  const processesRaw = await this.execCommand(conn, 'ps aux --sort=-%cpu | head -5');
  conn.end();
  return processesRaw;
}

async getDockerContainers(host: string, username: string, privateKey: string): Promise<string> {
  const conn = await this.connectToServer(host, username, privateKey);
  const dockerRaw = await this.execCommand(conn, 'docker ps --format "{{.Names}}\t{{.Status}}"');
  conn.end();
  return dockerRaw;
}
async getFailed(host: string, username: string, privateKey: string): Promise<string> {
  const conn = await this.connectToServer(host, username, privateKey);
  try {
    return await this.execCommand(
      conn,
      'systemctl list-units --failed --no-legend --no-pager 2>/dev/null || true',
    );
  } finally {
    conn.end();
  }
}

async getFailedConnections(host: string, username: string, privateKey: string): Promise<string> {
  const conn = await this.connectToServer(host, username, privateKey);
  try {
    return await this.execCommand(
      conn,
      "(grep -h 'Failed password' /var/log/auth.log /var/log/secure 2>/dev/null || true) | awk '{print $(NF-5), $(NF-3)}' | sort | uniq -c | sort -rn | head -10",
    );
  } finally {
    conn.end();
  }
}



connectToServer(host: string, username: string, privateKey: string): Promise<Client> {
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
      let finalSshKey = '';

      // НАЧАЛО ИСПРАВЛЕНИЯ: Если ключ уже чистый (начинается как SSH-ключ), не расшифровываем его!
      if (privateKey && privateKey.trim().startsWith('-----BEGIN')) {
        finalSshKey = privateKey;
      } else {
        // Если пришел зашифрованный хэш из БД — расшифровываем
        const algorithm = 'aes-256-cbc';
        const rawKey = (process.env.ENCRYPTION_KEY || '12345678901234567890123456789012')
          .slice(0, 32)
          .padEnd(32, ' ');

        const key = Buffer.from(rawKey, 'utf8');
        const iv = Buffer.alloc(16, 0); 

        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decryptedKey = decipher.update(privateKey, 'hex', 'utf8');
        decryptedKey += decipher.final('utf8');
        finalSshKey = decryptedKey;
      }

      // Нормализуем переносы строк в любом случае
      finalSshKey = finalSshKey
        .replace(/\\n/g, '\n')
        .replace(/\r\n/g, '\n')
        .trim();

      conn.connect({
        host,
        port: 22,
        username,
        privateKey: finalSshKey, 
      });
      
    } catch (err: any) {
      console.error(`Критическая ошибка дешифрации для host ${host}:`, err);
      reject('Ошибка расшифровки ключа');
    }
  });
}



}