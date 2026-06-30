import './Sidebar.css'
import { NavLink, Link, useSearchParams } from 'react-router-dom'
import {
  FiHome,
  FiGrid,
  FiBookOpen,
  FiInfo,
  FiZap,
  FiCompass,
  FiStar,
  FiTarget,
  FiActivity,
  FiMusic,
  FiTruck,
  FiSliders,
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

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen
}) {
  const [showAll, setShowAll] = useState(false)
  const visibleCats = showAll
    ? categories
    : categories.slice(0, 6)

  const [searchParams] = useSearchParams()
  const activeCategory =
    searchParams.get('categoria')

  const closeSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false)
    }
  }

  return (
    <>
      <div
        className={`sidebar-overlay ${
          sidebarOpen ? 'show' : ''
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`sidebar ${
          sidebarOpen ? 'open' : ''
        }`}
      >
        <nav className="sidebar-nav">
          {mainLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `sidebar-link ${
                  isActive && !activeCategory
                    ? 'active'
                    : ''
                }`
              }
            >
              <span className="link-icon">
                {link.icon}
              </span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-section-label">
          CATEGORÍAS
        </div>

        <nav className="sidebar-cats">
          {visibleCats.map(cat => (
            <Link
              key={cat.label}
              to={`/catalogo?categoria=${encodeURIComponent(
                cat.label
              )}`}
              onClick={closeSidebar}
              className={`sidebar-link cat-link ${
                activeCategory === cat.label
                  ? 'active'
                  : ''
              }`}
            >
              <span className="link-icon">
                {cat.icon}
              </span>
              <span>{cat.label}</span>
            </Link>
          ))}
        </nav>

        <button
          className="see-more-btn"
          onClick={() =>
            setShowAll(!showAll)
          }
        >
          <span>
            {showAll
              ? 'Ver menos'
              : 'Ver más'}
          </span>

          <FiChevronDown
            size={14}
            style={{
              transform: showAll
                ? 'rotate(180deg)'
                : 'none',
              transition:
                'transform 0.2s'
            }}
          />
        </button>
      </aside>
    </>
  )
}