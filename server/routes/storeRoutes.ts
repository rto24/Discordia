import { Router, Response, Request } from 'express';
import storeController from '../controllers/storeController';

const router = Router();

router.get('/items', storeController.getItems, (req: Request, res: Response): void => {
  res.status(200).json(res.locals.items)
});

router.post('/currency', storeController.getCurrency, (req: Request, res: Response): void => {
  res.status(200).json(res.locals.currency)
});

export default router;