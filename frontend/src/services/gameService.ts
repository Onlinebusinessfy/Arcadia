import type Game from "../types/game";
import type { Purchase } from "../types/purchase";

const API_URL = "http://127.0.0.1:8000/api/games/";

export async function getGames(genre?: string): Promise<Game[]> {

    let url = API_URL;

    if (genre) {
        url += `?genre=${genre}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Error obteniendo juegos");
    }

    return await response.json();
}

// Devuelve los juegos que el usuario ya compró (su Biblioteca)
export async function getLibrary(token: string): Promise<Purchase[]> {
    const response = await fetch(`${API_URL}purchases/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Error obteniendo la biblioteca");
    }

    return await response.json();
}

// Avisa al backend que se compraron estos juegos (se llama al completar el pago)
export async function registerPurchase(
    token: string,
    items: { id: number; qty: number }[]
): Promise<void> {
    const response = await fetch(`${API_URL}purchases/register/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items }),
    });

    if (!response.ok) {
        throw new Error("Error registrando la compra");
    }
}