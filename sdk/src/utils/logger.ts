export enum Log {
  Error = 0,
  Warn,
  Info,
  Debug,
}

const getLogLevel = () => {
  const level = process.env.LOG_LEVEL;
  switch (level) {
    case "error":
      return Log.Error;
    case "warn":
      return Log.Warn;
    case "info":
      return Log.Info;
    case "debug":
      return Log.Debug;
    default:
      return Log.Info;
  }
};

const logger = {
  error: (error: Error, label?: string) => {
    console.error(`[error][${label ?? error.name}]: ${error.message} `);
  },

  warn: (message: string, label?: string, ...data: unknown[]) => {
    if (getLogLevel() < Log.Warn) return;
    const logMessage = `[warn]${label ? `[${label}]` : ""}: ${message}`;

    console.warn(logMessage, ...data);
  },

  info: (message: string, label?: string, ...data: unknown[]) => {
    if (getLogLevel() < Log.Info) return;
    const logMessage = `[info]${label ? `[${label}]` : ""}: ${message}`;

    console.info(logMessage, ...data);
  },

  debug: (message: string, label?: string, ...data: unknown[]) => {
    if (getLogLevel() < Log.Debug) return;

    const logMessage = `[debug]${label ? `[${label}]` : ""}: ${message}`;

    console.debug(logMessage, ...data);
  },
};

export { logger };
