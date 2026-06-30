import './App.css'
import './components/Layout.css'
import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

import Home from './pages/home/Home'
import Catalogo from './pages/catalogo/Catalogo'
import Biblioteca from './pages/biblioteca/Biblioteca'
import Acerca from './pages/acerca-de/Acerca'
import Carrito from './pages/carrito/Carrito'

import Login from './pages/login/Login'
import Register from './pages/register/Register'

function App() {
  const [search, setSearch] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-wrapper">
      <Navbar
        search={search}
        setSearch={setSearch}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="app-body">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={<Home search={search} />}
            />

            <Route
              path="/catalogo"
              element={<Catalogo search={search} />}
            />

            <Route
              path="/biblioteca"
              element={<Biblioteca search={search} />}
            />

            <Route
              path="/acerca"
              element={<Acerca />}
            />

            <Route
              path="/carrito"
              element={<Carrito />}
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App