export interface User {
  id: number;
  discordId: string;
  username: string;
  email?: string;
  currency: number;
}

export interface WebSocketClient {
  send: (data: string) => void;
  readyState: number;
}
