// import { Update, Ctx, Start, Command, Hears, On, Next } from '@grammyjs/nestjs';
// import { Context } from 'grammy';
// import { ServersService } from '../servers/servers.service';
// import { MetricsService } from '../metrics/metrics.service';
// import { AuthService } from '../auth/auth.service';

// type SessionContext = Context & {
//   session: {
//     awaitingLogin?: 'email' | 'password';
//     email?: string;
//     userId?: string;
//     accessToken?: string;
//   };
// };

// @Update()
// export class TelegramUpdate {
//   constructor(
//     private readonly serversService: ServersService,
//     private readonly metricsService: MetricsService,
//     private readonly authService: AuthService,
//   ) {}

//   @Start()
//   async onStart(@Ctx() ctx: Context) {
//     await ctx.reply('Привет! Напиши /login, чтобы войти.');
//   }

//   // ==== ЛОГИН ====

//   @Hears('/login')
//   async logIn(@Ctx() ctx: SessionContext) {
//     ctx.session.awaitingLogin = 'email';
//     await ctx.reply('Введи email:');
//   }

//   @On('message:text')
// async onText(@Ctx() ctx: SessionContext, @Next() next: () => Promise<void>) {
//   if (ctx.session.awaitingLogin === undefined) {
//     return next(); // не наш случай — пропускаем дальше
//   }
//   if (!ctx.message?.text) {
//     return next();
//   }

//   const text = ctx.message.text.trim();

//   if (ctx.session.awaitingLogin === 'email') {
//     ctx.session.email = text;
//     ctx.session.awaitingLogin = 'password';
//     await ctx.reply('Теперь пароль:');
//     return;
//   }

//   if (ctx.session.awaitingLogin === 'password') {
//     const email = ctx.session.email;
//     ctx.session.awaitingLogin = undefined;
//     ctx.session.email = undefined;

//     if (!email) return;

//     try {
//       const user = await this.authService.validateUser(email, text);
//       const { access_token } = await this.authService.login(user);

//       ctx.session.userId = String(user.id);
//       ctx.session.accessToken = access_token;

//       await ctx.reply('✅ Вход выполнен.');
//     } catch {
//       await ctx.reply('❌ Неверный email или пароль.');
//     }
//   }
// }

//   // ==== КОМАНДЫ (юзер берётся из сессии) ====

//   @Command('servers')
// async onServers(@Ctx() ctx: SessionContext) {
//   const userId = ctx.session.userId;
//   if (!userId) {
//     await ctx.reply('Сначала войди через /login.');
//     return;
//   }

//   const servers = await this.serversService.findAllByUser(userId);
//   if (!servers.length) {
//     await ctx.reply('У тебя пока нет сохранённых серверов.');
//     return;
//   }

//   const message = servers
//     .map((server, index) => `${index + 1}. ${server.host} — ${server.username}`)
//     .join('\n');

//   await ctx.reply(`Твои серверы:\n${message}`);
// }

//   @Command('metrics')
//   async onMetrics(@Ctx() ctx: SessionContext) {
//     console.log('METRICS HANDLER HIT')
    
//     if (!ctx.session.userId) {
//       await ctx.reply('Сначала войди через /login.');
//       return;
//     }
// const userId = ctx.session.userId;
//     const servers = await this.serversService.findAllByUser(userId);
//     if (!servers.length) {
//       await ctx.reply('У тебя пока нет сохранённых серверов.');
//       return;
//     }

//     await ctx.reply('⏳ Собираю метрики...');

//     const messages: string[] = [];
//     for (const server of servers) {
//       try {
//         const [uptime, ram, disk, cpu, ports, processes, docker, failedServices, failedConnections] =
//           await Promise.all([
//             this.metricsService.getUptime(server.host, server.username, server.password),
//             this.metricsService.getRam(server.host, server.username, server.password),
//             this.metricsService.getDisk(server.host, server.username, server.password),
//             this.metricsService.getCpu(server.host, server.username, server.password),
//             this.metricsService.getPorts(server.host, server.username, server.password),
//             this.metricsService.getTopProcesses(server.host, server.username, server.password),
//             this.metricsService.getDockerContainers(server.host, server.username, server.password),
//             this.metricsService.getFailed(server.host, server.username, server.password),
//             this.metricsService.getFailedConnections(server.host, server.username, server.password),
//           ]);

//         messages.push(this.formatServerMetrics(server.host, {
//           uptime, ram, disk, cpu, ports, processes, docker, failedServices, failedConnections,
//         }));
//       } catch (error) {
//         messages.push(`🖥 <b>${this.escapeHtml(server.host)}</b>\n⚠️ Ошибка подключения: ${this.escapeHtml(this.getErrorMessage(error))}`);
//       }
//     }

//     for (const chunk of this.splitTelegramMessage(messages.join('\n\n'))) {
//       await ctx.reply(chunk, { parse_mode: 'HTML' });
//     }
//   }

