import { INestApplication } from '@nestjs/common';
import { Bot, session, Context } from 'grammy';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { ServersService } from '../servers/servers.service';
import { MetricsService } from '../metrics/metrics.service';
import { AuthService } from '../auth/auth.service';

type SessionContext = Context & {
  session: {
    awaitingLogin?: 'email' | 'password';
    email?: string;
    userId?: string;
    accessToken?: string;
  };
};

function cleanMetric(value: string | null | undefined): string {
  return value?.replace(/\r/g, '').trim() || 'нет данных';
}

function formatUptime(value: string | null | undefined): string {
  const raw = cleanMetric(value);
  const match = raw.match(/up\s+(.+?),\s+(\d+)\s+users?,\s+load average:\s+(.+)/i);
  return match ? `${match[1]}\nПользователей: ${match[2]}\nLoad average: ${match[3]}` : raw;
}

function formatCpu(value: string | null | undefined): string {
  const raw = cleanMetric(value);
  const idle = raw.match(/([\d.]+)\s*id/i);
  return idle ? `Загрузка: ${(100 - Number(idle[1])).toFixed(1)}%\nСвободно: ${idle[1]}%` : raw;
}

function formatRam(value: string | null | undefined): string {
  const lines = cleanMetric(value).split('\n');
  const memory = lines.find((line) => /^Mem:/i.test(line));
  if (!memory) return lines.join('\n');
  const parts = memory.trim().split(/\s+/);
  return `Всего: ${parts[1] || '—'}\nИспользуется: ${parts[2] || '—'}\nСвободно: ${parts[3] || '—'}\nДоступно: ${parts[6] || '—'}`;
}

function formatDisk(value: string | null | undefined): string {
  const lines = cleanMetric(value).split('\n');
  const disk = lines.find((line) => /\d+%/.test(line));
  if (!disk) return lines.join('\n');
  const parts = disk.trim().split(/\s+/);
  return `Всего: ${parts[1] || '—'}\nИспользуется: ${parts[2] || '—'}\nСвободно: ${parts[3] || '—'}\nЗагрузка: ${parts[4] || '—'}`;
}

function formatPorts(value: string | null | undefined): string {
  const lines = cleanMetric(value).split('\n');
  const ports = lines
    .filter((line) => line.trim() && !/^Netid\s/i.test(line))
    .map((line) => {
      const parts = line.trim().split(/\s+/);
      const protocol = parts[0] || '—';
      const address = parts[4] || parts[3] || '—';
      return `${protocol.toUpperCase()}  ${address}`;
    });
  return ports.length ? ports.join('\n') : 'Открытых портов нет';
}

function formatProcesses(value: string | null | undefined): string {
  const lines = cleanMetric(value).split('\n');
  const processes = lines
    .filter((line) => line.trim() && !/^USER\s+/i.test(line))
    .slice(0, 5)
    .map((line) => {
      const parts = line.trim().split(/\s+/);
      return `${parts[0] || '—'}  CPU ${parts[2] || '—'}%  RAM ${parts[3] || '—'}%  ${(parts.slice(10).join(' ') || 'без названия').slice(0, 80)}`;
    });
  return processes.length ? processes.join('\n') : 'Процессы не найдены';
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character] as string);
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function splitTelegramMessage(message: string, maxLength = 4000): string[] {
  const chunks: string[] = [];
  let remaining = message;

  while (remaining.length > maxLength) {
    const breakAt = remaining.lastIndexOf('\n', maxLength);
    const splitAt = breakAt > 0 ? breakAt : maxLength;
    chunks.push(remaining.slice(0, splitAt));
    remaining = remaining.slice(splitAt).trimStart();
  }

  if (remaining) chunks.push(remaining);
  return chunks.length ? chunks : ['Метрики отсутствуют.'];
}

function formatServerMetrics(host: string, metrics: Record<string, string | null | undefined>): string {
  const section = (icon: string, title: string, value: string) =>
    `${icon} <b>${title}</b>\n<pre>${escapeHtml(value)}</pre>`;

  return [
    `🖥 <b>${escapeHtml(host)}</b>`,
    section('⏱', 'Uptime', formatUptime(metrics.uptime)),
    section('🧠', 'CPU', formatCpu(metrics.cpu)),
    section('💾', 'RAM', formatRam(metrics.ram)),
    section('💿', 'Disk', formatDisk(metrics.disk)),
    section('🌐', 'Открытые порты', formatPorts(metrics.ports)),
    section('📋', 'Топ процессов', formatProcesses(metrics.processes)),
    section('🐳', 'Docker', cleanMetric(metrics.docker)),
    section('❌', 'Неисправные сервисы', cleanMetric(metrics.failedServices)),
    section('🔐', 'Неудачные подключения', cleanMetric(metrics.failedConnections)),
  ].join('\n');
}

