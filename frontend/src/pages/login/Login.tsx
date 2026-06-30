import { useState, type ReactElement } from "react";
import { useNavigate, Link } from "react-router-dom";

import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

import "./Login.css";

export default function Login(): ReactElement {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setError("");

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
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">

                <h1 className="login-title">
                    Arcadia
                </h1>

                <form
                    className="login-form"
                    onSubmit={handleLogin}
                >

                    <div className="login-field">
                        <label>Usuario</label>

                        <input
                            type="text"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="login-field">
                        <label>Contraseña</label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />
                    </div>

                    {error && (
                        <p className="login-error">
                            {error}
                        </p>
                    )}

                    <button type="submit">
                        Iniciar sesión
                    </button>

                </form>

                <div className="login-footer">
                    ¿No tienes una cuenta?{" "}
                    <Link to="/register">
                        Regístrate
                    </Link>
                </div>

            </div>
        </div>
    );
}