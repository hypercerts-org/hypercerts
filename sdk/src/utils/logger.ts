import { createLogger, format, transports } from "winston";

const { cli, align, combine, timestamp, printf } = format;

const consoleFormat = combine(
  cli(),
  timestamp(),
  align(),
  printf(info => {
    return `${info.timestamp} - ${info.level}:  [${info.label}]: ${info.message} ${
      info.metadata ? JSON.stringify(info.metadata) : ""
    }`;
  }),
);

// Log levels
// error: 0
// warn: 1
// info: 2
// http: 3
// verbose: 4
// debug: 5
// silly: 6

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: consoleFormat,
  defaultMeta: { service: "hypercerts-sdk" },
  transports: [
    new transports.Console({
      format: consoleFormat,
    }),
  ],
});

export { logger };
