import { Response, Request, NextFunction, RequestHandler } from "express";
import pool from "../config/db";


  const getItems: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queryString: string = 'SELECT * FROM Store';
      const result = await pool.query(queryString);
      res.locals.items = result.rows;
      next();
    } catch (error) {
      next(error)
    }
  };

  const storeController = {
    getItems,
  }


export default storeController;