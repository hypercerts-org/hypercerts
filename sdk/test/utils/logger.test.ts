import { reloadEnv } from "../setup-tests.js";
import logger from "../../src/utils/logger.js";
import { jest } from "@jest/globals";

describe("logger", () => {
  beforeEach(() => {
    delete process.env.LOG_LEVEL;
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "info").mockImplementation(() => {});
    jest.spyOn(console, "debug").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("skip logging", () => {
    it("by default it should not log a debug message to the console", () => {
      console.log("process.env.LOG_LEVEL", process.env.LOG_LEVEL);
      const message = "Test debug";
      logger.debug(message);

      expect(console.debug).not.toHaveBeenCalled();
    });
  });

  describe("error", () => {
    it("should log an error message to the console", () => {
      const error = new Error("Test error");
      logger.error(error);

      expect(console.error).toHaveBeenCalledWith(`[error][${error.name}]: ${error.message} `);
    });

    it("should log an error message with a custom label to the console", () => {
      const error = new Error("Test error");
      const label = "Test label";
      logger.error(error, label);

      expect(console.error).toHaveBeenCalledWith(`[error][${label}]: ${error.message} `);
    });
  });

  describe("warn", () => {
    it("should log a warning message to the console", () => {
      const message = "Test warning";
      logger.warn(message);

      expect(console.warn).toHaveBeenCalledWith(`[warn]: ${message}`);
    });

    it("should log a warning message with a custom label to the console", () => {
      const message = "Test warning";
      const label = "Test label";
      logger.warn(message, label);

      expect(console.warn).toHaveBeenCalledWith(`[warn][${label}]: ${message}`);
    });
  });

  describe("info", () => {
    it("should log an info message to the console", () => {
      const message = "Test info";
      logger.info(message);

      expect(console.info).toHaveBeenCalledWith(`[info]: ${message}`);
    });

    it("should log an info message with a custom label to the console", () => {
      const message = "Test info";
      const label = "Test label";
      logger.info(message, label);

      expect(console.info).toHaveBeenCalledWith(`[info][${label}]: ${message}`);
    });
  });

  describe("debug", () => {
    beforeEach(() => {
      process.env.LOG_LEVEL = "debug";
    });

    afterEach(() => {
      delete process.env.LOG_LEVEL;
      reloadEnv();
    });
    it("should log a debug message to the console", () => {
      const message = "Test debug";
      logger.debug(message);

      expect(console.debug).toHaveBeenCalledWith(`[debug]: ${message}`);
    });

    it("should log a debug message with a custom label to the console", () => {
      const message = "Test debug";
      const label = "Test label";
      logger.debug(message, label);

      expect(console.debug).toHaveBeenCalledWith(`[debug][${label}]: ${message}`);
    });
  });
});
