import './App.css'
import './components/Layout.css'

import { useState, useEffect, type ReactElement } from 'react'
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

// ✅ MANTENGO: La importación de Ionic (cambios de tu compañero)
import { IonApp, setupIonicReact } from '@ionic/react';
import '@ionic/react/css/core.css';

// ✅ MANTENGO: La configuración de Ionic (cambios de tu compañero)
setupIonicReact();

export default function App(): ReactElement {
  // ✅ MANTENGO: Tus estados (tus cambios)
  const [search, setSearch] = useState<string>('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // ✅ MANTENGO: Tu useEffect (tus cambios)
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  return (
    // ✅ MANTENGO: IonApp de tu compañero
    <IonApp>
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

          {sidebarOpen && (
            <div
              className="sidebar-overlay"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home search={search} />} />
              <Route path="/catalogo" element={<Catalogo search={search} />} />
              <Route path="/biblioteca" element={<Biblioteca search={search} />} />
              <Route path="/acerca" element={<Acerca />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
        </div>
      </div>
    </IonApp>
  )
}