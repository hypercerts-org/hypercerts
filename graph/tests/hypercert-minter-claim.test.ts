import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
} from "matchstick-as/assembly/index";
import { BigInt } from "@graphprotocol/graph-ts";
import { handleClaimStored } from "../src/hypercert-minter";
import {
  createClaimStoredEvent,
  getDefaultContractAddress,
} from "./hypercert-minter-utils";

export { handleClaimStored };

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let claimStoredEvent = createClaimStoredEvent(
      BigInt.fromI64(1),
      "ipfs://exampleshash",
      BigInt.fromI64(10000)
    );
    handleClaimStored(claimStoredEvent);
  });

  afterAll(() => {
    clearStore();
  });

  test("ClaimStored generates one claim entity", () => {
    assert.entityCount("Allowlist", 0);
    assert.entityCount("Claim", 1);
    assert.entityCount("ClaimFraction", 0);

    let claimId = getDefaultContractAddress()
      .toHexString()
      .concat("-".concat(BigInt.fromI64(1).toString()));

    assert.fieldEquals("Claim", claimId, "uri", "ipfs://exampleshash");
    assert.fieldEquals(
      "Claim",
      claimId,
      "creator",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a"
    );
    assert.fieldEquals(
      "Claim",
      claimId,
      "owner",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a"
    );
    assert.fieldEquals("Claim", claimId, "totalUnits", "10000");
  });
});
