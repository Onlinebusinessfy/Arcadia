import { useState } from "react";
import authService from "../../services/authService";

function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirm_password: "",
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const data = await authService.register(formData);

            setMessage(data.message);

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Crear cuenta</h1>

            <form onSubmit={handleRegister}>

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

            <p>{message}</p>

        </div>
    );
}

export default Register;