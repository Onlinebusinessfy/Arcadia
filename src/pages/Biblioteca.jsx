import './SimplePages.css'
import { FiBookOpen } from 'react-icons/fi'

export default function Biblioteca() {
    return (
        <div className="simple-page">
            <FiBookOpen size={48} className="page-icon" />
            <h1>Biblioteca</h1>
            <p>Aquí aparecerán los juegos que hayas adquirido.</p>
        </div>
    )
}