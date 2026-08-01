import { useState, type ReactElement } from "react";
import { useNavigate, Link } from "react-router-dom";

import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

import { IonContent, IonPage } from '@ionic/react';

import "./Login.css";

export default function Login(): ReactElement {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await authService.login({
                username,
                password,
            });

            await login(data);
            navigate("/");
        } catch (error) {
            console.error(error);
            setError("Usuario o contraseña incorrectos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <IonPage>
            <IonContent 
                className="ion-padding" 
                scrollY={false}  // ✅ IMPORTANTE: Desactiva el scroll
                fullscreen={true} // ✅ IMPORTANTE: Ocupa toda la pantalla
            >
                <div className="login-page">
                    <div className="login-card">
                        <div className="login-header">
                            <h1 className="login-title">ARCADIA</h1>
                            <p className="login-subtitle">Bienvenido de vuelta</p>
                        </div>

                        <form className="login-form" onSubmit={handleLogin}>
                            <div className="login-field">
                                <label>Usuario</label>
                                <input
                                    type="text"
                                    placeholder="Ingresa tu usuario"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="login-field">
                                <label>Contraseña</label>
                                <input
                                    type="password"
                                    placeholder="Ingresa tu contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {error && <p className="login-error">{error}</p>}

                            <button type="submit" disabled={loading}>
                                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                            </button>
                        </form>

                        <div className="login-footer">
                            ¿No tienes una cuenta?{" "}
                            <Link to="/register">Regístrate</Link>
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
}