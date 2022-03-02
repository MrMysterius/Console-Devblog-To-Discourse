import "dotenv/config";

import { Queue } from "./queue";
import { check } from "./check";
import { default as winston } from "winston";

if (!process.env.LOG_LEVEL) throw new Error(`No Log Level Defined - ${process.env.LOG_LEVEL}`);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL.toLowerCase(),
  format: winston.format.combine(winston.format.json(), winston.format.timestamp()),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.timestamp(), winston.format.align(), winston.format.simple()),
    }),
  ],
});

export const post_queue = new Queue();

logger.info("Starting - Console Devblog Poster");

const interval_id = setInterval(check, 60000 * parseInt(process.env.CHECK_INTERVAL || "") || 60);

check(true);
