import { createLogger, format, transports } from "winston";

const { cli, align, combine, timestamp, printf, json } = format;

const consoleFormat = combine(
  cli(),
  timestamp(),
  align(),
  printf(info => {
    return `${info.timestamp} - ${info.level}:  [${info.label}]: ${info.message} ${JSON.stringify(info.metadata)}`;
  }),
);

const fileFormat = combine(timestamp(), align(), json());

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
  format: fileFormat,
  defaultMeta: { service: "hypercerts-sdk" },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log" }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: consoleFormat,
    }),
  );
}

export { logger };
