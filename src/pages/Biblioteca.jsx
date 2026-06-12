import './SimplePages.css'
import './Biblioteca.css'

const misJuegos = [
    {
        id: 1,
        title: 'Elden Ring',
        genre: 'RPG • Acción',
        img: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/capsule_616x353.jpg'
    },
    {
        id: 2,
        title: 'Cyberpunk 2077',
        genre: 'RPG • Acción',
        img: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg'
    },
    {
        id: 3,
        title: 'Red Dead Redemption 2',
        genre: 'Aventura • Mundo abierto',
        img: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/capsule_616x353.jpg'
    },
    {
        id: 4,
        title: 'God of War',
        genre: 'Acción • Aventura',
        img: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/capsule_616x353.jpg'
    }
]

export default function Biblioteca() {
    return (
        <div className="library-page">
            <div className="library-header">
                <h1>Mi Biblioteca</h1>
                <p>{misJuegos.length} juegos en tu colección</p>
            </div>

            <div className="library-grid">
                {misJuegos.map(game => (
                    <div key={game.id} className="library-card">
                        <div className="library-img">
                            <img src={game.img} alt={game.title} />
                        </div>

                        <div className="library-info">
                            <h3>{game.title}</h3>
                            <p>{game.genre}</p>

                            <button className="play-btn">
                                Jugar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}