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
    res.cookie('auth_token', token, { httpOnly: true, secure: true });
    res.redirect('http://localhost:3000/home');
  } else {
    res.status(401).json({ message: 'Login failed' })
  }
};

export const failedLogin = (req: Request, res: Response) => {
  res.status(401).json({message: 'Login failed'})
};

export const checkAuthStatus = (req: Request, res: Response): void => {
  const token = req.cookies['auth_token'];
  if (!token) {
    res.json({ authenticated: false });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as User;
    res.json({ authenticated: true, user: decoded });
  } catch (error) {
    res.status(401).json({ authenticated: false, message: error });
    return;
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('auth_token');
  res.redirect('http://localhost:3000');
};