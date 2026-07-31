import './Home.css'
import {
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
  FiArrowRight,
  FiPlus,
  FiCheck,
} from 'react-icons/fi'
import { useState, type ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import type Game from '../../types/game'

import { IonContent, IonPage } from '@ionic/react'

const featuredGames: Game[] = [
  {
    id: 1,
    title: 'Elden Ring',
    genre: 'RPG • Acción',
    price: '$59.99',
    img: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/capsule_616x353.jpg',
  },
  {
    id: 2,
    title: 'Cyberpunk 2077',
    genre: 'RPG • Acción',
    price: '$49.99',
    img: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg',
  },
  {
    id: 3,
    title: 'Hollow Knight',
    genre: 'Aventura • Indie',
    price: '$14.99',
    img: 'https://cdn.cloudflare.steamstatic.com/steam/apps/367520/capsule_616x353.jpg',
  },
  {
    id: 4,
    title: 'Red Dead Redemption 2',
    genre: 'Aventura • Mundo abierto',
    price: '$39.99',
    img: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/capsule_616x353.jpg',
  },
]

const newReleases: Game[] = [
  {
    id: 5,
    title: 'Starfield',
    genre: 'RPG • Sci-Fi',
    price: '$69.99',
    img: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/capsule_616x353.jpg',
  },
  {
    id: 6,
    title: 'Star Wars Jedi: Survivor',
    genre: 'Acción • Aventura',
    price: '$59.99',
    img: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1774580/capsule_616x353.jpg',
  },
  {
    id: 7,
    title: 'Lies of P',
    genre: 'RPG • Souls-like',
    price: '$59.99',
    img: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1627720/capsule_616x353.jpg',
  },
  {
    id: 8,
    title: 'The Last of Us Part I',
    genre: 'Acción • Aventura',
    price: '$59.99',
    img: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1888930/capsule_616x353.jpg',
  },
]

const heroSlides: { label: string, title: string, desc: string, img: string }[] = [
  {
    label: 'DESTACADO',
    title: 'Descubre tu próxima aventura',
    desc: 'Explora, compra y descarga los mejores videojuegos. Nuevos lanzamientos, ofertas exclusivas y mucho más.',
    img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1400',
  },
  {
    label: 'OFERTA ESPECIAL',
    title: 'RPGs épicos con hasta 70% OFF',
    desc: 'Semana de descuentos en los mejores juegos de rol. Solo por tiempo limitado.',
    img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1400',
  },
  {
    label: 'NUEVO LANZAMIENTO',
    title: 'La próxima generación ya está aquí',
    desc: 'Experimenta los últimos títulos con gráficos impresionantes y jugabilidad sin igual.',
    img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1400',
  },
]

function GameCard({ game }: { game: Game }): ReactElement {
  const [liked, setLiked] = useState<boolean>(false)
  const { items, addToCart } = useCart()
  const inCart = items.some(item => item.id === game.id)

  return (
    <div className="game-card">
      <div className="card-img-wrap">
        <img
          src={game.img}
          alt={game.title}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      </div>

      <div className="card-info">
        <div>
          <p className="card-title">{game.title}</p>
          <p className="card-genre">{game.genre}</p>
        </div>

        <div className="card-bottom">
          <span className="card-price">{game.price}</span>

          <div className="card-actions">
            <button
              className={`like-btn ${liked ? 'liked' : ''}`}
              onClick={() => setLiked(!liked)}
            >
              <FiHeart size={15} />
            </button>

            <button
              className={`add-cart-btn ${inCart ? 'in-cart' : ''}`}
              onClick={() => addToCart(game)}
            >
              {inCart ? <FiCheck size={15} /> : <FiPlus size={15} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function GameRow({ title, games }: { title: string, games: Game[] }): ReactElement {
  const navigate = useNavigate()

  return (
    <section className="game-row">
      <div className="row-header">
        <h2 className="row-title">{title}</h2>

        <button
          className="ver-todos"
          onClick={() => navigate('/catalogo')}
        >
          Ver todos <FiArrowRight size={14} />
        </button>
      </div>

      <div className="row-scroll-wrap">
        <div className="row-cards">
          {games.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home({ search = '' }: { search: string }): ReactElement {
  const [slide, setSlide] = useState<number>(0)
  const navigate = useNavigate()
  const total = heroSlides.length

  const prev = () => setSlide((slide - 1 + total) % total)
  const next = () => setSlide((slide + 1) % total)

  const filteredFeatured = featuredGames.filter(
    (game) =>
      game.title.toLowerCase().includes(search.toLowerCase()) ||
      game.genre.toLowerCase().includes(search.toLowerCase())
  )

  const filteredNewReleases = newReleases.filter(
    (game) =>
      game.title.toLowerCase().includes(search.toLowerCase()) ||
      game.genre.toLowerCase().includes(search.toLowerCase())
  )

  const noResults =
    filteredFeatured.length === 0 &&
    filteredNewReleases.length === 0

  return (
    <IonPage>
        <IonContent className='ion-padding'>
        <div className="home">
          <div
            className="hero"
            style={{
              backgroundImage: `url(${heroSlides[slide].img})`,
            }}
          >
            <div className="hero-overlay" />

            <div className="hero-content">
              <span className="hero-label">
                {heroSlides[slide].label}
              </span>

              <h1 className="hero-title">
                {heroSlides[slide].title}
              </h1>

              <p className="hero-desc">
                {heroSlides[slide].desc}
              </p>

              <button
                className="hero-btn"
                onClick={() => navigate('/catalogo')}
              >
                Explorar catálogo <FiArrowRight size={16} />
              </button>
            </div>

            <div className="hero-nav">
              <button className="hero-arrow" onClick={prev}>
                <FiChevronLeft />
              </button>

              <div className="hero-dots">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    className={`dot ${
                      i === slide ? 'active' : ''
                    }`}
                    onClick={() => setSlide(i)}
                  />
                ))}
              </div>

              <button className="hero-arrow" onClick={next}>
                <FiChevronRight />
              </button>
            </div>
          </div>

          <div className="rows-container">
            {noResults ? (
              <div className="no-results">
                <h2>No se encontraron juegos</h2>
                <p>Intenta con otra búsqueda.</p>
              </div>
            ) : (
              <>
                <GameRow
                  title="Juegos destacados"
                  games={filteredFeatured}
                />

                <GameRow
                  title="Nuevos lanzamientos"
                  games={filteredNewReleases}
                />
              </>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}