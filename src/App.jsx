import './App.css';
import React, { useState, useEffect } from 'react';

export default function App() {
  const [token, setToken] = useState('');
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [removingTaskId, setRemovingTaskId] = useState(null);
  const [newTaskId, setNewTaskId] = useState(null);
  const [loginError, setLoginError] = useState(false);

  // LOGIN
  async function login() {
    try {
      const res = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        setLoginError(false);
      } else {
        setLoginError(true);
      }
    } catch (err) {
      console.error(err);
      setLoginError(true);
    }
  }

  // CARGAR TAREAS
  async function load() {
    const r = await fetch('http://localhost:4000/tasks', {
      headers: { Authorization: 'Bearer ' + token }
    });
    setTasks(await r.json());
  }

  // AGREGAR TAREA
  async function add() {
    const res = await fetch('http://localhost:4000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({ title })
    });
    const newTask = await res.json();
    setTitle('');
    setTasks(prev => [...prev, newTask]);
    setNewTaskId(newTask._id);
    setTimeout(() => setNewTaskId(null), 600);
  }

  // ELIMINAR TAREA CON ANIMACIÓN
  function removeWithAnimation(id) {
    setRemovingTaskId(id);
    setTimeout(async () => {
      await fetch(`http://localhost:4000/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token }
      });
      setRemovingTaskId(null);
      load();
    }, 300);
  }

  useEffect(() => {
    if (token) load();
  }, [token]);

  return (
    <div className="login-page">
      {/* === LOGIN === */}
      {!token && (
        <div className={`login-container fade-in-up ${loginError ? 'shake' : ''}`}>
          <h2>Iniciar Sesión</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault(); // Evita recargar la página
              login();            // Llama a la función de login
            }}
          >
            <div className="input-group">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Contraseña"
                required
              />
            </div>
            <button className="login-btn" type="submit">
              Login
            </button>
          </form>
          <div className="links">
            <a href="#">¿Olvidaste tu contraseña?</a>
          </div>
        </div>
      )}

      {/* === LISTA DE TAREAS === */}
      {token && (
        <div className="app-wrapper">
          <h1 className="title">Mis Tareas</h1>

          <div className="task-input">
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Escribe una tarea..."
            />
            <button onClick={add}>+</button>
          </div>

          <ul className="tasks">
            {tasks.map(t => (
              <li
                key={t._id}
                className={`
                  ${removingTaskId === t._id ? 'removing' : ''}
                  ${newTaskId === t._id ? 'new' : ''}
                `}
              >
                {t.title}
                <button
                  className="delete-btn"
                  onClick={() => removeWithAnimation(t._id)}
                >
                  ✖
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
