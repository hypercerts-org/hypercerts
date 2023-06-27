import { HypercertTokens, FullHypercert } from "./hypercert";
import { randomAddress, randomTokenID } from "./test-utils";
import { ClaimToken, Claim } from "@hypercerts-org/sdk";

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

function genClaim(totalUnits: string): Claim {
  return {
    id: `0x$(randomAddress())-$(randomTokenID())`,
    creation: "",
    contract: randomAddress(),
    tokenID: randomTokenID(),
    totalUnits: totalUnits,
    chainName: "test",
  };
}

describe("HypercertTokens", () => {
  describe("percentage - precision 2", () => {
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
        const tokens = new HypercertTokens(testTokens, BigInt(e.totalUnits));
        expect(tokens.percentage(e.precision)).toEqual(e.expected);
      });
    });
  });

  describe("percentage - precision 15", () => {
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
        precision: 15,
        expected: 100,
      },
      {
        title: "calculates 66.67% for 1 token",
        tokenCount: 1,
        totalUnits: "3",
        tokenUnits: "2",
        precision: 15,
        expected: 66.6666666666667,
      },
      {
        title: "calculates 66.67% for 2 tokens",
        tokenCount: 2,
        totalUnits: "3",
        tokenUnits: "1",
        precision: 15,
        expected: 66.6666666666667,
      },
      {
        title: "calculates 75% for 3 tokens",
        tokenCount: 3,
        totalUnits: "100000",
        tokenUnits: "25000",
        precision: 15,
        expected: 75,
      },
    ];
    tests.forEach((e) => {
      it(e.title, () => {
        const testTokens = genClaimTokens(e.tokenCount, {
          units: e.tokenUnits,
        });
        const tokens = new HypercertTokens(testTokens, BigInt(e.totalUnits));
        expect(tokens.percentage(e.precision)).toEqual(e.expected);
      });
    });
  });
});

describe("Hypercert", () => {
  describe("getTokenFor", () => {
    it("get token for specific addresses and calculate percentages", () => {
      const tokens = [
        genClaimTokens(1, { owner: "deadbeef0", units: "100" }),
        genClaimTokens(2, { owner: "deadbeef1", units: "100" }),
        genClaimTokens(3, { owner: "deadbeef2", units: "100" }),
      ].reduce((a, c) => a.concat(c));
      const hypercert = new FullHypercert(
        { claim: genClaim("1000") },
        { claimTokens: tokens },
      );
      expect(hypercert.getTokensFor("deadbeef0").percentage()).toEqual(10);

      // Include test for caps in the owner address
      expect(hypercert.getTokensFor("DEADbeef1").percentage()).toEqual(20);
      expect(hypercert.getTokensFor("deadbeef1").percentage()).toEqual(20);
      expect(hypercert.getTokensFor("deadbeef2").percentage()).toEqual(30);
    });
  });
});
