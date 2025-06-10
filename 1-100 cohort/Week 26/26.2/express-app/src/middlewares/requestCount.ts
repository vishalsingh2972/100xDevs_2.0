//Counter

import { NextFunction, Request, Response } from "express";
import client from "prom-client";

const requestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

export const requestCount = (req: Request, res: Response, next: NextFunction) => {
  
  res.on('finish', () => {
     //res send to client ---> finsish triggered ---> () callback function triggered
     //Increment request counter
    requestCounter.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status_code: res.statusCode
    });
  });

  next();
};