// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Libraries
import {OrderStructs} from "../libraries/OrderStructs.sol";

/**
 * @title ILooksRareProtocol
 * @author LooksRare protocol team (👀,💎)
 */
interface ILooksRareProtocol {
    /**
     * @notice This struct contains an order nonce's invalidation status
     *         and the order hash that triggered the status change.
     * @param orderHash Maker order hash
     * @param orderNonce Order nonce
     * @param isNonceInvalidated Whether this transaction invalidated the maker user's order nonce at the protocol level
     */
    struct NonceInvalidationParameters {
        bytes32 orderHash;
        uint256 orderNonce;
        bool isNonceInvalidated;
    }

    /**
     * @notice It is emitted if there is a change in the domain separator.
     */
    event NewDomainSeparator();

    /**
     * @notice It is emitted when there is a new gas limit for a ETH transfer (before it is wrapped to WETH).
     * @param gasLimitETHTransfer Gas limit for an ETH transfer
     */
    event NewGasLimitETHTransfer(uint256 gasLimitETHTransfer);

    /**
     * @notice It is emitted when a taker ask transaction is completed.
     * @param nonceInvalidationParameters Struct about nonce invalidation parameters
     * @param askUser Address of the ask user
     * @param bidUser Address of the bid user
     * @param strategyId Id of the strategy
     * @param currency Address of the currency
     * @param collection Address of the collection
     * @param itemIds Array of item ids
     * @param amounts Array of amounts (for item ids)
     * @param feeRecipients Array of fee recipients
     *        feeRecipients[0] User who receives the proceeds of the sale (it can be the taker ask user or different)
     *        feeRecipients[1] Creator fee recipient (if none, address(0))
     * @param feeAmounts Array of fee amounts
     *        feeAmounts[0] Fee amount for the user receiving sale proceeds
     *        feeAmounts[1] Creator fee amount
     *        feeAmounts[2] Protocol fee amount prior to adjustment for a potential affiliate payment
     */
    // maker (receives the NFT)
    // taker (initiates the transaction)
    event TakerAsk(
        NonceInvalidationParameters nonceInvalidationParameters,
        address askUser,
        address bidUser,
        uint256 strategyId,
        address currency,
        address collection,
        uint256[] itemIds,
        uint256[] amounts,
        address[2] feeRecipients,
        uint256[3] feeAmounts
    );

    /**
     * @notice It is emitted when a taker bid transaction is completed.
     * @param nonceInvalidationParameters Struct about nonce invalidation parameters
     * @param bidUser Address of the bid user
     * @param bidRecipient Address of the recipient of the bid
     * @param strategyId Id of the strategy
     * @param currency Address of the currency
     * @param collection Address of the collection
     * @param itemIds Array of item ids
     * @param amounts Array of amounts (for item ids)
     * @param feeRecipients Array of fee recipients
     *        feeRecipients[0] User who receives the proceeds of the sale (it is the maker ask user)
     *        feeRecipients[1] Creator fee recipient (if none, address(0))
     * @param feeAmounts Array of fee amounts
     *        feeAmounts[0] Fee amount for the user receiving sale proceeds
     *        feeAmounts[1] Creator fee amount
     *        feeAmounts[2] Protocol fee amount prior to adjustment for a potential affiliate payment
     */
    // taker (receives the NFT)
    // taker (initiates the transaction)
    event TakerBid(
        NonceInvalidationParameters nonceInvalidationParameters,
        address bidUser,
        address bidRecipient,
        uint256 strategyId,
        address currency,
        address collection,
        uint256[] itemIds,
        uint256[] amounts,
        address[2] feeRecipients,
        uint256[3] feeAmounts
    );

    /**
     * @notice It is returned if the gas limit for a standard ETH transfer is too low.
     */
    error NewGasLimitETHTransferTooLow();

    /**
     * @notice It is returned if the domain separator cannot be updated (i.e. the chainId is the same).
     */
    error SameDomainSeparator();

    /**
     * @notice It is returned if the domain separator should change.
     */
    error ChainIdInvalid();

    /**
     * @notice It is returned if the nonces are invalid.
     */
    error NoncesInvalid();

    /**
     * @notice This function allows a user to execute a taker ask (against a maker bid).
     * @param takerAsk Taker ask struct
     * @param makerBid Maker bid struct
     * @param makerSignature Maker signature
     * @param merkleTree Merkle tree struct (if the signature contains multiple maker orders)
     */
    function executeTakerAsk(
        OrderStructs.Taker calldata takerAsk,
        OrderStructs.Maker calldata makerBid,
        bytes calldata makerSignature,
        OrderStructs.MerkleTree calldata merkleTree
    ) external;

    /**
     * @notice This function allows a user to execute a taker bid (against a maker ask).
     * @param takerBid Taker bid struct
     * @param makerAsk Maker ask struct
     * @param makerSignature Maker signature
     * @param merkleTree Merkle tree struct (if the signature contains multiple maker orders)
     */
    function executeTakerBid(
        OrderStructs.Taker calldata takerBid,
        OrderStructs.Maker calldata makerAsk,
        bytes calldata makerSignature,
        OrderStructs.MerkleTree calldata merkleTree
    ) external payable;

    /**
     * @notice This function allows a user to batch buy with an array of taker bids (against an array of maker asks).
     * @param takerBids Array of taker bid structs
     * @param makerAsks Array of maker ask structs
     * @param makerSignatures Array of maker signatures
     * @param merkleTrees Array of merkle tree structs if the signature contains multiple maker orders
     * @param isAtomic Whether the execution should be atomic
     *        i.e. whether it should revert if 1 or more transactions fail
     */
    function executeMultipleTakerBids(
        OrderStructs.Taker[] calldata takerBids,
        OrderStructs.Maker[] calldata makerAsks,
        bytes[] calldata makerSignatures,
        OrderStructs.MerkleTree[] calldata merkleTrees,
        bool isAtomic
    ) external payable;
}
