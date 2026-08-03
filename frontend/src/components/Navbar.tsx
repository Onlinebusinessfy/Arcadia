import "./Navbar.css";
import {
  FiShoppingCart,
  FiSearch,
  FiChevronDown,
  FiX,
  FiTrash2,
  FiMenu,
  FiUser,
  FiLogIn,
  FiUserPlus,
} from "react-icons/fi";

import {
  useRef,
  useEffect,
  useState,
  type ReactElement,
} from "react";

import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar({
  search,
  setSearch,
  sidebarOpen,
  setSidebarOpen,
}: {
  search: string;
  setSearch: (query: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}): ReactElement {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState<boolean>(false);
  
  const cartRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const {
    items,
    removeFromCart,
    totalItems,
    totalPrice,
  } = useCart();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        cartRef.current &&
        !cartRef.current.contains(e.target as Node)
      ) {
        setCartOpen(false);
      }

      if (
        userRef.current &&
        !userRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  return (
    <nav className="navbar">

      {/* Botón menú hamburguesa (solo móvil) */}
      <button
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={sidebarOpen ? "Cerrar menu" : "Abrir menu"}
      >
        {sidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
      </button>

      {/* Logo */}
      <div className="navbar-logo">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <polygon
            points="16,2 30,10 30,22 16,30 2,22 2,10"
            fill="#6c5ef6"
            opacity="0.15"
            stroke="#6c5ef6"
            strokeWidth="1.5"
          />
          <polygon
            points="16,7 25,12 25,20 16,25 7,20 7,12"
            fill="#6c5ef6"
            opacity="0.3"
          />
          <polygon
            points="16,12 21,15 21,19 16,22 11,19 11,15"
            fill="#6c5ef6"
          />
        </svg>

        <span className="navbar-brand">ARCADIA</span>
      </div>

      {/* Buscador */}
      <div className={`navbar-search ${mobileSearchOpen ? "mobile-open" : ""}`}>
        {mobileSearchOpen && (
          <button
            className="search-back-btn"
            onClick={() => setMobileSearchOpen(false)}
            aria-label="Cerrar busqueda"
          >
            <FiX size={22} />
          </button>
        )}

        <FiSearch className="search-icon" />

        <input
          type="text"
          placeholder="Buscar juegos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus={mobileSearchOpen}
        />
      </div>

      {/* Acciones del navbar */}
      <div className="navbar-actions">
        {/* ================================================
            MENÚ DE USUARIO - Desktop y Móvil (Condicional)
           ================================================ */}

        {/* DESKTOP - User Pill (solo cuando está logueado) */}
        {user && (
          <div className="user-menu-wrapper user-menu-desktop" ref={userRef}>
            <div
              className="user-pill"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div className="user-avatar">
                {user.profile_picture ? (
                  <img
                    src={user.profile_picture}
                    alt={user.username}
                  />
                ) : (
                  <span>
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                )}

                <div className="online-dot" />
              </div>

              <div className="user-info">
                <span className="user-name">{user.username}</span>
                <span className="user-level">{user.status}</span>
              </div>

              <FiChevronDown className="chevron" />
            </div>

            {userMenuOpen && (
              <div className="user-dropdown">
                <button
                  onClick={() => {
                    navigate("/perfil");
                    setUserMenuOpen(false);
                  }}
                >
                  Ver perfil
                </button>

                <button onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        )}

        {/* DESKTOP - Botones de autenticación (solo cuando NO está logueado) */}
        {!user && (
          <div className="auth-buttons-desktop">
            <button
              className="nav-auth-btn"
              onClick={() => navigate("/login")}
            >
              Iniciar sesión
            </button>

            <button
              className="nav-auth-btn accent"
              onClick={() => navigate("/register")}
            >
              Registrarse
            </button>
          </div>
        )}

        {/* Botón de búsqueda móvil */}
        <button
          className="icon-btn mobile-search-btn"
          onClick={() => {
            setMobileSearchOpen(true);
            setCartOpen(false);
            setUserMenuOpen(false);
            setMobileMenuOpen(false);
          }}
          aria-label="Abrir busqueda"
        >
          <FiSearch size={20} />
        </button>

        {/* ================================================
            MENÚ MÓVIL - Icono de usuario (SIEMPRE visible en móvil)
           ================================================ */}
        <div className="mobile-menu-wrapper" ref={mobileMenuRef}>
          <button
            className="icon-btn mobile-auth-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menu de usuario"
          >
            {user ? (
              <div className="mobile-avatar-wrapper">
                <div className="mobile-avatar-small">
                  {user.profile_picture ? (
                    <img src={user.profile_picture} alt={user.username} />
                  ) : (
                    <span>{user.username.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                {/* Puntito de estado en el avatar móvil */}
                <span className={`mobile-status-dot ${user.status || 'online'}`}></span>
              </div>
            ) : (
              <FiUser size={20} />
            )}
          </button>

          {mobileMenuOpen && (
            <div className="mobile-dropdown">
              {!user ? (
                <>
                  <button
                    onClick={() => {
                      navigate("/login");
                      setMobileMenuOpen(false);
                    }}
                  >
                    <FiLogIn size={16} />
                    Iniciar sesión
                  </button>

                  <button
                    onClick={() => {
                      navigate("/register");
                      setMobileMenuOpen(false);
                    }}
                  >
                    <FiUserPlus size={16} />
                    Registrarse
                  </button>
                </>
              ) : (
                <>
                  <div className="mobile-dropdown-user">
                    <div className="mobile-dropdown-avatar">
                      {user.profile_picture ? (
                        <img src={user.profile_picture} alt={user.username} />
                      ) : (
                        <span>{user.username.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="mobile-dropdown-user-info">
                      <div className="mobile-dropdown-name">{user.username}</div>
                      <div className={`mobile-dropdown-status status-${user.status || 'online'}`}>
                        <span className="status-dot"></span>
                        {user.status || 'online'}
                      </div>
                    </div>
                  </div>
                  <div className="mobile-dropdown-divider" />
                  <button
                    onClick={() => {
                      navigate("/perfil");
                      setMobileMenuOpen(false);
                    }}
                  >
                    <FiUser size={16} />
                    Ver perfil
                  </button>

                  <button onClick={handleLogout}>
                    <FiLogIn size={16} />
                    Cerrar sesión
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Carrito */}
        <div className="cart-wrap" ref={cartRef}>
          <button
            className="icon-btn"
            onClick={() => setCartOpen(!cartOpen)}
            aria-label="Abrir carrito"
          >
            <FiShoppingCart size={20} />

            {totalItems > 0 && (
              <span className="cart-badge">
                {totalItems}
              </span>
            )}
          </button>

          {cartOpen && (
            <div className="cart-dropdown">
              <div className="cart-header">
                <h3>Tu carrito</h3>

                <button
                  className="close-cart"
                  onClick={() => setCartOpen(false)}
                  aria-label="Cerrar carrito"
                >
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
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="cart-item"
                      >
                        <div className="cart-item-img">
                          <img
                            src={item.image}
                            alt={item.title}
                          />
                        </div>

                        <div className="cart-item-info">
                          <p className="cart-item-title">
                            {item.title}
                          </p>

                          <p className="cart-item-price">
                            {item.price}
                          </p>
                        </div>

                        <button
                          className="cart-item-remove"
                          onClick={() =>
                            removeFromCart(item.id)
                          }
                          aria-label={`Eliminar ${item.title} del carrito`}
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="cart-footer">
                    <div className="cart-total">
                      <span>Total</span>

                      <span className="cart-total-price">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>

                    <button
                      className="checkout-btn"
                      onClick={() => {
                        setCartOpen(false);
                        navigate("/carrito");
                      }}
                    >
                      Ir al carrito
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}