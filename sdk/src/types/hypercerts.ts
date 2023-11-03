/**
 * Transfer restrictions for Hypercerts matching the definitions in the Hypercerts protocol
 * @dev AllowAll: All transfers are allowed
 * @dev DisallowAll: All transfers are disallowed
 * @dev FromCreatorOnly: Only the creator can transfer the Hypercert
 */
export const TransferRestrictions = {
  AllowAll: 0,
  DisallowAll: 1,
  FromCreatorOnly: 2,
} as const;

export type TransferRestrictions = (typeof TransferRestrictions)[keyof typeof TransferRestrictions];

/**
 * Allowlist entry for Hypercerts matching the definitions in the Hypercerts protocol
 * @param address - Address of the recipient
 * @param units - Number of units allocated to the recipient
 */
export type AllowlistEntry = {
  address: string;
  units: bigint;
};
