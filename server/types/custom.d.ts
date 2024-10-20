// types/custom.d.ts (or types/express.d.ts)
declare global {
  namespace Express {
    interface User {
      id: string;
      username: string;
      email?: string;
    }
  }
}

export {};