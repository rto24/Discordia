import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../types/types';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  let token = req.cookies['auth_token'];

  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload & User;
    req.user = decoded as User;
    next();
  } catch (error) {
    res.status(403).json({ message: `Invalid or expired token: ${error}` });
    return; 
  }
};