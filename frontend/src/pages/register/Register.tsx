import { useState, type ReactElement } from "react";
import authService from "../../services/authService";
import './Register.css'

export default function Register(): ReactElement {
    const [formData, setFormData] = useState<{ username: string, email: string, password: string, confirm_password: string }>({
        username: "",
        email: "",
        password: "",
        confirm_password: "",
    });

    const [message, setMessage] = useState("");

    const handleChange = (e: { target: { name: string; value: string; }; }) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        try {
            const data = await authService.register(formData);

            setMessage(data.message);

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="register-page">
            <div className="register-card">
                <h1>Crear cuenta</h1>

                <form className="register-form" onSubmit={handleRegister}>

                    <input
                        name="username"
                        placeholder="Usuario"
                        onChange={handleChange}
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder="Correo"
                        onChange={handleChange}
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Contraseña"
                        onChange={handleChange}
                    />

                    <input
                        name="confirm_password"
                        type="password"
                        placeholder="Confirmar contraseña"
                        onChange={handleChange}
                    />

                    <button type="submit">
                        Registrarse
                    </button>

                </form>

                <p className="register-message">{message}</p>
            </div>
        </div>
    );
}
