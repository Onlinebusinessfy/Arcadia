import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

import "../auth/Auth.css";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const data = await authService.login({
                username,
                password,
            });

            await login(data);

            navigate("/");

        } catch (error) {
            setError("Usuario o contraseña incorrectos.");
            console.error(error);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                <h1 className="auth-title">Arcadia</h1>
                <p className="auth-subtitle">
                    Inicia sesión para continuar
                </p>

                <form className="auth-form" onSubmit={handleLogin}>

                    <div className="auth-group">
                        <label>Usuario</label>
                        <input
                            type="text"
                            placeholder="Ingresa tu usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-group">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            placeholder="Ingresa tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    <button className="auth-button" type="submit">
                        Iniciar sesión
                    </button>

                </form>

                <div className="auth-link">
                    ¿No tienes una cuenta?{" "}
                    <Link to="/register">Regístrate</Link>
                </div>

            </div>
        </div>
    );
}

export default Login;