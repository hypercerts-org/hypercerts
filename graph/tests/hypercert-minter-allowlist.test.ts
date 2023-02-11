import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
} from "matchstick-as/assembly/index";
import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { handleAllowlistCreated } from "../src/hypercert-minter";
import {
  createAllowlistCreatedEvent,
  getDefaultContractAddress,
} from "./hypercert-minter-utils";

export { handleAllowlistCreated };

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let tokenID = BigInt.fromI64(1);

    let allowlistCreatedEvent = createAllowlistCreatedEvent(
      tokenID,
      Bytes.fromUTF8("MerkleRoot")
    );

    handleAllowlistCreated(allowlistCreatedEvent);
  });

  afterAll(() => {
    clearStore();
  });

  test("AllowlistCreated generates one allowlist entity", () => {
    let merkleRoot = Bytes.fromUTF8("MerkleRoot");
    let allowlistID = getDefaultContractAddress()
      .toHexString()
      .concat("-".concat(BigInt.fromI64(1).toString()));

    assert.entityCount("Allowlist", 1);
    assert.entityCount("Claim", 0);
    assert.entityCount("ClaimFraction", 0);

    assert.fieldEquals("Allowlist", allowlistID, "id", allowlistID);
    assert.fieldEquals(
      "Allowlist",
      allowlistID,
      "root",
      merkleRoot.toHexString()
    );
    assert.fieldEquals("Allowlist", allowlistID, "claim", allowlistID);
  });
});
