import HypercertClient from "../../src/client";
import { HypercertMinterAbi } from "@hypercerts-org/contracts";
import { walletClient, publicClient } from "../helpers";
import { encodeFunctionResult, isHex, parseAbi } from "viem";
import sinon from "sinon";
import { faker } from "@faker-js/faker";
import { ClientError } from "../../src";

describe("burn fraction tokens in HypercertClient", () => {
  const wallet = walletClient;
  const userAddress = wallet.account.address;
  const client = new HypercertClient({
    id: 5,
    walletClient,
    publicClient,
  });

  const fractionId = 9868188640707215440437863615521278132232n;

  let readSpy = sinon.stub(publicClient, "request");
  let writeSpy = sinon.stub(walletClient, "writeContract");

  const burnFractionResult = encodeFunctionResult({
    abi: parseAbi(HypercertMinterAbi),
    functionName: "burnFraction",
    result: [],
  });

  beforeEach(async () => {
    readSpy.resetBehavior();
    readSpy.resetHistory();

    writeSpy.resetBehavior();
    writeSpy.resetHistory();
  });

  afterAll(() => {
    sinon.restore();
  });

  it("allows for a hypercert fraction to be burned", async () => {
    const ownerOfResult = encodeFunctionResult({
      abi: parseAbi(HypercertMinterAbi),
      functionName: "ownerOf",
      result: [userAddress],
    });

    readSpy = readSpy.withArgs(sinon.match({ method: "eth_call" })).resolves(ownerOfResult);

    writeSpy = writeSpy.resolves(burnFractionResult);

    expect(client.readonly).toBe(false);

    const hash = await client.burnClaimFraction(fractionId);

    //TODO determine underlying calls and mock those out. Some are provider simulation calls
    expect(isHex(hash)).toBeTruthy();
    expect(readSpy.callCount).toBe(1);
    expect(writeSpy.callCount).toBe(1);
  });

  it("throws on burning fraction not owned by signer", async () => {
    const ownerOfResult = encodeFunctionResult({
      abi: parseAbi(HypercertMinterAbi),
      functionName: "ownerOf",
      result: [faker.finance.ethereumAddress()],
    });

    readSpy = readSpy.withArgs(sinon.match({ method: "eth_call" })).resolves(ownerOfResult);

    writeSpy = writeSpy.resolves(burnFractionResult);

    expect(client.readonly).toBe(false);

    let hash;
    try {
      hash = await client.burnClaimFraction(fractionId);
    } catch (e) {
      console.log(e);
      expect(e instanceof ClientError).toBeTruthy();

      const error = e as ClientError;
      expect(error.message).toBe("Claim is not owned by the signer");
    }

    //TODO determine underlying calls and mock those out. Some are provider simulation calls
    expect(hash).toBeUndefined();
    expect(readSpy.callCount).toBe(2);
    expect(writeSpy.callCount).toBe(0);
    expect.assertions(6);
  });

  it("allows for a hypercert fraction to be burned with override params", async () => {
    const ownerOfResult = encodeFunctionResult({
      abi: parseAbi(HypercertMinterAbi),
      functionName: "ownerOf",
      result: [userAddress],
    });

    readSpy = readSpy.withArgs(sinon.match({ method: "eth_call" })).resolves(ownerOfResult);

    writeSpy = writeSpy.resolves(burnFractionResult);

    expect(client.readonly).toBe(false);

    let hash;

    try {
      hash = await client.burnClaimFraction(fractionId, { gasLimit: "FALSE_VALUE" as unknown as bigint });
      expect.fail("should have thrown on incorrect gasLimit value");
    } catch (e) {
      expect((e as Error).message).toMatch(/Cannot convert FALSE_VALUE to a BigInt/);
    }

    await client.burnClaimFraction(fractionId, { gasLimit: 12300000n });

    //TODO determine underlying calls and mock those out. Some are provider simulation calls
    expect(hash).toBeUndefined();
    expect(readSpy.callCount).toBe(4);
    expect(writeSpy.callCount).toBe(1);
    expect.assertions(5);
  });
});
