import { describe, it, beforeEach, afterEach, beforeAll, afterAll } from "vitest";
import sinon from "sinon";

import { logger } from "../../src/utils";

describe("logger", () => {
  const stubError = sinon.stub(console, "error");
  const stubWarn = sinon.stub(console, "warn");
  const stubInfo = sinon.stub(console, "info");
  const stubDebug = sinon.stub(console, "debug");

  beforeEach(() => {
    sinon.reset();
  });

  afterAll(() => {
    sinon.restore();
  });

  describe("skip logging", () => {
    it("by default it should not log a debug message to the console", () => {
      sinon.stub(process, "env").value({ LOG_LEVEL: null });

      const message = "Test debug";
      logger.debug(message);

      sinon.assert.notCalled(stubDebug);
      sinon.assert.notCalled(stubInfo);
      sinon.assert.notCalled(stubWarn);
      sinon.assert.notCalled(stubError);
    });
  });

  describe("error", () => {
    beforeAll(() => {
      const LOG_LEVEL = "error";
      sinon.stub(process, "env").value({ LOG_LEVEL });
    });

    afterEach(() => {
      sinon.reset();
    });

    it("should log an error message to the console", () => {
      const error = new Error("Test error");
      logger.error(error);

      sinon.assert.notCalled(stubDebug);
      sinon.assert.notCalled(stubInfo);
      sinon.assert.notCalled(stubWarn);

      sinon.assert.calledOnceWithMatch(stubError, `[error][${error.name}]: ${error.message}`);
    });

    it("should log an error message with a custom label to the console", () => {
      const error = new Error("Test error");
      const label = "Test label";
      logger.error(error, label);

      sinon.assert.notCalled(stubDebug);
      sinon.assert.notCalled(stubInfo);
      sinon.assert.notCalled(stubWarn);

      sinon.assert.calledOnceWithMatch(stubError, `[error][${label}]: ${error.message}`);
    });
  });

  describe("warn", () => {
    beforeAll(() => {
      const LOG_LEVEL = "warn";
      sinon.stub(process, "env").value({ LOG_LEVEL });
    });

    afterAll(() => {
      sinon.reset();
    });

    it("should log a warning message to the console", () => {
      const message = "Test warning";
      logger.warn(message);

      sinon.assert.notCalled(stubDebug);
      sinon.assert.notCalled(stubInfo);
      sinon.assert.notCalled(stubError);

      sinon.assert.calledOnceWithMatch(stubWarn, `[warn]: ${message}`);
    });

    it("should log a warning message with a custom label to the console", () => {
      const message = "Test warning";
      const label = "Test label";
      logger.warn(message, label);

      sinon.assert.notCalled(stubDebug);
      sinon.assert.notCalled(stubInfo);
      sinon.assert.notCalled(stubError);

      sinon.assert.calledOnceWithMatch(stubWarn, `[warn][${label}]: ${message}`);
    });
  });

  describe("info", () => {
    beforeAll(() => {
      const LOG_LEVEL = "info";
      sinon.stub(process, "env").value({ LOG_LEVEL });
    });

    afterAll(() => {
      sinon.reset();
    });

    it("should log an info message to the console", () => {
      const message = "Test info";
      logger.info(message);

      sinon.assert.notCalled(stubDebug);
      sinon.assert.notCalled(stubWarn);
      sinon.assert.notCalled(stubError);

      sinon.assert.calledOnceWithMatch(stubInfo, `[info]: ${message}`);
    });

    it("should log an info message with a custom label to the console", () => {
      const message = "Test info";
      const label = "Test label";
      logger.info(message, label);

      sinon.assert.notCalled(stubDebug);
      sinon.assert.notCalled(stubWarn);
      sinon.assert.notCalled(stubError);

      sinon.assert.calledOnceWithMatch(stubInfo, `[info][${label}]: ${message}`);
    });
  });

  describe("debug", () => {
    beforeAll(() => {
      const LOG_LEVEL = "debug";
      sinon.stub(process, "env").value({ LOG_LEVEL });
    });

    afterAll(() => {
      sinon.reset();
    });

    it("should log a debug message to the console", () => {
      const message = "Test debug";
      logger.debug(message);

      sinon.assert.notCalled(stubInfo);
      sinon.assert.notCalled(stubWarn);
      sinon.assert.notCalled(stubError);

      sinon.assert.calledOnceWithMatch(stubDebug, `[debug]: ${message}`);
    });

    it("should log a debug message with a custom label to the console", () => {
      const message = "Test debug";
      const label = "Test label";
      logger.debug(message, label);
      sinon.assert.notCalled(stubInfo);
      sinon.assert.notCalled(stubWarn);
      sinon.assert.notCalled(stubError);

      sinon.assert.calledOnceWithMatch(stubDebug, `[debug][${label}]: ${message}`);
    });
  });
});
