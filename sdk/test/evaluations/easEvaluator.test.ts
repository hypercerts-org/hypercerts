import EasEvaluator from "../../src/evaluations/eas.js";
import { EAS_SCHEMAS } from "../../src/constants.js";
import { DuplicateEvaluation, SimpleTextEvaluation } from "../../src/types/evaluation.js";
import { MockProvider } from "ethereum-waffle";
import { HypercertClientConfig } from "../../src/index.js";

describe("EasEvaluator", () => {
  const provider = new MockProvider();
  const [wallet] = provider.getWallets();
  const signer = wallet.connect(provider);

  const config = {
    chainId: 5,
    easContractAddress: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e",
    signer,
  } as Partial<HypercertClientConfig>;
  const easEvaluator = new EasEvaluator(config);

  describe("getSignature", () => {
    it("should return a signature", async () => {
      const encodedData = "0x1234567890abcdef";
      const recipient = "0x0987654321098765432109876543210987654321";
      const schema = EAS_SCHEMAS["sepolia"].duplicate;

      const signature = await easEvaluator.getSignature(encodedData, recipient, schema.uid);

      expect(signature).toBeDefined();
      expect(signature.message.schema).toEqual(schema.uid);
      expect(Object.keys(signature)).toEqual(
        expect.arrayContaining(["domain", "message", "primaryType", "signature", "types", "uid"]),
      );
    });
  });

  describe("signOfflineEvaluation", () => {
    it("should sign a duplicate evaluation", async () => {
      const evaluation = {
        type: "duplicate",
        realHypercert: {
          chainId: "0x1",
          contract: "0x1234567890123456789012345678901234567890",
          claimId: "1",
        },
        duplicateHypercerts: [
          {
            chainId: "0x1",
            contract: "0x0987654321098765432109876543210987654321",
            claimId: "2",
          },
        ],
        explanation: "explanation",
      } as DuplicateEvaluation;

      const signature = await easEvaluator.signOfflineEvaluation(evaluation);

      expect(signature).toBeDefined();
      expect(signature?.message.schema).toEqual(EAS_SCHEMAS["sepolia"].duplicate.uid);
      expect(Object.keys(signature!)).toEqual(
        expect.arrayContaining(["domain", "message", "primaryType", "signature", "types", "uid"]),
      );
    });

    it("should sign a simple text evaluation", async () => {
      const evaluation = {
        type: "simpleText",
        hypercert: {
          chainId: "0x1",
          contract: "0x0987654321098765432109876543210987654321",
          claimId: "2",
        },
        text: "text",
      } as SimpleTextEvaluation;

      const signature = await easEvaluator.signOfflineEvaluation(evaluation);

      expect(signature).toBeDefined();
      expect(signature?.message.schema).toEqual(EAS_SCHEMAS["sepolia"].contentHash.uid);
      expect(Object.keys(signature!)).toEqual(
        expect.arrayContaining(["domain", "message", "primaryType", "signature", "types", "uid"]),
      );
    });
  });
});
