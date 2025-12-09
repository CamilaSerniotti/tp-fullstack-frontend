# ✅ Gestor de Tareas - Full Stack

Este proyecto consiste en el desarrollo de un **Gestor de Tareas** construido con una arquitectura **Full Stack**, utilizando tecnologías modernas tanto en el frontend como en el backend.  
Su objetivo principal es permitir al usuario **registrarse, iniciar sesión y gestionar sus tareas personales** de forma sencilla, rápida y segura.

---

## 🔧 Tecnologías Utilizadas

### 🖥️ Frontend
- HTML5
- CSS3 con diseño minimalista oscuro
- JavaScript (ES6+)
- Vite como entorno de desarrollo
- Fetch API para la comunicación con el backend

### ⚙️ Backend
- Node.js + Express
- MongoDB + Mongoose para el manejo de la base de datos
- JWT (JSON Web Tokens) para autenticación segura
- CORS para permitir solicitudes desde el frontend

---

## 🧱 Descripción General del Funcionamiento

### 🔐 1. Sistema de Autenticación

El usuario puede:
- Registrarse con email y contraseña
- Iniciar sesión
- Obtener un token JWT que le permite realizar acciones protegidas

El token se guarda en el navegador y se utiliza en cada petición al servidor para validar la identidad del usuario.

---

### 📌 2. Gestión de Tareas

Una vez autenticado, el usuario puede:
- Crear nuevas tareas
- Ver la lista de tareas almacenadas
- Eliminar tareas
- (Opcionalmente se puede agregar la funcionalidad de editar)

Cada acción se sincroniza directamente con MongoDB mediante el backend.

---

### 🖥️ 3. Interfaz de Usuario (Frontend)

La interfaz fue diseñada con un estilo:
- Minimalista
- Moderno
- Tema oscuro
- Tipografías limpias
- Botón de eliminar con un ícono minimalista vertical (⋮)

La aplicación muestra:
- Un formulario para agregar nuevas tareas
- La lista de tareas existentes
- Íconos interactivos para eliminarlas

---

### 🗂️ 4. Arquitectura del Backend

El servidor Express está organizado en:
- Rutas (`/auth`, `/tasks`)
- Controladores que manejan la lógica
- Modelos de Mongoose para usuarios y tareas
- Middlewares, especialmente el de autenticación JWT
- Conexión a MongoDB con mensajes de estado

La API expone endpoints como:

```bash
POST   /auth/register
POST   /auth/login
GET    /tasks
POST   /tasks
DELETE /tasks/:id

🧩 Instalación y Configuración

🔽 1. Clonar el repositorio

git clone https://github.com/tu-usuario/tp-fullstack-frontend.git
git clone https://github.com/tu-usuario/tp-fullstack-backend.git

⚙️ 2. Instalación del Frontend

cd frontend
npm install
npm run dev


⚙️ 3. Instalación del Backend

cd backend
npm install

npm start
