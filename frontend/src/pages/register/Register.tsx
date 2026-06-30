import { useState, type ReactElement } from "react";
import { Link, useNavigate } from "react-router-dom";

import authService, {
    type RegisterData,
} from "../../services/authService";

import { useAuth } from "../../context/AuthContext";

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

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRegister = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setError("");
        setMessage("");

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
        }
    };

    return (
        <div className="register-page">
            <div className="register-card">

                <h1>Crear cuenta</h1>

                <form
                    className="register-form"
                    onSubmit={handleRegister}
                >

                    <input
                        type="text"
                        name="username"
                        placeholder="Usuario"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Correo"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="confirm_password"
                        placeholder="Confirmar contraseña"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        required
                    />

                    {error && (
                        <p className="register-error">
                            {error}
                        </p>
                    )}

                    {message && (
                        <p className="register-message">
                            {message}
                        </p>
                    )}

                    <button type="submit">
                        Registrarse
                    </button>

                </form>

                <div className="register-footer">
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/login">
                        Inicia sesión
                    </Link>
                </div>

            </div>
        </div>
    );
}