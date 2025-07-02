
import { Router } from "express";

export const tickersRouter = Router();

tickersRouter.get("/", async (req, res) => {    
    res.json({});
});