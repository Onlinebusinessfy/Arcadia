import { useState, useEffect } from 'react'
import './Catalogo.css'
import { useCart } from '../../context/CartContext'
import { FiCheck, FiShoppingCart } from 'react-icons/fi'
import { useLocation, useSearchParams } from 'react-router-dom'
import type { ReactElement } from 'react'
import type Game from '../../types/game'

const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY;

export default function Catalogo({ search = '' }: { search: string }): ReactElement {
  const { items, addToCart } = useCart()
  const [searchParams] = useSearchParams()
  const categoria = searchParams.get('categoria')

  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const location = useLocation()
  const searchTerm = location.state?.search || search;

  const mapCategoryToSlug = (cat: string | null) => {
    if (!cat) return ''
    const clean = cat.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    
    switch (clean) {
      case 'accion': return 'action'
      case 'aventura': return 'adventure'
      case 'estrategia': return 'strategy'
      case 'deportes': return 'sports'
      case 'carreras': return 'racing'
      case 'simulacion': return 'simulation'
      case 'indie': return 'indie'
      case 'rpg':
      case 'rol': return 'role-playing-games-rpg'
      default: return clean
    }
  }

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true)
        
        let url = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&page_size=40`
        
        const genreSlug = mapCategoryToSlug(categoria)
        if (genreSlug) {
          url += `&genres=${genreSlug}`
        }

        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error('Error al conectar con la API de RAWG')
        }

        const data = await response.json()

        const formattedGames: Game[] = data.results.map((item: any) => ({
          id: item.id,
          title: item.name,
          genre: item.genres.map((g: any) => g.name).join(' • ') || 'General',
          price: `$${(item.rating * 12 || 59.99).toFixed(2)}`,
          img: item.background_image || 'https://via.placeholder.com/616x353?text=No+Image',
        }))

        setGames(formattedGames)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [categoria])

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="catalogo">
        <h2>Cargando catálogo desde RAWG...</h2>
      </div>
    )
  }

  if (error) {
    return (
      <div className="catalogo">
        <h2>Ocurrió un error: {error}</h2>
      </div>
    )
  }

  return (
    <div className="catalogo">
      <div className="catalogo-header">
        <h1>Catálogo</h1>
        <p>{filteredGames.length} juegos disponibles</p>
      </div>

      <div className="catalogo-grid">
        {filteredGames.map(game => {
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
                    onClick={() => !inCart && addToCart(game)}
                    disabled={inCart}
                  >
                    {inCart ? (
                      <>
                        <FiCheck size={14} /> Agregado
                      </>
                    ) : (
                      <>
                        <FiShoppingCart size={14} /> Agregar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredGames.length === 0 && (
        <div className="no-results">
          <h3>No se encontraron juegos</h3>
          <p>Intenta con otra búsqueda o categoría.</p>
        </div>
      )}
    </div>
  )
}