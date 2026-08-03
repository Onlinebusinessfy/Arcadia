import type Game from "./game";

export interface Purchase {
  id: number;
  game: Game;
  quantity: number;
  purchased_at: string;
}