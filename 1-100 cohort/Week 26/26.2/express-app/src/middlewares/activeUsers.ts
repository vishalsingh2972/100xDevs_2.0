//Gauge

import { NextFunction, Request, Response } from "express";
import client from "prom-client";

export const activeUserGauge = new client.Gauge({
  name: 'active_requests',
  help: 'Total number of active users' //req recieved in index.ts but no res send back to client yet are active users
});

export const userCount = (req: Request, res: Response, next: NextFunction) => {

  activeUserGauge.inc(); //Increasing the user on request received

  res.on('finish', () => {
    activeUserGauge.dec(); //Decreasing the user on requests finish
  });

  next();
};