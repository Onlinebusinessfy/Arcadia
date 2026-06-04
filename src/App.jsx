import './App.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Catalogo from './pages/Catalogo'
import Biblioteca from './pages/Biblioteca'
import Acerca from './pages/Acerca'
import './components/Layout.css'

function App() {
  return (
    <div className="app-wrapper">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/biblioteca" element={<Biblioteca />} />
            <Route path="/acerca" element={<Acerca />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App