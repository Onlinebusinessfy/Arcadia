import './App.css'
import './components/Layout.css'
import { useState, type ReactElement } from 'react'
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

import Perfil from './pages/perfil/Perfil'

export default function App(): ReactElement {
  const [search, setSearch] = useState<string>('')

  return (
    <div className="app-wrapper">
      <Navbar
        search={search}
        setSearch={setSearch}
      />

      <div className="app-body">
        <Sidebar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home search={search} />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/catalogo"
              element={<Catalogo search={search} />}
            />

            <Route path="/" element={<Home search={search} />} />
            <Route path="/biblioteca" element={<Biblioteca search={search} />} />
            <Route path="/acerca" element={<Acerca />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/perfil" element={<Perfil />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
