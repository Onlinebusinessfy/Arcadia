import React, { useState } from 'react';
import './PaymentModal.css';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // <-- Nueva prop opcional
  totalAmount: string;
}

const esAmex = (numeroTarjeta: string): boolean => {
  const soloNumeros = numeroTarjeta.replace(/\s/g, '');
  return /^3[47]/.test(soloNumeros);
};

const formatearNumeroTarjeta = (valor: string): string => {
  const soloNumeros = valor.replace(/\D/g, '').slice(0, 16);
  return soloNumeros.replace(/(.{4})/g, '$1 ').trim();
};

const formatearExpiracion = (valor: string): string => {
  const soloNumeros = valor.replace(/\D/g, '').slice(0, 4);
  if (soloNumeros.length <= 2) return soloNumeros;
  return `${soloNumeros.slice(0, 2)}/${soloNumeros.slice(2)}`;
};

export const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  totalAmount 
}) => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [cardNumber, setCardNumber] = useState<string>('');
  const [expiry, setExpiry] = useState<string>('');
  const [cvc, setCvc] = useState<string>('');

  const [errorTarjeta, setErrorTarjeta] = useState<string>('');
  const [errorExpiracion, setErrorExpiracion] = useState<string>('');
  const [errorCvc, setErrorCvc] = useState<string>('');

  if (!isOpen) return null;

  const cvcMaximo = esAmex(cardNumber) ? 4 : 3;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formateado = formatearNumeroTarjeta(e.target.value);
    setCardNumber(formateado);

    const soloNumeros = formateado.replace(/\s/g, '');
    if (soloNumeros.length > 0 && soloNumeros.length < 13) {
      setErrorTarjeta('El número de tarjeta es demasiado corto');
    } else {
      setErrorTarjeta('');
    }

    const nuevoMaximo = /^3[47]/.test(soloNumeros) ? 4 : 3;
    if (cvc.length > 0 && cvc.length !== nuevoMaximo) {
      setErrorCvc(`El CVC debe tener ${nuevoMaximo} dígitos`);
    } else {
      setErrorCvc('');
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formateado = formatearExpiracion(e.target.value);
    setExpiry(formateado);

    if (formateado.length < 5) {
      setErrorExpiracion('');
      return;
    }

    const [mesStr, anioStr] = formateado.split('/');
    const mes = parseInt(mesStr, 10);
    const anio = parseInt(anioStr, 10);

    if (mes < 1 || mes > 12) {
      setErrorExpiracion('Mes inválido');
      return;
    }

    const ahora = new Date();
    const anioActual = ahora.getFullYear() % 100;
    const mesActual = ahora.getMonth() + 1;

    if (anio < anioActual || (anio === anioActual && mes < mesActual)) {
      setErrorExpiracion('La tarjeta ya está vencida');
    } else {
      setErrorExpiracion('');
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const soloNumeros = e.target.value.replace(/\D/g, '').slice(0, cvcMaximo);
    setCvc(soloNumeros);

    if (soloNumeros.length > 0 && soloNumeros.length !== cvcMaximo) {
      setErrorCvc(`El CVC debe tener ${cvcMaximo} dígitos`);
    } else {
      setErrorCvc('');
    }
  };

  const formularioValido =
    cardNumber.replace(/\s/g, '').length >= 13 &&
    expiry.length === 5 &&
    cvc.length === cvcMaximo &&
    !errorTarjeta &&
    !errorExpiracion &&
    !errorCvc;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formularioValido) return;
    setIsSuccess(true);
  };

  const handleClose = () => {
    // Si la transacción fue exitosa, vaciamos el carrito al cerrar
    if (isSuccess && onSuccess) {
      onSuccess();
    }

    setIsSuccess(false);
    setCardNumber('');
    setExpiry('');
    setCvc('');
    setErrorTarjeta('');
    setErrorExpiracion('');
    setErrorCvc('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose}>&times;</button>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="payment-form">
            <h2>Detalles de Pago</h2>
            <p className="total-display">Total a pagar: <span>${totalAmount}</span></p>

            <div className="form-group">
              <label>Número de Tarjeta</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="1234 5678 9101 1121"
                value={cardNumber}
                onChange={handleCardNumberChange}
                className={errorTarjeta ? 'input-error' : ''}
                required
              />
              {errorTarjeta && <span className="error-text">{errorTarjeta}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expiración</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="MM/AA"
                  value={expiry}
                  onChange={handleExpiryChange}
                  className={errorExpiracion ? 'input-error' : ''}
                  required
                />
                {errorExpiracion && <span className="error-text">{errorExpiracion}</span>}
              </div>

              <div className="form-group">
                <label>CVC</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder={cvcMaximo === 4 ? '1234' : '123'}
                  value={cvc}
                  onChange={handleCvcChange}
                  className={errorCvc ? 'input-error' : ''}
                  required
                />
                {errorCvc && <span className="error-text">{errorCvc}</span>}
              </div>
            </div>

            <button type="submit" className="submit-pay-btn" disabled={!formularioValido}>
              Pagar ${totalAmount}
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