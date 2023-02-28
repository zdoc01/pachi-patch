import { GameNight, GameSession } from './GameNight';

export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  // accounts: Account[];
  // sessions: Session[];
  gameSessions: GameSession[];
  // gameStats: GameSessionStats[];
  gameNightsCreated: GameNight[];
}
