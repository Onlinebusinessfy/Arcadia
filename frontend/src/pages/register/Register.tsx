import { useState, type ReactElement } from "react";
import { Link, useNavigate } from "react-router-dom";

import authService, {
    type RegisterData,
} from "../../services/authService";

import { useAuth } from "../../context/AuthContext";

import { IonContent, IonPage } from '@ionic/react';

import "./Register.css";

interface RegisterError {
    username?: string[];
    email?: string[];
    password?: string[];
    confirm_password?: string[];
    detail?: string;
}

export default function Register(): ReactElement {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState<RegisterData>({
        username: "",
        email: "",
        password: "",
        confirm_password: "",
    });

    const [error, setError] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            await authService.register(formData);

            const loginData = await authService.login({
                username: formData.username,
                password: formData.password,
            });

            await login(loginData);
            setMessage("Cuenta creada correctamente.");
            navigate("/");
        } catch (err) {
            const error = err as RegisterError;
            console.error(error);

            if (error.username) {
                setError(error.username[0]);
            } else if (error.email) {
                setError(error.email[0]);
            } else if (error.password) {
                setError(error.password[0]);
            } else if (error.confirm_password) {
                setError(error.confirm_password[0]);
            } else if (error.detail) {
                setError(error.detail);
            } else {
                setError("No fue posible crear la cuenta.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <IonPage>
            <IonContent
                className="ion-padding"
                fullscreen={true}
                // Se quitó scrollY={false}: con 4 campos + mensajes de error,
                // en pantallas chicas el formulario no cabía y quedaba
                // cortado sin poder hacer scroll para verlo completo.
            >
                <div className="register-page">
                    <div className="register-card">
                        <div className="register-header">
                            <h1 className="register-title">ARCADIA</h1>
                            <p className="register-subtitle">Crea tu cuenta</p>
                        </div>

                        <form className="register-form" onSubmit={handleRegister}>
                            <div className="register-field">
                                <label>Usuario</label>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Elige un nombre de usuario"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="register-field">
                                <label>Correo electrónico</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Ingresa tu correo electrónico"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="register-field">
                                <label>Contraseña</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Crea una contraseña segura"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="register-field">
                                <label>Confirmar contraseña</label>
                                <input
                                    type="password"
                                    name="confirm_password"
                                    placeholder="Repite tu contraseña"
                                    value={formData.confirm_password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {error && <p className="register-error">{error}</p>}
                            {message && <p className="register-message">{message}</p>}

                            <button type="submit" disabled={loading}>
                                {loading ? "Registrando..." : "Registrarse"}
                            </button>
                        </form>

                        <div className="register-footer">
                            ¿Ya tienes una cuenta?{" "}
                            <Link to="/login">Inicia sesión</Link>
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
}