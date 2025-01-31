import { Response, Request, NextFunction, RequestHandler } from "express";
import pool from "../config/db";

const getInventory: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { person_id } = req.params;
    const queryString: string = `
      SELECT i.inventory_id, i.person_id, store.*
      FROM inventory i
      CROSS JOIN LATERAL UNNEST(i.items) AS item_id
      JOIN store ON store.id = item_id
      WHERE i.person_id = $1
    `
    const result = await pool.query(queryString, [person_id]);
    res.locals.items = result.rows;
    return next();
  } catch (error) {
    return next(error)
  }
};

const inventoryController = {
  getInventory
};

export default inventoryController;