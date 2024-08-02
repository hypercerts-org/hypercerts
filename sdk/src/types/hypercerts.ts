/**
 * Represents the possible transfer restrictions of a claim matching the hypercerts protocol.
 */
export const TransferRestrictions = {
  AllowAll: 0,
  DisallowAll: 1,
  FromCreatorOnly: 2,
} as const;

export type TransferRestrictions = (typeof TransferRestrictions)[keyof typeof TransferRestrictions];

/**
 * Represents an entry in an allowlist.
 */
export type AllowlistEntry = {
  address: string;
  units: bigint;
};
