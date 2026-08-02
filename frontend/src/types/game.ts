export default interface Game {
  id: number;
  title: string;
  description?: string;
  genre: string;
  developer?: string;
  price: string;
  discount?: number;
  image: string;
  rating?: number;
  platforms?: string[];
  release_date?: string | null;
  created_at?: string;
}