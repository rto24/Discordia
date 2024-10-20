import { Response, Request } from 'express';

export const successfulLogin = (req: Request, res: Response) => {
  res.redirect('http://localhost:3000/home');
};

export const failedLogin = (req: Request, res: Response) => {
  res.status(401).json({message: 'Login failed'})
};

export const checkAuthStatus = (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
};

export const logout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.redirect('http://localhost:3000');
  });
};