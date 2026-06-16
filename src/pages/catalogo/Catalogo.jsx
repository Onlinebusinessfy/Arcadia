import './Catalogo.css'
import { useCart } from '../../context/CartContext'
import { FiCheck } from 'react-icons/fi'
import { useSearchParams } from 'react-router-dom'

const allGames = [
  { id: 1, title: 'Elden Ring', genre: 'RPG • Acción', price: '$59.99', img: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/capsule_616x353.jpg' },
  { id: 2, title: 'Cyberpunk 2077', genre: 'RPG • Acción', price: '$49.99', img: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg' },
  { id: 3, title: 'Hollow Knight', genre: 'Aventura • Indie', price: '$14.99', img: 'https://cdn.cloudflare.steamstatic.com/steam/apps/367520/capsule_616x353.jpg' },
  { id: 4, title: 'Red Dead Redemption 2', genre: 'Aventura • Mundo abierto', price: '$39.99', img: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/capsule_616x353.jpg' },
  { id: 5, title: 'Starfield', genre: 'RPG • Sci-Fi', price: '$69.99', img: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/capsule_616x353.jpg' },
  { id: 6, title: 'The Last of Us Part I', genre: 'Acción • Aventura', price: '$59.99', img: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1888930/capsule_616x353.jpg' },
  { id: 7, title: 'Lies of P', genre: 'RPG • Souls-like', price: '$59.99', img: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1627720/capsule_616x353.jpg' },
  { id: 8, title: 'God of War', genre: 'Acción • Aventura', price: '$49.99', img: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/capsule_616x353.jpg' },
]

export default function Catalogo() {
  const { items, addToCart } = useCart()


  const [searchParams] = useSearchParams()
  const categoria = searchParams.get('categoria')

  const games = categoria
    ? allGames.filter(game => game.genre.includes(categoria))
    : allGames

  return (
    <div className="catalogo">
      <div className="catalogo-header">
        <h1>Catálogo</h1>
        <p>{games.length} juegos disponibles</p>
      </div>
      <div className="catalogo-grid">
        {games.map(game => {
          const inCart = items.some(item => item.id === game.id)
          return (
            <div key={game.id} className="cat-card">
              <div className="cat-img">
                <img src={game.img} alt={game.title} />
              </div>
              <div className="cat-info">
                <p className="cat-title">{game.title}</p>
                <p className="cat-genre">{game.genre}</p>
                <div className="cat-footer">
                  <span className="cat-price">{game.price}</span>
                  <button
                    className={`add-btn ${inCart ? 'in-cart' : ''}`}
                    onClick={() => addToCart(game)}
                  >
                    {inCart ? <><FiCheck size={14} /> Agregado</> : 'Agregar'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}