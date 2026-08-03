import { useEffect, useState, type ReactElement } from 'react'
import './Biblioteca.css'
import type { Purchase } from '../../types/purchase'
import { getLibrary } from '../../services/gameService'
import { useAuth } from '../../context/AuthContext'

import { IonContent, IonPage } from '@ionic/react'

export default function Biblioteca({ search = '' }: { search: string }): ReactElement {
  const { user } = useAuth()

  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    async function cargarBiblioteca() {
      const access = localStorage.getItem('access')

      if (!access) {
        setLoading(false)
        return
      }

      try {
        const data = await getLibrary(access)
        setPurchases(data)
      } catch (err) {
        console.error(err)
        setError('No se pudo cargar tu biblioteca.')
      } finally {
        setLoading(false)
      }
    }

    cargarBiblioteca()
  }, [user])

  const juegosFiltrados = purchases.filter(
    purchase =>
      purchase.game.title.toLowerCase().includes(search.toLowerCase()) ||
      purchase.game.genre.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <IonPage>
      <IonContent className='ion-padding'>
        <div className="library-page">
          <div className="library-header">
            <h1>Mi Biblioteca</h1>
            <p>{juegosFiltrados.length} juegos en tu colección</p>
          </div>

          {!user ? (
            <div className="no-results">
              <h2>Inicia sesión para ver tu biblioteca</h2>
              <p>Los juegos que compres aparecerán aquí.</p>
            </div>
          ) : loading ? (
            <div className="no-results">
              <h2>Cargando tu biblioteca...</h2>
            </div>
          ) : error ? (
            <div className="no-results">
              <h2>{error}</h2>
            </div>
          ) : juegosFiltrados.length === 0 ? (
            <div className="no-results">
              <h2>No se encontraron juegos</h2>
              <p>
                {purchases.length === 0
                  ? 'Aún no has comprado ningún juego.'
                  : 'Intenta con otra búsqueda.'}
              </p>
            </div>
          ) : (
            <div className="library-grid">
              {juegosFiltrados.map(purchase => (
                <div key={purchase.id} className="library-card">
                  <div className="library-img">
                    <img src={purchase.game.image} alt={purchase.game.title} />
                  </div>

                  <div className="library-info">
                    <h3>{purchase.game.title}</h3>
                    <p>{purchase.game.genre}</p>

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