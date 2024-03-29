// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/**
 * 0. No error
 */

/**
 * @dev The maker order is expected to be valid.
 *      There can be other reasons that cause makers orders to be
 *      invalid (e.g. trading restrictions for the protocol, fallbacks).
 */
uint256 constant ORDER_EXPECTED_TO_BE_VALID = 0;

/**
 * 1. Strategy & currency-related codes
 */

/**
 * @dev The currency is not allowed in the protocol.
 *      This maker order could become valid only with owner action.
 *      If the order is a maker bid and currency = address(0), it is permanently invalid.
 */
uint256 constant CURRENCY_NOT_ALLOWED = 101;

/**
 * @dev The strategy is not implemented in the protocol.
 *      This maker order can become valid only with owner action.
 */
uint256 constant STRATEGY_NOT_IMPLEMENTED = 111;

/**
 * @dev The strategy is not for this quote type.
 *      This maker order can never become valid.
 */
uint256 constant STRATEGY_INVALID_QUOTE_TYPE = 112;

/**
 * @dev The strategy exists but is not currently active.
 *      This maker order can become valid again only with owner action.
 */
uint256 constant STRATEGY_NOT_ACTIVE = 113;

/**
 * 2. Maker order struct-related codes
 */

/**
 * @dev The maker order is permanently invalid for a standard sale (e.g. invalid collection type or amounts)
 *      This maker order cannot become valid again.
 */
uint256 constant MAKER_ORDER_INVALID_STANDARD_SALE = 201;

/**
 * @dev The maker order is permanently invalid for a non-standard sale strategy.
 *      This maker order cannot become valid again.
 */
uint256 constant MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE = 211;

/**
 * @dev The maker order is invalid due to a currency support.
 *      This maker order may become valid in the future depending on the strategy's currency support.
 *      Please refer to the strategy's implementation code.
 */
uint256 constant MAKER_ORDER_INVALID_CURRENCY_NON_STANDARD_SALE = 212;

/**
 * @dev The maker order is temporarily invalid due to a strategy-specific reason.
 *      This maker order may become valid in the future.
 *      Please refer to the strategy's implementation code.
 */
uint256 constant MAKER_ORDER_TEMPORARILY_INVALID_NON_STANDARD_SALE = 213;

/**
 * 3. Nonce-related codes
 */

/**
 * @dev The signer's subset nonce is cancelled.
 *      This maker order will not become valid again.
 */
uint256 constant USER_SUBSET_NONCE_CANCELLED = 301;

/**
 * @dev The signer's order nonce is executed or cancelled.
 *      This maker order will not become valid again.
 */
uint256 constant USER_ORDER_NONCE_EXECUTED_OR_CANCELLED = 311;

/**
 * @dev The signer's order nonce is in partial fill status with an other order hash.
 *      This maker order will not become valid again.
 */
uint256 constant USER_ORDER_NONCE_IN_EXECUTION_WITH_OTHER_HASH = 312;

/**
 * @dev The signer's global bid nonce is not matching the order's bid nonce.
 *      This maker order will not become valid again.
 */
uint256 constant INVALID_USER_GLOBAL_BID_NONCE = 321;

/**
 * @dev The signer's global ask nonce is not matching the order's ask nonce.
 *      This maker order will not become valid again.
 */
uint256 constant INVALID_USER_GLOBAL_ASK_NONCE = 322;

/**
 * 4. Codes related to signatures (EOA, EIP-1271) and merkle tree computations
 */

/**
 * @dev The order hash proof is not in the merkle tree.
 *      This maker order is not valid with the set of merkle root and proofs.
 *      It cannot become valid with the current merkle proof and root.
 */
uint256 constant ORDER_HASH_PROOF_NOT_IN_MERKLE_TREE = 401;

/**
 * @dev The merkle proof is too large to be verified according.
 *      There is a proof's size limit defined in the MerkleProofCalldataWithNodes.
 *      It cannot become valid with the current merkle proof and root.
 */
uint256 constant MERKLE_PROOF_PROOF_TOO_LARGE = 402;

/**
 * @dev The signature's length is invalid.
 *      The signature's length must be either 64 or 65 bytes.
 *      This maker order will never be valid.
 */
uint256 constant INVALID_SIGNATURE_LENGTH = 411;

/**
 * @dev The signature's s parameter is invalid.
 *      This maker order will never be valid.
 */
uint256 constant INVALID_S_PARAMETER_EOA = 412;

/**
 * @dev The signature's v parameter is invalid.
 *      It must be either equal to 27 or 28.
 *      This maker order will never be valid with this signature.
 */
uint256 constant INVALID_V_PARAMETER_EOA = 413;

/**
 * @dev The signer recovered (using ecrecover) is the null address.
 *      This maker order will never be valid with this signature.
 */
uint256 constant NULL_SIGNER_EOA = 414;

/**
 * @dev The recovered signer is not the target signer.
 *      This maker order will never be valid with this signature.
 */
uint256 constant INVALID_SIGNER_EOA = 415;

/**
 * @dev The signature is generated by a EIP1271 signer contract but the
 *      contract does not implement the required function to verify the signature.
 */
uint256 constant MISSING_IS_VALID_SIGNATURE_FUNCTION_EIP1271 = 421;

/**
 * @dev The signature by the EIP1271 signer contract is invalid.
 *      This maker order may become valid again depending on the implementation of the
 *      contract signing the order.
 */
uint256 constant SIGNATURE_INVALID_EIP1271 = 422;

/**
 * 5. Timestamp-related codes
 */

/**
 * @dev The start time is greater than the end time.
 *      This maker order will never be valid.
 */
