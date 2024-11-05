import { Response, Request, NextFunction, RequestHandler } from "express";
import pool from "../config/db";

const getItems: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryString: string = 'SELECT * FROM Store';
    const result = await pool.query(queryString);
    res.locals.items = result.rows;
    return next();
  } catch (error) {
    return next(error)
  }
};

const getCurrency: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.body;
    const queryString: string = `SELECT currency FROM Person WHERE username = $1`;
    const result = await pool.query(queryString, [username]);
    if (result.rows.length > 0 && result.rows[0].currency !== undefined) {
      res.locals.currency = result.rows[0].currency;
      return next();
    } else {
      return next({ message: "User not found"});
    }
  } catch (error) {
    return next(error)
  }
};

const updateCurrencyAndInventory: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, currency, itemId } = req.body;
    const queryString = `
      WITH updated_person AS (
        UPDATE Person
        SET currency = $1
        WHERE id = $2
        RETURNING currency
      ),
      updated_inventory AS (
        UPDATE inventory
        SET items = array_append(items, $3)
        WHERE person_id = $2
        RETURNING items
      )
      SELECT updated_person.currency, updated_inventory.items
      FROM updated_person, updated_inventory
    `;
    const result = await pool.query(queryString, [currency, id, itemId]);
    res.locals.updatedUser = result.rows[0];
    return next();
  } catch (error) {
    return next(error);
  }
};

const storeController = {
  getItems,
  getCurrency,
  updateCurrencyAndInventory
}


export default storeController;