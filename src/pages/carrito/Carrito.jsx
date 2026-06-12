import './Carrito.css'
import { useCart } from '../../context/CartContext'
import { FiPlus, FiMinus, FiTrash2, FiShoppingCart, FiArrowRight } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

export default function Carrito() {
  const { items, increaseQty, decreaseQty, removeFromCart, clearCart, totalPrice } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="carrito-empty">
        <FiShoppingCart size={56} />
        <h2>Tu carrito está vacío</h2>
        <p>Agrega juegos desde el catálogo para verlos aquí.</p>
        <button className="go-catalog-btn" onClick={() => navigate('/catalogo')}>
          Ir al catálogo <FiArrowRight size={16} />
        </button>
      </div>
    )
  }

  return (
    <div className="carrito-page">
      <div className="carrito-header">
        <h1>Tu carrito</h1>
        <button className="clear-btn" onClick={clearCart}>Vaciar carrito</button>
      </div>

      <div className="carrito-layout">
        <div className="carrito-list">
          {items.map(item => (
            <div key={item.id} className="carrito-item">
              <div className="carrito-item-img">
                <img src={item.img} alt={item.title} />
              </div>
              <div className="carrito-item-info">
                <p className="carrito-item-title">{item.title}</p>
                <p className="carrito-item-genre">{item.genre}</p>
              </div>
              <div className="carrito-item-qty">
                <button onClick={() => decreaseQty(item.id)}>
                  <FiMinus size={14} />
                </button>
                <span>{item.qty}</span>
                <button onClick={() => increaseQty(item.id)}>
                  <FiPlus size={14} />
                </button>
              </div>
              <div className="carrito-item-price">
                ${(parseFloat(item.price.replace('$', '')) * item.qty).toFixed(2)}
              </div>
              <button className="carrito-item-remove" onClick={() => removeFromCart(item.id)}>
                <FiTrash2 size={17} />
              </button>
            </div>
          ))}
        </div>

        <div className="carrito-summary">
          <h3>Resumen</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Impuestos</span>
            <span>${(totalPrice * 0.16).toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${(totalPrice * 1.16).toFixed(2)}</span>
          </div>
          <button className="pay-btn">Proceder al pago</button>
        </div>
      </div>
    </div>
  )
}