import { User } from './User';

export interface Game {
  id: number;
  name: string;
}

export interface GameSession {
  id: string;
  userId: string;
  gameNightId: number;
  gameId: Game['id'];
  gameSessionStatsId: string;
  isLocked: boolean;
  isPlaying: boolean;
  user: User;
  updatedAt: Date;
}

export interface GameNight {
  id: number;
  archived: boolean;
  createdById: string;
  createdBy: User;
  games: Game[];
  gameSessions: GameSession[];
  createdAt: Date;
  updatedAt: string;
}