export function startTelegramBot(app: INestApplication) {
  const token = process.env.TG_KEY;
  if (!token) {
    console.error('TG_KEY is not defined, Telegram bot disabled');
    return;
  }

  const serversService = app.get(ServersService);
  const metricsService = app.get(MetricsService);
  const authService = app.get(AuthService);

  const bot = new Bot<SessionContext>(token, {
    client: {
      baseFetchConfig: {
        agent: new HttpsProxyAgent('http://172.19.0.1:8118'),
      },
    },
  });

  bot.use(session({ initial: () => ({}) }));

  // --- Команды регистрируем ДО общего обработчика message:text ---

  bot.command('start', async (ctx) => {
    await ctx.reply('Привет! Напиши /login, чтобы войти.');
  });

  bot.command('login', async (ctx) => {
    ctx.session.awaitingLogin = 'email';
    ctx.session.email = undefined;
    await ctx.reply('Введи email:');
  });

  bot.command('cancel', async (ctx) => {
    ctx.session.awaitingLogin = undefined;
    ctx.session.email = undefined;
    await ctx.reply('Отменено.');
  });

  bot.command('logout', async (ctx) => {
    ctx.session.userId = undefined;
    ctx.session.accessToken = undefined;
    ctx.session.awaitingLogin = undefined;
    ctx.session.email = undefined;
    await ctx.reply('👋 Вы вышли из аккаунта.');
  });

  bot.command('servers', async (ctx) => {
    const userId = ctx.session.userId;
    if (!userId) {
      await ctx.reply('Сначала войди через /login.');
      return;
    }
    try {
      const servers = await serversService.findAllByUser(userId);
      if (!servers.length) {
        await ctx.reply('У тебя пока нет сохранённых серверов.');
        return;
      }
      const message = servers
        .map((s, i) => `${i + 1}. ${s.host} — ${s.username}`)
        .join('\n');
      await ctx.reply(`Твои серверы:\n${message}`);
    } catch (error) {
      await ctx.reply(`⚠️ Ошибка: ${getErrorMessage(error)}`);
    }
  });

  bot.command('metrics', async (ctx) => {
    if (!ctx.session.userId) {
      await ctx.reply('Сначала войди через /login.');
      return;
    }
    const userId = ctx.session.userId;

    let servers;
    try {
      servers = await serversService.findAllByUser(userId);
    } catch (error) {
      await ctx.reply(`⚠️ Ошибка: ${getErrorMessage(error)}`);
      return;
    }

    if (!servers.length) {
      await ctx.reply('У тебя пока нет сохранённых серверов.');
      return;
    }

    await ctx.reply('⏳ Собираю метрики...');

    const messages: string[] = [];
    for (const server of servers) {
      try {
        const [uptime, ram, disk, cpu, ports, processes, docker, failedServices, failedConnections] =
          await Promise.all([
            metricsService.getUptime(server.host, server.username, server.password),
            metricsService.getRam(server.host, server.username, server.password),
            metricsService.getDisk(server.host, server.username, server.password),
            metricsService.getCpu(server.host, server.username, server.password),
            metricsService.getPorts(server.host, server.username, server.password),
            metricsService.getTopProcesses(server.host, server.username, server.password),
            metricsService.getDockerContainers(server.host, server.username, server.password),
            metricsService.getFailed(server.host, server.username, server.password),
            metricsService.getFailedConnections(server.host, server.username, server.password),
          ]);

        messages.push(formatServerMetrics(server.host, {
          uptime, ram, disk, cpu, ports, processes, docker, failedServices, failedConnections,
        }));
      } catch (error) {
        messages.push(
          `🖥 <b>${escapeHtml(server.host)}</b>\n⚠️ Ошибка подключения: ${escapeHtml(getErrorMessage(error))}`,
        );
      }
    }

    for (const chunk of splitTelegramMessage(messages.join('\n\n'))) {
      await ctx.reply(chunk, { parse_mode: 'HTML' });
    }
  });

  // --- Обработчик свободного текста: только для процесса логина ---

  bot.on('message:text', async (ctx, next) => {
    const text = ctx.message.text.trim();

    // Команды не трогаем — пусть их обрабатывают bot.command(...)
    if (text.startsWith('/')) {
      return next();
    }

    // Нет активного логина — не наше дело, пропускаем дальше
    if (ctx.session.awaitingLogin === undefined) {
      return next();
    }

    if (ctx.session.awaitingLogin === 'email') {
      ctx.session.email = text;
      ctx.session.awaitingLogin = 'password';
      await ctx.reply('Теперь пароль:');
      return;
    }

    if (ctx.session.awaitingLogin === 'password') {
      const email = ctx.session.email;
      ctx.session.awaitingLogin = undefined;
      ctx.session.email = undefined;

      if (!email) {
        await ctx.reply('Сессия сброшена, начни заново через /login.');
        return;
      }

      try {
        const user = await authService.validateUser(email, text);
        const { access_token } = await authService.login(user);
        ctx.session.userId = String(user.id);
        ctx.session.accessToken = access_token;
        await ctx.reply('✅ Вход выполнен.');
      } catch {
        await ctx.reply('❌ Неверный email или пароль.');
      }
      return;
    }

    // На всякий случай — если состояние неизвестное
    return next();
  });

  bot.catch((err) => {
    console.error('BOT ERROR:', err);
  });

  bot.start();
  console.log('Telegram bot started via proxy');
}