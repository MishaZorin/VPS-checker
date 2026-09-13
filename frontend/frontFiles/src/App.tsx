import { useState, useEffect } from 'react';
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
const METRICS = ['uptime', 'ram', 'disk', 'cpu', 'ports', 'processes', 'docker'];

interface MetricResult {
  label: string;
  value: string;
}

export default function App() {
  const [authType, setAuthType] = useState<'password' | 'key'>('key');
  const [host, setHost] = useState('');
  const [username, setUsername] = useState('');
  const [secret, setSecret] = useState('');

  const [servers, setServers] = useState<Server[]>(() => {
    const savedServers = localStorage.getItem('servers');
    return savedServers ? JSON.parse(savedServers) : [];
  });

  useEffect(() => {
    localStorage.setItem('servers', JSON.stringify(servers));
  }, [servers]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [results, setResults] = useState<MetricResult[]>([]);
  const [loading, setLoading] = useState(false);

  function handleAddServer() {
    if (!host || !username) return;
    const newServer: Server = {
      id: Date.now().toString(),
      host,
      username,
      online: false,
      privateKey: secret,
    };
    setServers((prev) => [...prev, newServer]);
    setHost('');
    setUsername('');
    setSecret('');
  }

  // Запрашивает СРАЗУ ВСЕ команды из списка METRICS для одного сервера
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
          headers: { 'Content-Type': 'application/json' },
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

  return (
    <div className="page">
      <header className="header">
        <h1>VPS Checker</h1>
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
                <div className="metric-label">{r.label}</div>
                <pre className="raw-output">{r.value}</pre>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}