//   private formatServerMetrics(host: string, metrics: Record<string, string | null | undefined>): string {
//     const section = (icon: string, title: string, value: string) =>
//       `${icon} <b>${title}</b>\n<pre>${this.escapeHtml(value)}</pre>`;

//     return [
//       `🖥 <b>${this.escapeHtml(host)}</b>`,
//       section('⏱', 'Uptime', this.formatUptime(metrics.uptime)),
//       section('🧠', 'CPU', this.formatCpu(metrics.cpu)),
//       section('💾', 'RAM', this.formatRam(metrics.ram)),
//       section('💿', 'Disk', this.formatDisk(metrics.disk)),
//       section('🌐', 'Открытые порты', this.formatPorts(metrics.ports)),
//       section('📋', 'Топ процессов', this.formatProcesses(metrics.processes)),
//       section('🐳', 'Docker', this.cleanMetric(metrics.docker)),
//       section('❌', 'Неисправные сервисы', this.cleanMetric(metrics.failedServices)),
//       section('🔐', 'Неудачные подключения', this.cleanMetric(metrics.failedConnections)),
//     ].join('\n');
//   }

//   private cleanMetric(value: string | null | undefined): string {
//     return value?.replace(/\r/g, '').trim() || 'нет данных';
//   }

//   private formatUptime(value: string | null | undefined): string {
//     const raw = this.cleanMetric(value);
//     const match = raw.match(/up\s+(.+?),\s+(\d+)\s+users?,\s+load average:\s+(.+)/i);
//     return match ? `${match[1]}\nПользователей: ${match[2]}\nLoad average: ${match[3]}` : raw;
//   }

//   private formatCpu(value: string | null | undefined): string {
//     const raw = this.cleanMetric(value);
//     const idle = raw.match(/([\d.]+)\s*id/i);
//     return idle ? `Загрузка: ${(100 - Number(idle[1])).toFixed(1)}%\nСвободно: ${idle[1]}%` : raw;
//   }

//   private formatRam(value: string | null | undefined): string {
//     const lines = this.cleanMetric(value).split('\n');
//     const memory = lines.find((line) => /^Mem:/i.test(line));
//     if (!memory) return lines.join('\n');
//     const parts = memory.trim().split(/\s+/);
//     return `Всего: ${parts[1] || '—'}\nИспользуется: ${parts[2] || '—'}\nСвободно: ${parts[3] || '—'}\nДоступно: ${parts[6] || '—'}`;
//   }

//   private formatDisk(value: string | null | undefined): string {
//     const lines = this.cleanMetric(value).split('\n');
//     const disk = lines.find((line) => /\d+%/.test(line));
//     if (!disk) return lines.join('\n');
//     const parts = disk.trim().split(/\s+/);
//     return `Всего: ${parts[1] || '—'}\nИспользуется: ${parts[2] || '—'}\nСвободно: ${parts[3] || '—'}\nЗагрузка: ${parts[4] || '—'}`;
//   }

//   private formatPorts(value: string | null | undefined): string {
//     const lines = this.cleanMetric(value).split('\n');
//     const ports = lines
//       .filter((line) => line.trim() && !/^Netid\s/i.test(line))
//       .map((line) => {
//         const parts = line.trim().split(/\s+/);
//         const protocol = parts[0] || '—';
//         const address = parts[4] || parts[3] || '—';
//         return `${protocol.toUpperCase()}  ${address}`;
//       });
//     return ports.length ? ports.join('\n') : 'Открытых портов нет';
//   }

//   private formatProcesses(value: string | null | undefined): string {
//     const lines = this.cleanMetric(value).split('\n');
//     const processes = lines
//       .filter((line) => line.trim() && !/^USER\s+/i.test(line))
//       .slice(0, 5)
//       .map((line) => {
//         const parts = line.trim().split(/\s+/);
//         return `${parts[0] || '—'}  CPU ${parts[2] || '—'}%  RAM ${parts[3] || '—'}%  ${(parts.slice(10).join(' ') || 'без названия').slice(0, 80)}`;
//       });
//     return processes.length ? processes.join('\n') : 'Процессы не найдены';
//   }

//   private escapeHtml(value: string): string {
//     return value.replace(/[&<>"']/g, (character) => ({
//       '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
//     })[character] as string);
//   }

//   private getErrorMessage(error: unknown): string {
//     return error instanceof Error ? error.message : String(error);
//   }

//   private splitTelegramMessage(message: string, maxLength = 4000): string[] {
//     const chunks: string[] = [];
//     let remaining = message;

//     while (remaining.length > maxLength) {
//       const breakAt = remaining.lastIndexOf('\n', maxLength);
//       const splitAt = breakAt > 0 ? breakAt : maxLength;
//       chunks.push(remaining.slice(0, splitAt));
//       remaining = remaining.slice(splitAt).trimStart();
//     }

//     if (remaining) chunks.push(remaining);
//     return chunks.length ? chunks : ['Метрики отсутствуют.'];
//   }
// }