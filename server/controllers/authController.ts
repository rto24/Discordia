import { Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../types/types';

export const successfulLogin = (req: Request, res: Response) => {
  if (req.user) {
    const user = req.user as User;
    const tokenPayload = { id: user.id, discord_id: user.discordId, username: user.username }
    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );
    res.cookie('auth_token', token, { httpOnly: true, secure: false });
    res.redirect('http://localhost:3000/home');
  } else {
    res.status(401).json({ message: 'Login failed' })
  }
};

export const failedLogin = (req: Request, res: Response) => {
  res.status(401).json({message: 'Login failed'})
};

export const checkAuthStatus = (req: Request, res: Response): void => {
  let token = req.cookies["auth_token"];

  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1]; 
    }
  }

  if (!token) {
    console.log("No token provided");
    res.status(401).json({ authenticated: false, user: null, message: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as User;
    res.json({ authenticated: true, user: decoded, token });
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ authenticated: false, user: null, message: error });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('auth_token');
  res.redirect('http://localhost:3000');
};