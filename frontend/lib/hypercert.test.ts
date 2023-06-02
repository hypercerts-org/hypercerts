import BN from "bn.js";
import { HypercertTokens, Hypercert } from "./hypercert";
import { ClaimToken, Claim } from "@hypercerts-org/sdk";
import { randomAddress, randomTokenID } from "./test-utils";

type GenClaimTokenOptions = {
  contract?: string;
  owner?: string;
  chainName?: string;
  units?: string;
};

function genClaimTokens(
  length: number,
  options?: GenClaimTokenOptions,
): Array<Omit<ClaimToken, "claim">> {
  const contract = options?.contract ?? randomAddress();
  const tokens: Array<Omit<ClaimToken, "claim">> = [];
  for (let i = 0; i < length; i++) {
    const tokenID = randomTokenID();
    const id = `0x${contract}-${tokenID}`;
    const owner = options?.owner ?? randomAddress();
    tokens.push({
      id: id,
      tokenID: tokenID,
      owner: owner,
      chainName: options?.chainName ?? "test",
      units: options?.units ?? "100",
    });
  }
  return tokens;
}

function genClaim(): Claim {
  return {
    id: `0x$(randomAddress())-$(randomTokenID())`,
    creation: "",
    contract: randomAddress(),
    tokenID: randomTokenID(),
    totalUnits: "1000",
    chainName: "test",
  };
}

describe("HypercertTokens", () => {
  describe("percentage", () => {
    // Test generator
    const tests: Array<{
      title: string;
      tokenCount: number;
      totalUnits: string;
      tokenUnits: string;
      precision?: number;
      expected: number;
    }> = [
      {
        title: "calculates 100% for 1 token",
        tokenCount: 1,
        totalUnits: "100",
        tokenUnits: "100",
        expected: 100,
      },
      {
        title: "calculates 66.67% for 1 token",
        tokenCount: 1,
        totalUnits: "3",
        tokenUnits: "2",
        expected: 66.67,
      },
      {
        title: "calculates 66.67% for 2 tokens",
        tokenCount: 2,
        totalUnits: "3",
        tokenUnits: "1",
        expected: 66.67,
      },
      {
        title: "calculates 75% for 3 tokens",
        tokenCount: 3,
        totalUnits: "100000",
        tokenUnits: "25000",
        expected: 75,
      },
    ];
    tests.forEach((e) => {
      it(e.title, () => {
        const testTokens = genClaimTokens(e.tokenCount, {
          units: e.tokenUnits,
        });
        const tokens = new HypercertTokens(testTokens, new BN(e.totalUnits));
        expect(tokens.percentage(e.precision)).toEqual(e.expected);
      });
    });
  });
});

describe("Hypercert", () => {
  describe("getTokenFor", () => {
    it("get token for specific addresses and calculate percentages", () => {
      const tokens = [
        genClaimTokens(1, { owner: "test0", units: "100" }),
        genClaimTokens(2, { owner: "test1", units: "100" }),
        genClaimTokens(3, { owner: "test2", units: "100" }),
      ].reduce((a, c) => a.concat(c));
      const hypercert = new Hypercert(
        { claim: genClaim() },
        { claimTokens: tokens },
      );
      expect(hypercert.getTokensFor("test0").percentage()).toEqual(10);
      expect(hypercert.getTokensFor("test1").percentage()).toEqual(20);
      expect(hypercert.getTokensFor("test2").percentage()).toEqual(30);
    });
  });
});
