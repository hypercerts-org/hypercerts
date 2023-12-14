import { describe, it } from "vitest";

import { expect } from "chai";

import {
  ClientError,
  FetchError,
  MalformedDataError,
  MintingError,
  StorageError,
  UnknownSchemaError,
  UnsupportedChainError,
} from "../../src/types/errors";

describe("Error types", () => {
  it("has ClientError", () => {
    const error = new ClientError("Client error", { foo: "bar" });
    error.message = "Client error";
    error.payload = { foo: "bar" };
    expect(error).to.be.instanceOf(Error);
    expect(error).to.be.instanceOf(ClientError);
  });

  it("has FetchError", () => {
    const error = new FetchError("Fetch error", { url: "http://badexample.com" });
    error.message = "Fetch error";
    error.payload = { url: "http://badexample.com" };
    expect(error).to.be.instanceOf(Error);
    expect(error).to.be.instanceOf(FetchError);
  });

  it("has InvalidOrMissingError", () => {
    const error = new MalformedDataError("Invalid or missing data", { data: { foo: "bar" } });
    error.message = "Invalid or missing data";
    error.payload = { data: { foo: "bar" } };
    expect(error).to.be.instanceOf(Error);
    expect(error).to.be.instanceOf(MalformedDataError);
  });

  it("has MalformedDataError", () => {
    const error = new MalformedDataError("Malformed data", { data: { foo: "bar" } });
    error.message = "Malformed data";
    error.payload = { data: { foo: "bar" } };
    expect(error).to.be.instanceOf(Error);
    expect(error).to.be.instanceOf(MalformedDataError);
  });

  it("has MintingError", () => {
    const error = new MintingError("Minting error", { foo: "bar" });
    error.message = "Minting error";
    error.payload = { foo: "bar" };
    expect(error).to.be.instanceOf(Error);
    expect(error).to.be.instanceOf(MintingError);
  });

  it("has StorageError", () => {
    const error = new StorageError("Storage error", { foo: "bar" });
    error.message = "Storage error";
    error.payload = { foo: "bar" };
    expect(error).to.be.instanceOf(Error);
    expect(error).to.be.instanceOf(StorageError);
  });

  it("has UnsupportedChainError", () => {
    const error = new UnsupportedChainError("Unsupported chain", { chainID: 1337 });
    error.message = "Unsupported chain";
    error.payload = { chainID: 1337 };
    expect(error).to.be.instanceOf(Error);
    expect(error).to.be.instanceOf(UnsupportedChainError);
  });

  it("has UnknownSchemaError", () => {
    const error = new UnknownSchemaError("Unknown schema", { schemaName: "http://example.com/schema.json" });
    error.message = "Unknown schema";
    error.payload = { schemaName: "http://example.com/schema.json" };
    expect(error).to.be.instanceOf(Error);
    expect(error).to.be.instanceOf(UnknownSchemaError);
  });
});
