import './Sidebar.css'
import { NavLink } from 'react-router-dom'
import {
    FiHome, FiGrid, FiBookOpen, FiInfo,
    FiZap, FiCompass, FiStar, FiTarget,
    FiActivity, FiMusic, FiTruck, FiSliders,
    FiChevronDown
} from 'react-icons/fi'
import { useState } from 'react'

const mainLinks = [
    { to: '/', icon: <FiHome />, label: 'Inicio' },
    { to: '/catalogo', icon: <FiGrid />, label: 'Catálogo' },
    { to: '/biblioteca', icon: <FiBookOpen />, label: 'Biblioteca' },
    { to: '/acerca', icon: <FiInfo />, label: 'Acerca de' },
]

const categories = [
    { icon: <FiZap />, label: 'Acción' },
    { icon: <FiCompass />, label: 'Aventura' },
    { icon: <FiStar />, label: 'RPG' },
    { icon: <FiTarget />, label: 'Estrategia' },
    { icon: <FiActivity />, label: 'Deportes' },
    { icon: <FiMusic />, label: 'Indie' },
    { icon: <FiTruck />, label: 'Carreras' },
    { icon: <FiSliders />, label: 'Simulación' },
]

export default function Sidebar() {
    const [showAll, setShowAll] = useState(false)
    const visibleCats = showAll ? categories : categories.slice(0, 6)

    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                {mainLinks.map(link => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.to === '/'}
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <span className="link-icon">{link.icon}</span>
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-section-label">CATEGORÍAS</div>

            <nav className="sidebar-cats">
                {visibleCats.map(cat => (
                    <button key={cat.label} className="sidebar-link cat-link">
                        <span className="link-icon">{cat.icon}</span>
                        <span>{cat.label}</span>
                    </button>
                ))}
            </nav>

            <button className="see-more-btn" onClick={() => setShowAll(!showAll)}>
                <span>{showAll ? 'Ver menos' : 'Ver más'}</span>
                <FiChevronDown
                    size={14}
                    style={{ transform: showAll ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                />
            </button>
        </aside>
    )
}