import './SimplePages.css'
import { FiInfo } from 'react-icons/fi'

export default function Acerca() {
    return (
        <div className="simple-page">
            <FiInfo size={48} className="page-icon" />
            <h1>Acerca de Arcadia</h1>
            <p>Arcadia es tu plataforma de videojuegos. Explora, compra y juega los mejores títulos.</p>
        </div>
    )
}