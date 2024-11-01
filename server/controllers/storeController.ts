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

  const storeController = {
    getItems,
    getCurrency
  }


export default storeController;