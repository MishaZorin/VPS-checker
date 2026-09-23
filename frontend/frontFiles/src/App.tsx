import { useState, useEffect } from 'react';
import './App.css';

interface Server {
  id: string;
  host: string;
  username: string;
  password: string;
  online: boolean;
}


const API_URL = 'http://localhost:3000';

// Все метрики, которые нужно получить одним кликом
const METRICS = ['uptime', 'ram', 'disk', 'cpu', 'ports', 'processes', 'docker', 'logs','top','failedUnits','failedConnections'];

interface MetricResult {
  label: string;
  value: string;
}

// const METRIC_ICONS: Record<string, string> = {
//   uptime: '⏱',
//   ram: '🧠',
//   disk: '💾',
//   cpu: '⚡',
//   ports: '🔌',
//   processes: '📋',
//   docker: '🐳',
//   logs: '📜',
// };

export default function App() {
// чтобы приложение узнало о вашей авторизации мгновенно
const [token, setToken] = useState<string | null>(() => {
  return localStorage.getItem('token');
});

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameAuth, setUsernameAuth] = useState('');
  const [error, setError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [authType, setAuthType] = useState<'password' | 'key'>('key');
  const [host, setHost] = useState('');
  const [username, setUsername] = useState('');
  const [secret, setSecret] = useState('');

  const [servers, setServers] = useState<Server[]>([]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [results, setResults] = useState<MetricResult[]>([]);
  const [loading, setLoading] = useState(false);
//   useEffect(() => {
//   if (!activeId) return;

//   let timeout: ReturnType<typeof setTimeout>;

//   const update = async () => {
//     await handleShowMetrics(activeId);

//     timeout = setTimeout(update, 5000);
//   };

//   update();

//   return () => {
//     clearTimeout(timeout);
//   };
// }, [activeId]);

  useEffect(() => {
    if (!token) {
      setServers([]);
      return;
    }

    let cancelled = false;

    const loadServers = async () => {
      try {
        const res = await fetch(`${API_URL}/servers`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          localStorage.removeItem('token');
          if (!cancelled) setToken(null);
          return;
        }

        if (!res.ok) {
          throw new Error(`Не удалось загрузить серверы: ${res.status}`);
        }

        const data: Server[] = await res.json();
        if (!cancelled) setServers(data);
      } catch (err) {
        if (!cancelled) console.error('Ошибка загрузки серверов:', err);
      }
    };

    void loadServers();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setServers([]);
    setActiveId(null);
    setResults([]);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setAuthLoading(true);

    const endpoint = isRegister ? '/auth/register' : '/auth/login';

    
    const payload = isRegister
      ? { username: usernameAuth, email, password }
      : { email, password };

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
     
        const errorMessage = Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message;
        throw new Error(errorMessage || 'AUTH_FAILED');
      }

      setToken(data.access_token);
      localStorage.setItem('token', data.access_token);
    } catch (err: any) {
      setError(err.message || 'AUTH_ERROR');
    } finally {
      setAuthLoading(false);
    }
  };
  async function handleConnectTelegram() {
  const res = await fetch(`${API_URL}/users/telegram/link`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  window.open(data.link, '_blank'); // откроет Telegram с уже готовым кодом
}
const getMetricValue = (label: string) => {
  return results.find((r) => r.label === label)?.value ?? '';
};

const getDiskPercent = () => {
  const raw = getMetricValue('disk');
  const match = raw.match(/(\d+)%/);

  return match ? Number(match[1]) : null;
};

const getRamPercent = () => {
  const raw = getMetricValue('ram');

  const lines = raw.split('\n');
  const memLine = lines.find((line) => line.startsWith('Mem:'));

  if (!memLine) return null;

  const parts = memLine.trim().split(/\s+/);

  const total = parseFloat(parts[1]);
  const used = parseFloat(parts[2]);

  if (!total || !used) return null;

  return Math.round((used / total) * 100);
};

const getCpuPercent = () => {
  const raw = getMetricValue('cpu');

  const match = raw.match(/(\d+(?:\.\d+)?)\s*id/);

  if (!match) return null;

  return Math.round(100 - Number(match[1]));
};

const getDockerCount = () => {
  const raw = getMetricValue('docker');

  if (!raw.trim()) return 0;

  return raw.trim().split('\n').length;
};

const getPortsCount = () => {
  const raw = getMetricValue('ports');

  if (!raw.trim()) return 0;

  return raw
    .split('\n')
    .filter((line) => line.trim() && !line.startsWith('Netid'))
    .length;
};
const getFailedUnitsCount = () => {
  const raw = getMetricValue('failedUnits').trim();
  if (!raw || /^0\s+loaded\s+units?\s+listed\.?$/i.test(raw)) return 0;

  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(
      (line) =>
        line &&
        !/^\d+\s+loaded\s+units?\s+listed\.?$/i.test(line) &&
        !/^unit\s+load\s+active\s+sub\s+description$/i.test(line),
    ).length;
};

const getFailedSshCount = () => {
  const raw = getMetricValue('failedConnections');
  if (!raw.trim()) return 0;

  return raw.split('\n').reduce((sum, line) => {
    const count = Number.parseInt(line.trim().split(/\s+/)[0], 10);
    return sum + (Number.isNaN(count) ? 0 : count);
  }, 0);
};
const getUptimeData = () => {
  const raw = getMetricValue('uptime');
  if (!raw.trim()) return '';

  const cleanStr = raw.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  const regex = /up\s+(.*?),\s+(\d+)\s+users?,\s+load\s+average:\s+([\d.]+),\s+([\d.]+),\s+([\d.]+)/;
  const match = cleanStr.match(regex);

  if (!match) return '';

  const uptime = match[1];      // "26 days, 12:43"
  const la1 = match[3];         // "0.16"

  // Возвращаем готовую строку, которую React сможет отрендерить
  return `Up: ${uptime} | LA: ${la1}`;
};



const activeServer = servers.find((s) => s.id === activeId);

const diskPercent = getDiskPercent();
const ramPercent = getRamPercent();
const cpuPercent = getCpuPercent();
const dockerCount = getDockerCount();
const portsCount = getPortsCount();
const failedUnits = getFailedUnitsCount()
const uptime = getUptimeData();
const failedConn = getFailedSshCount()

async function handleAddServer() {
  if (!host || !username || !secret) return;

  try {
    const res = await fetch(`${API_URL}/servers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        host,
        username,
        authType,
        password: secret,
      }),
    });

    if (!res.ok) {
      throw new Error(`Ошибка сохранения сервера: ${res.status}`);
    }

    const savedServer = await res.json();

    // Добавляем в список именно то, что реально сохранилось в БД (с настоящим id)
    setServers((prev) => [...prev, savedServer]);

    setHost('');
    setUsername('');
    setSecret('');
  } catch (err) {
    console.error(err);
  }
}
const handleDeleteServer = async (serverId: string) => {
  try {
    const res = await fetch(`${API_URL}/servers/${serverId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));

      throw new Error(
        errorData.message || `Ошибка сервера: ${res.status}`
      );
    }

    // Удаляем сервер из отображаемого списка
    setServers(prev =>
      prev.filter(server => server.id !== serverId)
    );

    // Очищаем результаты только после успешного удаления
    setResults([]);

  } catch (error) {
    console.error("Ошибка при удалении сервера:", error);
  }
};

  
  const handleShowMetrics = async (serverId: string) => {
    setActiveId(serverId);
    setLoading(true);
    setResults([]);

    const server = servers.find((s) => s.id === serverId);
    if (!server) {
      setLoading(false);
      return;
    }

  
    // Один запрос на каждую метрику, все параллельно через Promise.all
    const requests = METRICS.map(async (metricName) => {
      try {
        const res = await fetch(`${API_URL}/metrics/${metricName}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            host: server.host,
            username: server.username,
            password: server.password
          }),
        });

        const text = res.ok ? await res.text() : `Ошибка: ${res.status}`;
        return { label: metricName, value: text.trim() };
      } catch (err) {
        return { label: metricName, value: `Ошибка: ${err}` };
      }
    });

    const allResults = await Promise.all(requests);
    setResults(allResults);
    setLoading(false);
  };


  if (!token) {
    return (
      <div className="page auth-page">
        <div className="card auth-card">
          <h1 className="auth-title">VPS Checker</h1>
          <p className="auth-subtitle">
            {isRegister ? 'Создайте аккаунт' : 'Войдите в аккаунт'}
          </p>

          <form onSubmit={handleAuth}>
            {isRegister && (
              <div className="form-row">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="misha"
                  value={usernameAuth}
                  onChange={(e) => setUsernameAuth(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-row">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button className="btn-primary auth-submit" type="submit" disabled={authLoading}>
              {authLoading
                ? 'Подождите...'
                : isRegister
                ? 'Зарегистрироваться'
                : 'Войти'}
            </button>
          </form>

          <button
            className="auth-toggle"
            onClick={() => {
              setIsRegister((prev) => !prev);
              setError('');
            }}
          >
            {isRegister
              ? 'Уже есть аккаунт? Войти'
              : 'Нет аккаунта? Зарегистрироваться'}
          </button>
        </div>
      </div>
    );
  }

  // --- Основной экран после входа ---
  return (
    <div className="page">
      <header className="header">
        <h1>VPS Checker</h1>
        <button className="btn-secondary" onClick={handleLogout}>
          Выйти
        </button>
        <button className="btn-secondary" onClick={handleConnectTelegram}>
  Подключить Telegram
</button>
      </header>

      <section className="card">
        <h2>Добавить сервер</h2>

        <div className="form-row">
          <label>Host</label>
          <input
            type="text"
            placeholder="78.24.222.54"
            value={host}
            onChange={(e) => setHost(e.target.value)}
          />
        </div>

        <div className="form-row">
          <label>Username</label>
          <input
            type="text"
            placeholder="root"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="toggle-group">
          <button
            className={authType === 'password' ? 'toggle active' : 'toggle'}
            onClick={() => setAuthType('password')}
          >
            Пароль
          </button>
          <button
            className={authType === 'key' ? 'toggle active' : 'toggle'}
            onClick={() => setAuthType('key')}
          >
            SSH-ключ
          </button>
        </div>

        <div className="form-row">
  <label>Password</label>
  <input
    type="password"
    placeholder="••••••••"
    value={secret}
    onChange={(e) => setSecret(e.target.value)}
  />
</div>


        <button className="btn-primary" onClick={handleAddServer}>
          Добавить сервер
        </button>
      </section>

      <section className="card">
        <h2>Мои серверы</h2>

        <div className="server-list">
          {servers.map((s) => (
            <div
              key={s.id}
              className={s.id === activeId ? 'server-row active' : 'server-row'}
            >
              <span className={s.online ? 'status online' : 'status offline'} />
              <span className="server-host">{s.host}</span>
              <span className="server-username">{s.username}</span>
              <button className="btn-secondary" onClick={() => handleShowMetrics(s.id)}>
                Показать метрики
              </button>
              <button className="btn-secondary" onClick={() =>  handleDeleteServer(s.id)}>
                Удалить
              </button>
              
            </div>
          ))}
        </div>
      </section>

      {(loading || results.length > 0) && activeServer && (
  <section className="card server-dashboard">

    <div className="server-dashboard-header">

      <div>
        <h2>{activeServer.host}</h2>

        <div className="server-address">
          {activeServer.username}@{activeServer.host}
        </div>
      </div>

      <div className="server-header-actions">

        <span className="status-text">
          <span className="status online" />
          Online
        </span>

        <button
          className="btn-secondary"
          onClick={() => handleShowMetrics(activeServer.id)}
          disabled={loading}
        >
          {loading ? 'Обновление...' : 'Обновить'}
        </button>

      </div>

    </div>


    <div className="main-metrics">

      <div className="metric-box">

        <div className="metric-label">
          ⚡ CPU
        </div>

        <div className="metric-value">
          {cpuPercent !== null ? `${cpuPercent}%` : '—'}
        </div>

      </div>


      <div className="metric-box">

        <div className="metric-label">
          🧠 RAM
        </div>

        <div className="metric-value">
          {ramPercent !== null ? `${ramPercent}%` : '—'}
        </div>

      </div>


      <div className="metric-box">

        <div className="metric-label">
          💾 DISK
        </div>

        <div className="metric-value">

          {diskPercent !== null
            ? `${diskPercent}%`
            : '—'
          }

          {diskPercent !== null && diskPercent >= 80 && (
            <span className="metric-warning"> ⚠️</span>
          )}

        </div>

      </div>

    </div>


    <div className="secondary-metrics">

      <div className="metric-box">

        <div className="metric-label">
          ⏱ UPTIME
        </div>

        <pre className="metric-text">
          {uptime || '—'}
        </pre>

      </div>


      <div className="metric-box">

        <div className="metric-label">
          🐳 DOCKER
        </div>

        <div className="metric-value">
          {dockerCount || '—'} running
        </div>

      </div>


      <div className="metric-box">

        <div className="metric-label">
          🔌 PORTS
        </div>

        <div className="metric-value">
          {portsCount || '—'} listening
        </div>

      </div>

      <div className="metric-box">

        <div className="metric-label">
          🔌 Failed Units
        </div>

        <div className="metric-value">
          {getMetricValue('failedUnits').startsWith('Ошибка:')
            ? '—'
            : `${failedUnits} Failed Services`}
        </div>

      </div>

      <div className="metric-box">

        <div className="metric-label">
          🔌 Failed SSH Conn
        </div>

        <div className="metric-value">
          {getMetricValue('failedConnections').startsWith('Ошибка:')
            ? '—'
            : `${failedConn} Failed Ssh`}
        </div>

      </div>

      

    </div>


    {diskPercent !== null && diskPercent >= 80 && (

      <div className="warning-box">

        <div className="warning-title">
          ⚠️ Внимание
        </div>

        <div>
          Диск заполнен на {diskPercent}%.
        </div>

      </div>

    )}


    {/* <details className="raw-details">

      <summary>
        Технические данные
      </summary>

      <div className="metrics-grid">

        {results.map((r) => (

          <div className="metric-box" key={r.label}>

            <div className="metric-label">

              <span className="metric-icon">
                {METRIC_ICONS[r.label] ?? '▸'}
              </span>

              {r.label}

            </div>

            <pre className="raw-output">
              {r.value}
            </pre>

          </div>

        ))}

      </div>

    </details> */}

  </section>
)}
    </div>
  );
}