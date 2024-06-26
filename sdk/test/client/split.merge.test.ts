import { describe, it, beforeEach, afterAll } from "vitest";
import chai, { expect } from "chai";
import assertionsCount from "chai-assertions-count";

import sinon from "sinon";

import { HypercertClient } from "../../src/client";

import { publicClient, walletClient } from "../helpers";
import { isHex, toHex } from "viem";
import { ClientError, ContractError } from "src";
import { faker } from "@faker-js/faker";

chai.use(assertionsCount);

describe("split and merge", () => {
  const wallet = walletClient;
  const userAddress = wallet.account?.address;

  let readSpy = sinon.stub(publicClient, "readContract");
  let writeSpy = sinon.stub(walletClient, "writeContract");

  const client = new HypercertClient({
    environment: "test",
    walletClient,
    publicClient,
  });

  const fractionId = 9868188640707215440437863615521278132232n;

  afterAll(() => {
    sinon.restore();
  });

  describe("splitFractionUnits in HypercertClient", () => {
    beforeEach(async () => {
      chai.Assertion.resetAssertsCheck();
      readSpy.resetBehavior();
      readSpy.resetHistory();

      writeSpy.resetBehavior();
      writeSpy.resetHistory();
    });

    it("allows for a hypercert fractions to be splitted over value", async () => {
      chai.Assertion.expectExpects(4);
      readSpy = readSpy.onFirstCall().resolves(userAddress).onSecondCall().resolves(300n);
      writeSpy = writeSpy.resolves(toHex(420));

      expect(client.readOnly).to.be.false;

      const hash = await client.splitFractionUnits(fractionId, [100n, 200n]);

      //TODO determine underlying calls and mock those out. Some are provider simulation calls
      expect(isHex(hash)).to.be.true;
      expect(readSpy.callCount).to.eq(2);
      expect(writeSpy.callCount).to.eq(1);
    });

    it("allows for a hypercert fractions to be splitted over value with override params", async () => {
      chai.Assertion.expectExpects(5);
      readSpy = readSpy
        .onFirstCall()
        .resolves(userAddress)
        .onSecondCall()
        .resolves(300n)
        .onThirdCall()
        .resolves(userAddress)
        .onCall(3)
        .resolves(300n);

      writeSpy = writeSpy.resolves(toHex(420));

      expect(client.readOnly).to.be.false;

      try {
        await client.splitFractionUnits(fractionId, [100n, 200n], { gasLimit: "FALSE_VALUE" as unknown as bigint });
      } catch (e) {
        expect(e instanceof ContractError).to.be.true;
      }

      const hash = await client.splitFractionUnits(fractionId, [100n, 200n], { gasLimit: 12300000n });

      //TODO determine underlying calls and mock those out. Some are provider simulation calls
      expect(isHex(hash)).to.be.true;
      expect(readSpy.callCount).to.eq(4);
      expect(writeSpy.callCount).to.eq(1);
    });

    it("throws on splitting with incorrect new total value", async () => {
      chai.Assertion.expectExpects(4);
      readSpy = readSpy
        .onFirstCall()
        .resolves(userAddress) // ownerOf
        .onSecondCall()
        .resolves(300n) // unitsOf
        .onThirdCall()
        .resolves(userAddress)
        .onCall(3)
        .resolves(300n);

      expect(client.readOnly).to.be.false;

      try {
        await client.splitFractionUnits(fractionId, [100n, 777n]);
      } catch (e) {
        expect(e instanceof ClientError).to.be.true;

        const error = e as ClientError;
        expect(error.message).to.be.eq("Sum of fractions is not equal to the total units");
      }

      //TODO determine underlying calls and mock those out. Some are provider simulation calls
      // Owner
      // UnitsOf
      expect(readSpy.callCount).to.eq(2);
      expect(writeSpy.callCount).to.eq(0);
    });

    it("throws on splitting fractions not owned by signer", async () => {
      chai.Assertion.expectExpects(4);
      readSpy = readSpy.onFirstCall().resolves(faker.finance.ethereumAddress()).onSecondCall().resolves(300n); // unitsOf; // ownerOf

      expect(client.readOnly).to.be.false;

      try {
        await client.splitFractionUnits(fractionId, [100n, 200n]);
      } catch (e) {
        expect(e instanceof ClientError).to.be.true;

        const error = e as ClientError;
        expect(error.message).to.be.eq("Claim is not owned by the signer");
      }

      //TODO determine underlying calls and mock those out. Some are provider simulation calls
      // Owner
      expect(readSpy.callCount).to.eq(2);
      expect(writeSpy.callCount).to.eq(0);
    });
  });

  describe("mergeFractionUnits in HypercertClient", () => {
    beforeEach(async () => {
      chai.Assertion.resetAssertsCheck();
      readSpy.resetBehavior();
      readSpy.resetHistory();

      writeSpy.resetBehavior();
      writeSpy.resetHistory();
    });

    it("allows for hypercert fractions to merge value", async () => {
      chai.Assertion.expectExpects(3);
      readSpy = readSpy
        .onFirstCall()
        .resolves(userAddress) // ownerOf
        .onSecondCall()
        .resolves(userAddress) // unitsOf
        .onThirdCall()
        .resolves(userAddress);

      writeSpy = writeSpy.resolves(toHex(420));

      expect(client.readOnly).to.be.false;

      const hash = await client.mergeFractionUnits([fractionId, fractionId + 1n]);

      //TODO determine underlying calls and mock those out. Some are provider simulation calls
      expect(isHex(hash)).to.be.true;
      expect(readSpy.callCount).to.eq(2);
      expect(writeSpy.callCount).to.eq(1);
    });

    it("allows for hypercert fractions to merge value with override params", async () => {
      chai.Assertion.expectExpects(7);

      readSpy = readSpy.resolves(userAddress); // ownerOf

      writeSpy = writeSpy.resolves(toHex(420));

      expect(client.readOnly).to.be.false;

      let hash;

      try {
        hash = await client.mergeFractionUnits([fractionId, fractionId + 1n], {
          gasLimit: "FALSE_VALUE" as unknown as bigint,
        });
      } catch (e) {
        console.log(e);
        // https://github.com/wevm/viem/issues/1275
        expect(e instanceof Error).to.be.true;

        // const error = e as ClientError;
        // expect(error.message).to.be.eq(/invalid BigNumber string/);
        expect(isHex(hash)).to.be.false;
      }

      hash = await client.mergeFractionUnits([fractionId, fractionId + 1n], { gasLimit: 12300000n });

      //TODO determine underlying calls and mock those out. Some are provider simulation calls

      expect(isHex(hash)).to.be.true;
      expect(readSpy.callCount).to.eq(4);
      expect(writeSpy.callCount).to.eq(1);
    });

    it("throws on splitting fractions not owned by signer", async () => {
      chai.Assertion.expectExpects(3);
      readSpy = readSpy.onFirstCall().resolves(userAddress).onSecondCall().resolves(faker.finance.ethereumAddress()); // ownerOf

      expect(client.readOnly).to.be.false;

      let hash;
      try {
        hash = await client.mergeFractionUnits([fractionId, fractionId + 1n]);
      } catch (e) {
        expect(e instanceof ClientError).to.be.true;

        const error = e as ClientError;
        expect(error.message).to.be.eq("One or more fractions are not owned by the signer");
      }

      //TODO determine underlying calls and mock those out. Some are provider simulation calls
      expect(isHex(hash)).to.be.false;
      expect(readSpy.callCount).to.eq(2);
      expect(writeSpy.callCount).to.eq(0);
    });
  });
});
