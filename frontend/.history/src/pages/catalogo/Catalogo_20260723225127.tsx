import { useState, useEffect } from 'react'
import './Catalogo.css'
import { useCart } from '../../context/CartContext'
import { FiCheck } from 'react-icons/fi'
import { useSearchParams } from 'react-router-dom'
import type { ReactElement } from 'react'
import type Game from '../../types/game'

const RAWG_API_KEY = import.meta.env.VITE_REACT_APP_RAWG_API_KEY

export default function Catalogo({ search = '' }: { search: string }): ReactElement {
  const { items, addToCart } = useCart()
  const [searchParams] = useSearchParams()
  const categoria = searchParams.get('categoria')

  // Estados para la API
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
// Agrega esto temporalmente para probar
console.log("Mi API Key cargada es:", import.meta.env.VITE_RAWG_API_KEY)
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true)
        const response = await fetch(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}`)
        
        if (!response.ok) {
          throw new Error('Error al conectar con la API')
        }

        const data = await response.json()

        // Mapeamos los datos de RAWG para adaptarlos al tipo "Game" que usa tu app
        const formattedGames: Game[] = data.results.map((item: any) => ({
          id: item.id,
          title: item.name,
          // Mapeamos los géneros de RAWG a un string bonito 
          genre: item.genres.map((g: any) => g.name).join(' • ') || 'General',
          // Generamos un precio inventado basado en el rating o $59.99 por defecto
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

  // Filtrado por categoría (URL) y búsqueda (Props)
  let filteredGames = categoria
    ? games.filter(game => game.genre.toLowerCase().includes(categoria.toLowerCase()))
    : games

  filteredGames = filteredGames.filter(game =>
    game.title.toLowerCase().includes(search.toLowerCase()) ||
    game.genre.toLowerCase().includes(search.toLowerCase())
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
          <p>Intenta con otra búsqueda.</p>
        </div>
      )}
    </div>
  )
}