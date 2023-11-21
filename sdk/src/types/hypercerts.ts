/**
 * Represents the possible transfer restrictions of a claim matching the hypercerts protocol.
 *
 * @typedef {Object} TransferRestrictions
 * @property {number} AllowAll - Represents no restrictions on the transfer of the claim.
 * @property {number} DisallowAll - Represents complete restriction on the transfer of the claim.
 * @property {number} FromCreatorOnly - Represents that the claim can only be transferred by its creator.
 */
export const TransferRestrictions = {
  AllowAll: 0,
  DisallowAll: 1,
  FromCreatorOnly: 2,
} as const;

export type TransferRestrictions = (typeof TransferRestrictions)[keyof typeof TransferRestrictions];

/**
 * Represents an entry in an allowlist.
 *
 * @typedef {Object} AllowlistEntry
 * @property {string} address - The address of the entry.
 * @property {bigint} units - The units associated with the entry.
 */
export type AllowlistEntry = {
  address: string;
  units: bigint;
};
