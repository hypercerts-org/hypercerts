export enum Log {
  Error = 0,
  Warn,
  Info,
  Debug,
}

const getLogLevel = () => {
  const level = process.env.LOG_LEVEL;
  switch (level) {
    case "0":
      return Log.Error;
    case "1":
      return Log.Warn;
    case "2":
      return Log.Info;
    case "3":
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
    let logMessage = `[warn]${label ? `[${label}]` : ""}: ${message}`;

    console.warn(logMessage, ...data);
  },

  info: (message: string, label?: string, ...data: unknown[]) => {
    if (getLogLevel() < Log.Info) return;
    let logMessage = `[info]${label ? `[${label}]` : ""}: ${message}`;

    console.info(logMessage, ...data);
  },

  debug: (message: string, label?: string, ...data: unknown[]) => {
    if (getLogLevel() < Log.Debug) return;

    let logMessage = `[debug]${label ? `[${label}]` : ""}: ${message}`;

    console.debug(logMessage, ...data);
  },
};

export default logger;
