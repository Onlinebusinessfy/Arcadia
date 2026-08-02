import type Game from "../types/game";

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