import { useState } from 'react';
import './App.css';

interface Server {
  id: string;
  host: string;
  username: string;
  privateKey: string;
  online: boolean;
  
}

interface Metrics {
  uptime: string;
  ram: { used: number; total: number };
  disk: { used: number; total: number; percent: number };
}
const API_URL = 'http://localhost:3000';
export default function App() {
  const [authType, setAuthType] = useState<'password' | 'key'>('key');
  const [host, setHost] = useState('');
  const [username, setUsername] = useState('');
  const [secret, setSecret] = useState('');

  const [servers, setServers] = useState<Server[]>([
    
  ]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  function handleAddServer() {
    if (!host || !username) return;
    const newServer: Server = {
      id: Date.now().toString(),
      host,
      username,
      online: false,
      privateKey: secret
    };
    setServers((prev) => [...prev, newServer]);
    setHost('');
    setUsername('');
    setSecret('');
  }

const handleShowMetrics = async (id: string) => {
  setActiveId(id);

  const server = servers.find((s) => s.id === id);
  if (!server) return;

  try {
    const res = await fetch(`${API_URL}/metrics/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: server.host,
        username: server.username,
        privateKey: server.privateKey, // нужно хранить это в объекте Server на фронте
      }),
    });

    if (!res.ok) {
      throw new Error(`Ошибка сервера: ${res.status}`);
    }

    const data = await res.json();
    setMetrics(data);
  } catch (err) {
    console.error('Не удалось получить метрики:', err);
    setMetrics(null);
  }
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

      {metrics && (
        <section className="card">
          <div className="metrics-header">
            <h2>Метрики</h2>
            <button className="btn-secondary" onClick={() => activeId && handleShowMetrics(activeId)}>
              Обновить
            </button>
          </div>

          <div className="metrics-grid">
            <div className="metric-box">
              <div className="metric-label">Uptime</div>
              <div className="metric-value">{metrics.uptime}</div>
            </div>

            <div className="metric-box">
              <div className="metric-label">RAM</div>
              <div className="metric-value">
                {metrics.ram.used} / {metrics.ram.total} MB
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(metrics.ram.used / metrics.ram.total) * 100}%` }}
                />
              </div>
            </div>

            <div className="metric-box">
              <div className="metric-label">Disk</div>
              <div className="metric-value">
                {metrics.disk.used}GB / {metrics.disk.total}GB ({metrics.disk.percent}%)
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${metrics.disk.percent}%` }} />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}