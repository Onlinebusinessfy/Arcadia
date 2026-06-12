import './Navbar.css'
import { FiShoppingCart, FiBell, FiSearch, FiChevronDown, FiX, FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi'
import { useState, useRef, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const [cartOpen, setCartOpen] = useState(false)
  const cartRef = useRef(null)
  const navigate = useNavigate()
  const {
    items,
    removeFromCart,
    increaseQty,
    decreaseQty,
    totalItems,
    totalPrice,
  } = useCart()

  useEffect(() => {
    function handleClickOutside(e) {
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setCartOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <polygon points="16,2 30,10 30,22 16,30 2,22 2,10" fill="#6c5ef6" opacity="0.15" stroke="#6c5ef6" strokeWidth="1.5"/>
          <polygon points="16,7 25,12 25,20 16,25 7,20 7,12" fill="#6c5ef6" opacity="0.3"/>
          <polygon points="16,12 21,15 21,19 16,22 11,19 11,15" fill="#6c5ef6"/>
        </svg>
        <span className="navbar-brand">ARCADIA</span>
      </div>

      <div className="navbar-search">
        <FiSearch className="search-icon" />
        <input type="text" placeholder="Buscar juegos, géneros, etiquetas..." />
      </div>

      <div className="navbar-actions">
        <div className="cart-wrap" ref={cartRef}>
          <button className="icon-btn" onClick={() => setCartOpen(!cartOpen)}>
            <FiShoppingCart size={20} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>

          {cartOpen && (
            <div className="cart-dropdown">
              <div className="cart-header">
                <h3>Tu carrito</h3>
                <button className="close-cart" onClick={() => setCartOpen(false)}>
                  <FiX size={16} />
                </button>
              </div>

              {items.length === 0 ? (
                <div className="cart-empty">
                  <FiShoppingCart size={32} />
                  <p>Tu carrito está vacío</p>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {items.map(item => (
                      <div key={item.id} className="cart-item">
                        <div className="cart-item-img">
                          <img src={item.img} alt={item.title} />
                        </div>
                        <div className="cart-item-info">
                          <p className="cart-item-title">{item.title}</p>
                          <p className="cart-item-price">{item.price}</p>
                          <div className="cart-item-qty">
                            <button onClick={() => decreaseQty(item.id)}>
                              <FiMinus size={12} />
                            </button>
                            <span>{item.qty}</span>
                            <button onClick={() => increaseQty(item.id)}>
                              <FiPlus size={12} />
                            </button>
                          </div>
                        </div>
                        <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="cart-footer">
                    <div className="cart-total">
                      <span>Total</span>
                      <span className="cart-total-price">${totalPrice.toFixed(2)}</span>
                    </div>
                    <button className="checkout-btn" onClick={() => { setCartOpen(false); navigate('/carrito') }}>
                      Ir al carrito
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <button className="icon-btn">
          <FiBell size={20} />
        </button>
        <div className="user-pill">
          <div className="user-avatar">
            <span>J</span>
            <div className="online-dot" />
          </div>
          <div className="user-info">
            <span className="user-name">Jugador</span>
            <span className="user-level">Nivel 12</span>
          </div>
          <FiChevronDown size={14} className="chevron" />
        </div>
      </div>
    </nav>
  )
}