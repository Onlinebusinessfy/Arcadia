import { useState, useEffect } from 'react'
import './Catalogo.css'
import { useCart } from '../../context/CartContext'
import { FiCheck } from 'react-icons/fi'
import { useSearchParams } from 'react-router-dom'
import type { ReactElement } from 'react'
import type Game from '../../types/game'

// Usamos la variable de entorno 
const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY || '0042f77aff0c46219df55d55a2be2b7c'

export default function Catalogo({ search = '' }: { search: string }): ReactElement {
  const { items, addToCart } = useCart()
  const [searchParams] = useSearchParams()
  const categoria = searchParams.get('categoria')

  // Estados para la API
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true)
        
        // Pedimos 40 juegos (page_size=40) para poblar bien todas las categorías
        const response = await fetch(
          `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&page_size=200`
        )
        
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
  }, [])

  // Función helper para remover tildes/acentos y minúsculas 
  const normalizeText = (text: string) =>
    text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

  // Filtrado por categoría (URL)
  let filteredGames = games

  if (categoria) {
    const catClean = normalizeText(categoria)
    filteredGames = games.filter(game => {
      const genreClean = normalizeText(game.genre)
      
      // Traducción/Mapeo de las categorías del menú (Español -> Inglés de la API)
      if (catClean === 'accion') return genreClean.includes('action')
      if (catClean === 'aventura') return genreClean.includes('adventure')
      if (catClean === 'estrategia') return genreClean.includes('strategy')
      if (catClean === 'deportes') return genreClean.includes('sports')
      
      return genreClean.includes(catClean)
    })
  }

  // Filtrado por búsqueda de texto (Props)
  filteredGames = filteredGames.filter(game =>
    normalizeText(game.title).includes(normalizeText(search)) ||
    normalizeText(game.genre).includes(normalizeText(search))
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