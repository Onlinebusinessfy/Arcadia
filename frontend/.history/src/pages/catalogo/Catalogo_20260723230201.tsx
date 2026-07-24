import { useState, useEffect } from 'react'
import './Catalogo.css'
import { useCart } from '../../context/CartContext'
import { FiCheck } from 'react-icons/fi'
import { useSearchParams } from 'react-router-dom'
import type { ReactElement } from 'react'
import type Game from '../../types/game'

const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY || '0042f77aff0c46219df55d55a2be2b7c'

export default function Catalogo({ search = '' }: { search: string }): ReactElement {
  const { items, addToCart } = useCart()
  const [searchParams] = useSearchParams()
  const categoria = searchParams.get('categoria')

  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Mapeo de categorías en español a los slugs oficiales de la API de RAWG
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
        
        // El máximo permitido por RAWG es page_size=40
        let url = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&page_size=40`
        
        // Si hay una categoría seleccionada, la pedimos directamente a RAWG
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
  }, [categoria]) // Se vuelve a ejecutar cada vez que cambias de categoría

  // Filtrado adicional solo por el buscador de texto
  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(search.toLowerCase())
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
                    onClick={() => addToCart(game)}
                  >
                    {inCart ? (
                      <>
                        <FiCheck size={14} /> Agregado
                      </>
                    ) : (
                      'Agregar'
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