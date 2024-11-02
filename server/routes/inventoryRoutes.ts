import { Router, Request, Response } from "express";
import inventoryController from "../controllers/inventoryController";

const router = Router();

router.get('/:person_id', inventoryController.getInventory, (req: Request, res: Response): void => {
  res.status(200).json(res.locals.items);
});

export default router;