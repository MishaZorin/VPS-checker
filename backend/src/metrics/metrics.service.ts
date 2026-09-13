import { Injectable } from '@nestjs/common';
import { Client } from 'ssh2';

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