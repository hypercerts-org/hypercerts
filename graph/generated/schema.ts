// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal,
} from "@graphprotocol/graph-ts";

export class Allowlist extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Allowlist entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Allowlist must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("Allowlist", id.toString(), this);
    }
  }

  static loadInBlock(id: string): Allowlist | null {
    return changetype<Allowlist | null>(store.get_in_block("Allowlist", id));
  }

  static load(id: string): Allowlist | null {
    return changetype<Allowlist | null>(store.get("Allowlist", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get root(): Bytes {
    let value = this.get("root");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set root(value: Bytes) {
    this.set("root", Value.fromBytes(value));
  }

  get claim(): string {
    let value = this.get("claim");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set claim(value: string) {
    this.set("claim", Value.fromString(value));
  }
}

export class Claim extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Claim entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Claim must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("Claim", id.toString(), this);
    }
  }

  static loadInBlock(id: string): Claim | null {
    return changetype<Claim | null>(store.get_in_block("Claim", id));
  }

  static load(id: string): Claim | null {
    return changetype<Claim | null>(store.get("Claim", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get creation(): BigInt {
    let value = this.get("creation");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set creation(value: BigInt) {
    this.set("creation", Value.fromBigInt(value));
  }

  get tokenID(): BigInt {
    let value = this.get("tokenID");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set tokenID(value: BigInt) {
    this.set("tokenID", Value.fromBigInt(value));
  }

  get contract(): string {
    let value = this.get("contract");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set contract(value: string) {
    this.set("contract", Value.fromString(value));
  }

  get uri(): string | null {
    let value = this.get("uri");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set uri(value: string | null) {
    if (!value) {
      this.unset("uri");
    } else {
      this.set("uri", Value.fromString(<string>value));
    }
  }

  get creator(): Bytes | null {
    let value = this.get("creator");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set creator(value: Bytes | null) {
    if (!value) {
      this.unset("creator");
    } else {
      this.set("creator", Value.fromBytes(<Bytes>value));
    }
  }

  get owner(): Bytes | null {
    let value = this.get("owner");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set owner(value: Bytes | null) {
    if (!value) {
      this.unset("owner");
    } else {
      this.set("owner", Value.fromBytes(<Bytes>value));
    }
  }

  get totalUnits(): BigInt | null {
    let value = this.get("totalUnits");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set totalUnits(value: BigInt | null) {
    if (!value) {
      this.unset("totalUnits");
    } else {
      this.set("totalUnits", Value.fromBigInt(<BigInt>value));
    }
  }

  get metaData(): string | null {
    let value = this.get("metaData");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set metaData(value: string | null) {
    if (!value) {
      this.unset("metaData");
    } else {
      this.set("metaData", Value.fromString(<string>value));
    }
  }

  get allowlist(): string | null {
    let value = this.get("allowlist");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set allowlist(value: string | null) {
    if (!value) {
      this.unset("allowlist");
    } else {
      this.set("allowlist", Value.fromString(<string>value));
    }
  }
}

export class HypercertMetadata extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save HypercertMetadata entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type HypercertMetadata must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("HypercertMetadata", id.toString(), this);
    }
  }

  static loadInBlock(id: string): HypercertMetadata | null {
    return changetype<HypercertMetadata | null>(
      store.get_in_block("HypercertMetadata", id),
    );
  }

  static load(id: string): HypercertMetadata | null {
    return changetype<HypercertMetadata | null>(
      store.get("HypercertMetadata", id),
    );
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get name(): string | null {
    let value = this.get("name");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set name(value: string | null) {
    if (!value) {
      this.unset("name");
    } else {
      this.set("name", Value.fromString(<string>value));
    }
  }

  get description(): string | null {
    let value = this.get("description");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set description(value: string | null) {
    if (!value) {
      this.unset("description");
    } else {
      this.set("description", Value.fromString(<string>value));
    }
  }

  get image(): string | null {
    let value = this.get("image");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set image(value: string | null) {
    if (!value) {
      this.unset("image");
    } else {
      this.set("image", Value.fromString(<string>value));
    }
  }

  get external_url(): string | null {
    let value = this.get("external_url");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set external_url(value: string | null) {
    if (!value) {
      this.unset("external_url");
    } else {
      this.set("external_url", Value.fromString(<string>value));
    }
  }

  get version(): string | null {
    let value = this.get("version");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set version(value: string | null) {
    if (!value) {
      this.unset("version");
    } else {
      this.set("version", Value.fromString(<string>value));
    }
  }

  get ref(): string | null {
    let value = this.get("ref");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set ref(value: string | null) {
    if (!value) {
      this.unset("ref");
    } else {
      this.set("ref", Value.fromString(<string>value));
    }
  }

  get properties(): Array<string> | null {
    let value = this.get("properties");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set properties(value: Array<string> | null) {
    if (!value) {
      this.unset("properties");
    } else {
      this.set("properties", Value.fromStringArray(<Array<string>>value));
    }
  }

  get claimData(): Array<string> | null {
    let value = this.get("claimData");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set claimData(value: Array<string> | null) {
    if (!value) {
      this.unset("claimData");
    } else {
      this.set("claimData", Value.fromStringArray(<Array<string>>value));
    }
  }
}

export class ClaimData extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ClaimData entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type ClaimData must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("ClaimData", id.toString(), this);
    }
  }

  static loadInBlock(id: string): ClaimData | null {
    return changetype<ClaimData | null>(store.get_in_block("ClaimData", id));
  }

  static load(id: string): ClaimData | null {
    return changetype<ClaimData | null>(store.get("ClaimData", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get impactScope(): Array<string> {
    let value = this.get("impactScope");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toStringArray();
    }
  }

  set impactScope(value: Array<string>) {
    this.set("impactScope", Value.fromStringArray(value));
  }

  get workScope(): Array<string> {
    let value = this.get("workScope");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toStringArray();
    }
  }

  set workScope(value: Array<string>) {
    this.set("workScope", Value.fromStringArray(value));
  }

  get workTimeframe(): Array<BigInt> {
    let value = this.get("workTimeframe");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigIntArray();
    }
  }

  set workTimeframe(value: Array<BigInt>) {
    this.set("workTimeframe", Value.fromBigIntArray(value));
  }

  get impactTimeframe(): Array<BigInt> {
    let value = this.get("impactTimeframe");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigIntArray();
    }
  }

  set impactTimeframe(value: Array<BigInt>) {
    this.set("impactTimeframe", Value.fromBigIntArray(value));
  }

  get contributors(): Array<string> {
    let value = this.get("contributors");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toStringArray();
    }
  }

  set contributors(value: Array<string>) {
    this.set("contributors", Value.fromStringArray(value));
  }

  get rights(): Array<string> {
    let value = this.get("rights");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toStringArray();
    }
  }

  set rights(value: Array<string>) {
    this.set("rights", Value.fromStringArray(value));
  }
}

export class Attribute extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Attribute entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Attribute must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("Attribute", id.toString(), this);
    }
  }

  static loadInBlock(id: string): Attribute | null {
    return changetype<Attribute | null>(store.get_in_block("Attribute", id));
  }

  static load(id: string): Attribute | null {
    return changetype<Attribute | null>(store.get("Attribute", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get traitType(): string {
    let value = this.get("traitType");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set traitType(value: string) {
    this.set("traitType", Value.fromString(value));
  }

  get value(): string {
    let value = this.get("value");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set value(value: string) {
    this.set("value", Value.fromString(value));
  }
}

export class ClaimToken extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ClaimToken entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type ClaimToken must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("ClaimToken", id.toString(), this);
    }
  }

  static loadInBlock(id: string): ClaimToken | null {
    return changetype<ClaimToken | null>(store.get_in_block("ClaimToken", id));
  }

  static load(id: string): ClaimToken | null {
    return changetype<ClaimToken | null>(store.get("ClaimToken", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get tokenID(): BigInt {
    let value = this.get("tokenID");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set tokenID(value: BigInt) {
    this.set("tokenID", Value.fromBigInt(value));
  }

  get claim(): string {
    let value = this.get("claim");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set claim(value: string) {
    this.set("claim", Value.fromString(value));
  }

  get owner(): Bytes {
    let value = this.get("owner");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set owner(value: Bytes) {
    this.set("owner", Value.fromBytes(value));
  }

  get units(): BigInt {
    let value = this.get("units");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set units(value: BigInt) {
    this.set("units", Value.fromBigInt(value));
  }

  get offers(): OfferLoader {
    return new OfferLoader("ClaimToken", this.get("id")!.toString(), "offers");
  }
}

export class Token extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Token entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Token must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("Token", id.toString(), this);
    }
  }

  static loadInBlock(id: string): Token | null {
    return changetype<Token | null>(store.get_in_block("Token", id));
  }

  static load(id: string): Token | null {
    return changetype<Token | null>(store.get("Token", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get name(): string {
    let value = this.get("name");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set name(value: string) {
    this.set("name", Value.fromString(value));
  }

  get symbol(): string | null {
    let value = this.get("symbol");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set symbol(value: string | null) {
    if (!value) {
      this.unset("symbol");
    } else {
      this.set("symbol", Value.fromString(<string>value));
    }
  }

  get decimals(): BigInt | null {
    let value = this.get("decimals");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set decimals(value: BigInt | null) {
    if (!value) {
      this.unset("decimals");
    } else {
      this.set("decimals", Value.fromBigInt(<BigInt>value));
    }
  }
}

export class AcceptedToken extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save AcceptedToken entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type AcceptedToken must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("AcceptedToken", id.toString(), this);
    }
  }

  static loadInBlock(id: string): AcceptedToken | null {
    return changetype<AcceptedToken | null>(
      store.get_in_block("AcceptedToken", id),
    );
  }

  static load(id: string): AcceptedToken | null {
    return changetype<AcceptedToken | null>(store.get("AcceptedToken", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get token(): string {
    let value = this.get("token");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set token(value: string) {
    this.set("token", Value.fromString(value));
  }

  get minimumAmountPerUnit(): BigInt {
    let value = this.get("minimumAmountPerUnit");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set minimumAmountPerUnit(value: BigInt) {
    this.set("minimumAmountPerUnit", Value.fromBigInt(value));
  }

  get accepted(): boolean {
    let value = this.get("accepted");
    if (!value || value.kind == ValueKind.NULL) {
      return false;
    } else {
      return value.toBoolean();
    }
  }

  set accepted(value: boolean) {
    this.set("accepted", Value.fromBoolean(value));
  }
}

export class Offer extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Offer entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Offer must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("Offer", id.toString(), this);
    }
  }

  static loadInBlock(id: string): Offer | null {
    return changetype<Offer | null>(store.get_in_block("Offer", id));
  }

  static load(id: string): Offer | null {
    return changetype<Offer | null>(store.get("Offer", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get fractionID(): string {
    let value = this.get("fractionID");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set fractionID(value: string) {
    this.set("fractionID", Value.fromString(value));
  }

  get unitsAvailable(): BigInt {
    let value = this.get("unitsAvailable");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set unitsAvailable(value: BigInt) {
    this.set("unitsAvailable", Value.fromBigInt(value));
  }

  get minUnitsPerTrade(): BigInt {
    let value = this.get("minUnitsPerTrade");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set minUnitsPerTrade(value: BigInt) {
    this.set("minUnitsPerTrade", Value.fromBigInt(value));
  }

  get maxUnitsPerTrade(): BigInt {
    let value = this.get("maxUnitsPerTrade");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set maxUnitsPerTrade(value: BigInt) {
    this.set("maxUnitsPerTrade", Value.fromBigInt(value));
  }

  get status(): string {
    let value = this.get("status");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set status(value: string) {
    this.set("status", Value.fromString(value));
  }

  get acceptedTokens(): Array<string> {
    let value = this.get("acceptedTokens");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toStringArray();
    }
  }

  set acceptedTokens(value: Array<string>) {
    this.set("acceptedTokens", Value.fromStringArray(value));
  }
}

export class Trade extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Trade entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Trade must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("Trade", id.toString(), this);
    }
  }

  static loadInBlock(id: string): Trade | null {
    return changetype<Trade | null>(store.get_in_block("Trade", id));
  }

  static load(id: string): Trade | null {
    return changetype<Trade | null>(store.get("Trade", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get buyer(): Bytes {
    let value = this.get("buyer");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set buyer(value: Bytes) {
    this.set("buyer", Value.fromBytes(value));
  }

  get offerID(): string {
    let value = this.get("offerID");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set offerID(value: string) {
    this.set("offerID", Value.fromString(value));
  }

  get unitsSold(): BigInt {
    let value = this.get("unitsSold");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set unitsSold(value: BigInt) {
    this.set("unitsSold", Value.fromBigInt(value));
  }

  get token(): string {
    let value = this.get("token");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set token(value: string) {
    this.set("token", Value.fromString(value));
  }

  get amountPerUnit(): BigInt {
    let value = this.get("amountPerUnit");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set amountPerUnit(value: BigInt) {
    this.set("amountPerUnit", Value.fromBigInt(value));
  }
}

export class OfferLoader extends Entity {
  _entity: string;
  _field: string;
  _id: string;

  constructor(entity: string, id: string, field: string) {
    super();
    this._entity = entity;
    this._id = id;
    this._field = field;
  }

  load(): Offer[] {
    let value = store.loadRelated(this._entity, this._id, this._field);
    return changetype<Offer[]>(value);
  }
}
