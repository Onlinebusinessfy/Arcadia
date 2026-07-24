import React, { useState } from 'react';
import './PaymentModal.css'; // Estilos del modal

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, totalAmount }) => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [cardNumber, setCardNumber] = useState<string>('');
  const [expiry, setExpiry] = useState<string>('');
  const [cvc, setCvc] = useState<string>('');

  // Si el modal no debe mostrarse, no renderizamos nada
  if (!isOpen) return null;

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    // Simulación de pago exitoso
    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      {/* stopPropagation evita que el modal se cierre al hacer clic dentro de él */}
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose}>&times;</button>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="payment-form">
            <h2>Detalles de Pago</h2>
            <p className="total-display">Total a pagar: <span>{totalAmount}</span></p>

            <div className="form-group">
              <label>Número de Tarjeta</label>
              <input
                type="text"
                placeholder="1234 5678 9101 1121"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expiración</label>
                <input
                  type="text"
                  placeholder="MM/AA"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>CVC</label>
                <input
                  type="text"
                  placeholder="123"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="submit-pay-btn">
              Pagar {totalAmount}
            </button>
          </form>
        ) : (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>¡Pago Exitoso!</h2>
            <p>Tu transacción ha sido procesada correctamente.</p>
            <button onClick={handleClose} className="submit-pay-btn">
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
