import './Navbar.css'
import { FiShoppingCart, FiBell, FiSearch, FiChevronDown } from 'react-icons/fi'

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                    <polygon points="16,2 30,10 30,22 16,30 2,22 2,10" fill="#6c5ef6" opacity="0.15" stroke="#6c5ef6" strokeWidth="1.5" />
                    <polygon points="16,7 25,12 25,20 16,25 7,20 7,12" fill="#6c5ef6" opacity="0.3" />
                    <polygon points="16,12 21,15 21,19 16,22 11,19 11,15" fill="#6c5ef6" />
                </svg>
                <span className="navbar-brand">ARCADIA</span>
            </div>

            <div className="navbar-search">
                <FiSearch className="search-icon" />
                <input type="text" placeholder="Buscar juegos, géneros, etiquetas..." />
            </div>

            <div className="navbar-actions">
                <button className="icon-btn">
                    <FiShoppingCart size={20} />
                </button>
                <button className="icon-btn">
                    <FiBell size={20} />
                </button>
                <div className="user-pill">
                    <div className="user-avatar">
                        <span>J</span>
                        <div className="online-dot" />
                    </div>
                    <div className="user-info">
                        <span className="user-name">Jugador</span>
                        <span className="user-level">Nivel 12</span>
                    </div>
                    <FiChevronDown size={14} className="chevron" />
                </div>
            </div>
        </nav>
    )
}