import './Carrito.css'
import { useCart } from '../../context/CartContext'
import { FiTrash2, FiShoppingCart, FiArrowRight } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useState, type ReactElement } from 'react'
import { PaymentModal } from '../payment-modal/PaymentModal'

import { IonContent, IonPage } from '@ionic/react'

const API_URL = import.meta.env.VITE_API_URL

export default function Carrito(): ReactElement {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { items, removeFromCart, clearCart, totalPrice } = useCart()
  const navigate = useNavigate()

  const handleCheckout = async () => {
    try {
      const access = localStorage.getItem("access");

      const response = await fetch(`${API_URL}checkout-session/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access}`,
        },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.id,
            title: item.title,
            price: item.price,
            qty: 1,
          })),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'No se pudo iniciar el pago')
      }

      if (data.url) {
        window.location.assign(data.url)
      }
    } catch (error) {
      console.error(error)
      alert(error instanceof Error ? error.message : 'No se pudo iniciar el pago')
    }
  }

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
    <IonPage>
      <IonContent className='ion-padding'>
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
                    <img src={item.image} alt={item.title} />
                  </div>

                  <div className="carrito-item-info">
                    <p className="carrito-item-title">{item.title}</p>
                    <p className="carrito-item-genre">{item.genre}</p>
                  </div>

                  <div className="carrito-item-price">
                    ${parseFloat(item.price.replace('$', '')).toFixed(2)}
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

              <button className="pay-btn" onClick={() => setIsModalOpen(true)}>
                Proceder al pago
              </button>
            </div>
          </div>

          <PaymentModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={clearCart}
            totalAmount={(totalPrice * 1.16).toFixed(2)}
          />
        </div>
      </IonContent>
    </IonPage>
  )
}