import { describe, it, beforeEach, afterAll } from "vitest";
import chai, { expect } from "chai";
import assertionsCount from "chai-assertions-count";

import { HypercertClient } from "../../src/client";
import { walletClient, publicClient } from "../helpers";
import { isHex, toHex } from "viem";
import sinon from "sinon";
import { faker } from "@faker-js/faker";
import { ClientError, ContractError } from "../../src";

chai.use(assertionsCount);

chai.use(assertionsCount);

describe("burn fraction tokens in HypercertClient", () => {
  const wallet = walletClient;
  const userAddress = wallet.account?.address;
  const client = new HypercertClient({
    environment: "test",
    walletClient,
    publicClient,
  });

  const fractionId = 9868188640707215440437863615521278132232n;

  let readSpy = sinon.stub(publicClient, "readContract");
  let writeSpy = sinon.stub(walletClient, "writeContract");

  beforeEach(async () => {
    chai.Assertion.resetAssertsCheck();

    readSpy.resetBehavior();
    readSpy.resetHistory();

    writeSpy.resetBehavior();
    writeSpy.resetHistory();
  });

  afterAll(() => {
    sinon.restore();
  });

  it("allows for a hypercert fraction to be burned", async () => {
    readSpy = readSpy.resolves(userAddress);

    writeSpy = writeSpy.resolves(toHex(420));

    expect(client.readOnly).to.be.false;

    const hash = await client.burnClaimFraction(fractionId);

    //TODO determine underlying calls and mock those out. Some are provider simulation calls
    expect(isHex(hash)).to.be.true;
    expect(readSpy.callCount).to.eq(1);
    expect(writeSpy.callCount).to.eq(1);
  });

  it("throws on burning fraction not owned by signer", async () => {
    chai.Assertion.expectAssertions(6);
    readSpy = readSpy.resolves(faker.finance.ethereumAddress());

    expect(client.readOnly).to.be.false;

    let hash;
    try {
      hash = await client.burnClaimFraction(fractionId);
    } catch (e) {
      expect(e).to.be.instanceOf(ClientError);

      const error = e as ClientError;
      expect(error.message).to.eq("Hypercert is not owned by the signer");
    }

    //TODO determine underlying calls and mock those out. Some are provider simulation calls
    expect(hash).to.be.undefined;
    expect(readSpy.callCount).to.eq(1);
    expect(writeSpy.callCount).to.eq(0);
  });

  it("allows for a hypercert fraction to be burned with override params", async () => {
    chai.Assertion.expectAssertions(6);
    readSpy = readSpy.resolves(userAddress);

    writeSpy = writeSpy.resolves(toHex(420));

    expect(client.readOnly).to.be.false;

    let noHash;

    try {
      noHash = await client.burnClaimFraction(fractionId, { gasLimit: "FALSE_VALUE" as unknown as bigint });
      expect.fail("should have thrown on incorrect gasLimit value");
    } catch (e) {
      expect(e).to.be.instanceOf(ContractError);
    }

    const hash = await client.burnClaimFraction(fractionId, { gasLimit: 12300000n });

    //TODO determine underlying calls and mock those out. Some are provider simulation calls
    expect(noHash).to.be.undefined;
    expect(isHex(hash)).to.be.true;
    expect(readSpy.callCount).to.eq(2);
    expect(writeSpy.callCount).to.eq(1);
  });
});
