import { useState } from "react";
import authService from "../../services/authService";

function Login() {
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

            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);

            console.log("Usuario:", data.user);

            alert("Inicio de sesión exitoso");

            // Más adelante aquí haremos la redirección
            // navigate("/home");

        } catch (error) {
            setError("Usuario o contraseña incorrectos.");
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Arcadia</h1>

            <form onSubmit={handleLogin}>

                <div>
                    <label>Usuario</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <p>{error}</p>}

                <button type="submit">
                    Iniciar sesión
                </button>

            </form>
        </div>
    );
}

export default Login;