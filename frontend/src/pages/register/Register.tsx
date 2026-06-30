import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import "../auth/Auth.css";
import { useAuth } from "../../context/AuthContext";

function Register() {

    const navigate = useNavigate();
    const { login } = useAuth() as { login: (data: any) => Promise<any> };
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirm_password: "",
    });

    const [message] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            // Registrar usuario
            await authService.register(formData);

            // Iniciar sesión automáticamente
            const loginData = await authService.login({
                username: formData.username,
                password: formData.password,
            });

            // Guardar sesión usando AuthContext
            await login(loginData);

            // Ir al Home
            navigate("/");

        } catch (err: any) {
            console.error(err);

            if (err?.username) {
                setError(err.username[0]);
            } else if (err?.email) {
                setError(err.email[0]);
            } else if (err?.confirm_password) {
                setError(err.confirm_password[0]);
            } else {
                setError("No fue posible crear la cuenta.");
            }
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                <h1 className="auth-title">Crear cuenta</h1>

                <p className="auth-subtitle">
                    Únete a Arcadia
                </p>

                <form className="auth-form" onSubmit={handleRegister}>

                    <div className="auth-group">
                        <label>Usuario</label>
                        <input
                            name="username"
                            placeholder="Usuario"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="auth-group">
                        <label>Correo</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="Correo electrónico"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="auth-group">
                        <label>Contraseña</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="Contraseña"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="auth-group">
                        <label>Confirmar contraseña</label>
                        <input
                            name="confirm_password"
                            type="password"
                            placeholder="Confirmar contraseña"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="auth-success">
                            {message}
                        </div>
                    )}

                    <button className="auth-button" type="submit">
                        Crear cuenta
                    </button>

                </form>

                <div className="auth-link">
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/login">Inicia sesión</Link>
                </div>

            </div>
        </div>
    );
}

export default Register;