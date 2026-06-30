import './Perfil.css'

const recentGames = [
    { id: 1, title: 'Elden Ring', genre: 'RPG • Acción', img: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/capsule_616x353.jpg' },
    { id: 2, title: 'Cyberpunk 2077', genre: 'RPG • Acción', img: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg' },
    { id: 3, title: 'Hollow Knight', genre: 'Aventura • Indie', img: 'https://cdn.cloudflare.steamstatic.com/steam/apps/367520/capsule_616x353.jpg' },
]

export default function Perfil() {
    const username = "Jugador"
    const email = "jugador@arcadia.com"

    return (
        <div className="perfil-page">
            <div className="perfil-header">
                <div className="perfil-avatar">
                    <span>{username.charAt(0)}</span>
                </div>

                <div className="perfil-info">
                    <h1>{username}</h1>
                    <p>{email}</p>
                </div>
            </div>

            <div className="perfil-section">
                <h2>Juegos recientes</h2>

                <div className="perfil-grid">
                    {recentGames.map(game => (
                        <div key={game.id} className="perfil-card">
                            <div className="perfil-card-img">
                                <img src={game.img} alt={game.title} />
                            </div>
                            <div className="perfil-card-info">
                                <p className="perfil-card-title">{game.title}</p>
                                <p className="perfil-card-genre">{game.genre}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}