import './App.css';
import React, { useState, useEffect } from 'react';

export default function App() {
  const [token, setToken] = useState('');
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');       // Para login
  const [password, setPassword] = useState(''); // Para login
  const [removingTaskId, setRemovingTaskId] = useState(null);
  const [newTaskId, setNewTaskId] = useState(null);
  const [loginError, setLoginError] = useState(false); // Shake si falla login

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
    <div className="app-wrapper">
      {/* === LOGIN === */}
      {!token && (
        <>
          <h1 className={`title fade-in-up ${loginError ? 'shake' : ''}`}>
            Iniciar Sesión
          </h1>
          <div
            className={`task-input fade-in-up ${loginError ? 'shake' : ''}`}
            style={{ flexDirection: 'column', gap: '14px' }}
          >
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Contraseña"
            />
            <button className="login-btn" onClick={login}>
              Login
            </button>
          </div>
        </>
      )}

      {/* === LISTA DE TAREAS === */}
      {token && (
        <>
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
        </>
      )}
    </div>
  );
}
