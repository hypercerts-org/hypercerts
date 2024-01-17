// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/**
 * @notice It is returned if the amount is invalid.
 *         For ERC721 and Hypercert, any number that is not 1. For ERC1155, if amount is 0.
 */
error AmountInvalid();

/**
 * @notice It is returned if the ask price is too high for the bid user.
 */
error AskTooHigh();

/**
 * @notice It is returned if the bid price is too low for the ask user.
 */
error BidTooLow();

/**
 * @notice It is returned if the function cannot be called by the sender.
 */
error CallerInvalid();

/**
 * @notice It is returned if the currency is invalid.
 */
error CurrencyInvalid();

/**
 * @notice The function selector is invalid for this strategy implementation.
 */
error FunctionSelectorInvalid();

/**
 * @notice It is returned if there is either a mismatch or an error in the length of the array(s).
 */
error LengthsInvalid();

/**
 * @notice It is returned if the merkle proof provided is invalid.
 */
error MerkleProofInvalid();

/**
 * @notice It is returned if the length of the merkle proof provided is greater than tolerated.
 * @param length Proof length
 */
error MerkleProofTooLarge(uint256 length);

/**
 * @notice It is emitted if the call recipient is not a contract.
 */
error NotAContract();

/**
 * @notice It is returned if the order is permanently invalid.
 *         There may be an issue with the order formatting.
 */
error OrderInvalid();

/**
 * @notice It is returned if the maker quote type is invalid.
 */
error QuoteTypeInvalid();

/**
 * @notice It is returned is the collection type is not supported.
 *         For instance if the strategy is specific to hypercerts.
 */
error CollectionTypeInvalid();