uint256 constant START_TIME_GREATER_THAN_END_TIME = 501;

/**
 * @dev The block time is greater than the end time.
 *      This maker order will never be valid.
 */
uint256 constant TOO_LATE_TO_EXECUTE_ORDER = 502;

/**
 * @dev The block time is earlier than the start time.
 *      A buffer of 5 minutes is included for orders that are about to be valid.
 *      This maker order will become valid without any user action.
 */
uint256 constant TOO_EARLY_TO_EXECUTE_ORDER = 503;

/**
 * 6. Transfer-related (ERC20, ERC721, ERC1155, Hypercert tokens), including transfers and approvals, codes.
 */

/**
 * @dev The same itemId is twice in the bundle.
 *      This maker order can be valid for ERC1155 collections but will never be valid for ERC721.
 */
uint256 constant SAME_ITEM_ID_IN_BUNDLE = 601;

/**
 * @dev The ERC20 balance of the signer (maker bid user) is inferior to the order bid price.
 *      This maker order can become valid without any user's action.
 */
uint256 constant ERC20_BALANCE_INFERIOR_TO_PRICE = 611;

/**
 * @dev The ERC20 approval amount of the signer (maker bid user) is inferior to the order bid price.
 *      This maker order can become valid only with the user's action.
 */
uint256 constant ERC20_APPROVAL_INFERIOR_TO_PRICE = 612;

/**
 * @dev The ERC721 itemId does not exist.
 *      This maker order can become valid if the item is created later.
 */
uint256 constant ERC721_ITEM_ID_DOES_NOT_EXIST = 621;

/**
 * @dev The ERC721 itemId is not owned by the signer (maker ask user).
 *      This maker order can become valid without any user's action.
 */
uint256 constant ERC721_ITEM_ID_NOT_IN_BALANCE = 622;

/**
 * @dev The transfer manager contract has not been approved by the ERC721 collection
 *      contract, either for the entire collection or the itemId.
 *      This maker order can become valid only with the user's action.
 *      The collection may not follow the ERC721 standard.
 */
uint256 constant ERC721_NO_APPROVAL_FOR_ALL_OR_ITEM_ID = 623;

/**
 * @dev The ERC1155 collection contract does not implement balanceOf.
 */
uint256 constant ERC1155_BALANCE_OF_DOES_NOT_EXIST = 631;

/**
 * @dev The ERC20 balance of the signer (maker ask user) is inferior to the amount
 *      required to be sold.
 *      This maker order can become valid without any user's action.
 */
uint256 constant ERC1155_BALANCE_OF_ITEM_ID_INFERIOR_TO_AMOUNT = 632;

/**
 * @dev The ERC1155 collection contract does not implement isApprovedForAll.
 *      The collection may not follow the ERC1155 standard.
 */
uint256 constant ERC1155_IS_APPROVED_FOR_ALL_DOES_NOT_EXIST = 633;

/**
 * @dev The transfer manager contract has not been approved by the ERC1155
 *      collection contract.
 *      This maker order can become valid only with the user's action.
 */
uint256 constant ERC1155_NO_APPROVAL_FOR_ALL = 634;

/*
 * @dev The Hypercert collaction does not support ownerOf.
 *      This maker order can become valid without any user's action.
 */
uint256 constant HYPERCERT_OWNER_OF_DOES_NOT_EXIST = 641;

/*
 * @dev The Hypercert fractionId is not owned by the signer (maker ask user).
 *      This maker order can become valid without any user's action.
 */
uint256 constant HYPERCERT_FRACTION_NOT_HELD_BY_USER = 642;

/**
 * 7. Asset-type codes
 */

/**
 * @dev The collection type specified in the order seems incorrect.
 *      It is expected to be collectionType = 0.
 */
uint256 constant POTENTIAL_INVALID_COLLECTION_TYPE_SHOULD_BE_ERC721 = 701;

/**
 * @dev The collection type specified in the order seems incorrect.
 *      It is expected to be collectionType = 1.
 */
uint256 constant POTENTIAL_INVALID_COLLECTION_TYPE_SHOULD_BE_ERC1155 = 702;

/**
 * @dev The collection type specified in the order seems incorrect.
 *      It is expected to be collectionType = 2.
 */
uint256 constant POTENTIAL_INVALID_COLLECTION_TYPE_SHOULD_BE_HYPERCERT = 703;

/**
 * 8. Transfer manager-related codes
 */

/**
 * @dev The user has not approved the protocol to transfer NFTs on behalf
 *      of the user.
 *      This maker order can become valid only with the user's action.
 */
uint256 constant NO_TRANSFER_MANAGER_APPROVAL_BY_USER_FOR_EXCHANGE = 801;

/**
 * @dev The transfer manager's owner has revoked the ability to transfer NFTs
 *      on behalf of all users that have also approved the protocol.
 *      This maker order can become valid again only with owner action.
 */
uint256 constant TRANSFER_MANAGER_APPROVAL_REVOKED_BY_OWNER_FOR_EXCHANGE = 802;

/**
 * 9. Creator fee-related codes
 */

/**
 * @dev The collection contract has a flexible royalty fee structure that
 *      prevents this bundle to be traded.
 *      It applies at the protocol level.
 *      For instance, 2 items in a bundle have different creator recipients.
 */
uint256 constant BUNDLE_ERC2981_NOT_SUPPORTED = 901;

/**
 * @dev The creator fee applied at the protocol is higher than the threshold
 *      allowed. The transaction will revert.
 *      It applies at the protocol level.
 *      This maker order can become valid only with the creator's action.
 */
uint256 constant CREATOR_FEE_TOO_HIGH = 902;
