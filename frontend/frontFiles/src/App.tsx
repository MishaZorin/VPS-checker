import { useState,useEffect } from 'react';
import './App.css';

interface Server {
  id: string;
  host: string;
  username: string;
  privateKey: string;
  online: boolean;
}

const API_URL = 'http://localhost:3000';

// Все метрики, которые нужно получить одним кликом
const METRICS = ['uptime', 'ram', 'disk', 'cpu', 'ports', 'processes', 'docker', 'logs'];

interface MetricResult {
  label: string;
  value: string;
}

const METRIC_ICONS: Record<string, string> = {
  uptime: '⏱',
  ram: '🧠',
  disk: '💾',
  cpu: '⚡',
  ports: '🔌',
  processes: '📋',
  docker: '🐳',
  logs: '📜',
};

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

  // --- Форма добавления сервера ---
  const [authType, setAuthType] = useState<'password' | 'key'>('key');
  const [host, setHost] = useState('');
  const [username, setUsername] = useState('');
  const [secret, setSecret] = useState('');

  // Серверы теперь тоже только в памяти — без localStorage, сбрасываются при обновлении страницы
  const [servers, setServers] = useState<Server[]>([]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [results, setResults] = useState<MetricResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    setToken(null);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setAuthLoading(true);

    const endpoint = isRegister ? '/auth/register' : '/auth/login';

    // Формируем payload: если регистрация — передаём username, email, password
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
        // Если NestJS вернул массив ошибок от class-validator
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
        privateKey: secret,
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

    const formattedKey = server.privateKey.replace(/\\n/g, '\n').trim();

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
            privateKey: formattedKey,
          }),
        });

        const text = res.ok ? await res.text() : `Ошибка: ${res.status}`;
        return { label: metricName, value: text };
      } catch (err) {
        return { label: metricName, value: `Ошибка: ${err}` };
      }
    });

    const allResults = await Promise.all(requests);
    setResults(allResults);
    setLoading(false);
  };

  // --- Пока нет токена — показываем экран входа/регистрации ---
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
          <label>{authType === 'password' ? 'Password' : 'Private Key'}</label>
          {authType === 'password' ? (
            <input
              type="password"
              placeholder="••••••••"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
            />
          ) : (
            <textarea
              placeholder="-----BEGIN OPENSSH PRIVATE KEY-----"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              rows={4}
            />
          )}
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

      {(loading || results.length > 0) && (
        <section className="card">
          <div className="metrics-header">
            <h2>Метрики{loading ? ' (загрузка...)' : ''}</h2>
            <button
              className="btn-secondary"
              onClick={() => activeId && handleShowMetrics(activeId)}
            >
              Обновить
            </button>
          </div>

          <div className="metrics-grid">
            {results.map((r) => (
              <div className="metric-box" key={r.label}>
                <div className="metric-label">
                  <span className="metric-icon">{METRIC_ICONS[r.label] ?? '▸'}</span>
                  {r.label}
                </div>
                <pre className="raw-output">{r.value}</pre>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}