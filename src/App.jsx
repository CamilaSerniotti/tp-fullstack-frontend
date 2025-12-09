import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

function Login({ token, setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const navigate = useNavigate();

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
        navigate('/tasks'); // Redirige al panel de tareas
      } else {
        setLoginError(true);
      }
    } catch (err) {
      console.error(err);
      setLoginError(true);
    }
  }

  if (token) return <Navigate to="/tasks" />;

  return (
    <div className={`login-page`}>
      <div className={`login-container fade-in-up ${loginError ? 'shake' : ''}`}>
        <h2>Iniciar Sesión</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            login();
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
    </div>
  );
}

function Tasks({ token }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [removingTaskId, setRemovingTaskId] = useState(null);
  const [newTaskId, setNewTaskId] = useState(null);

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
    load();
  }, []);

  if (!token) return <Navigate to="/" />;

  return (
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
  );
}

export default function App() {
  const [token, setToken] = useState('');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login token={token} setToken={setToken} />} />
        <Route path="/tasks" element={<Tasks token={token} />} />
        {/* Redirige cualquier ruta desconocida al login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
