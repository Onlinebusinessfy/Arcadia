import { useState, useEffect } from 'react'
import './Catalogo.css'
import { useCart } from '../../context/CartContext'
import { FiCheck, FiShoppingCart } from 'react-icons/fi'
import { useLocation, useSearchParams } from 'react-router-dom'
import type { ReactElement } from 'react'
import type Game from '../../types/game'
import { getGames } from "../../services/gameService";

import { IonContent, IonPage } from '@ionic/react'

export default function Catalogo({ search = '' }: { search: string }): ReactElement {
  const { items, addToCart } = useCart()
  const [searchParams] = useSearchParams()
  const categoria = searchParams.get('categoria')

  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const location = useLocation()
  const searchTerm = location.state?.search || search;

  const normalizeCategory = (cat: string | null) => {
    if (!cat) return ''

    return cat
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  }

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true)

        const data = await getGames(
          categoria || undefined
        )

        const formattedGames: Game[] = data.map((item: Game) => ({
          id: item.id,
          title: item.title,
          genre: item.genre || "General",
          price: `$${Number(item.price).toFixed(2)}`,
          image: item.image || "https://via.placeholder.com/616x353?text=No+Image",
          description: item.description,
          developer: item.developer,
          discount: item.discount,
          rating: item.rating,
          platforms: item.platforms,
          release_date: item.release_date,
          created_at: item.created_at,
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
    <IonPage>
        <IonContent className='ion-padding'>
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
                    <img src={game.image} alt={game.title} />
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
      </IonContent>
    </IonPage>
  )
}