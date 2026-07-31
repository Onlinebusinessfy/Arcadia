import type { ReactElement } from 'react'
import './Biblioteca.css'
import type Game from '../../types/game'

import { IonContent, IonPage } from '@ionic/react'

const misJuegos: Game[] = [
  {
    id: 1,
    title: 'Elden Ring',
    genre: 'RPG • Acción',
    price: "",
    img: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/capsule_616x353.jpg'
  },
  {
    id: 2,
    title: 'Cyberpunk 2077',
    genre: 'RPG • Acción',
    price: "",
    img: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg'
  },
  {
    id: 3,
    title: 'Red Dead Redemption 2',
    genre: 'Aventura • Mundo abierto',
    price: "",
    img: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/capsule_616x353.jpg'
  },
  {
    id: 4,
    title: 'God of War',
    genre: 'Acción • Aventura',
    price: "",
    img: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/capsule_616x353.jpg'
  }
]

export default function Biblioteca({ search = '' }: { search: string }): ReactElement {
  const juegosFiltrados = misJuegos.filter(
    game =>
      game.title.toLowerCase().includes(search.toLowerCase()) ||
      game.genre.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <IonPage>
      <IonContent className='ion-padding'>
        <div className="library-page">
          <div className="library-header">
            <h1>Mi Biblioteca</h1>
            <p>{juegosFiltrados.length} juegos en tu colección</p>
          </div>

          {juegosFiltrados.length === 0 ? (
            <div className="no-results">
              <h2>No se encontraron juegos</h2>
              <p>Intenta con otra búsqueda.</p>
            </div>
          ) : (
            <div className="library-grid">
              {juegosFiltrados.map(game => (
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
          )}
        </div>
      </IonContent>
    </IonPage>
  )
}