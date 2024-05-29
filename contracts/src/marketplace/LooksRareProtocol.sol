// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// LooksRare unopinionated libraries
import {SignatureCheckerCalldata} from "@looksrare/contracts-libs/contracts/SignatureCheckerCalldata.sol";
import {LowLevelETHReturnETHIfAnyExceptOneWei} from
    "@looksrare/contracts-libs/contracts/lowLevelCallers/LowLevelETHReturnETHIfAnyExceptOneWei.sol";
import {LowLevelWETH} from "@looksrare/contracts-libs/contracts/lowLevelCallers/LowLevelWETH.sol";
import {LowLevelERC20Transfer} from "@looksrare/contracts-libs/contracts/lowLevelCallers/LowLevelERC20Transfer.sol";

// OpenZeppelin's library (adjusted) for verifying Merkle proofs
import {MerkleProofCalldataWithNodes} from "./libraries/OpenZeppelin/MerkleProofCalldataWithNodes.sol";

// Libraries
import {OrderStructs} from "./libraries/OrderStructs.sol";

// Interfaces
import {ILooksRareProtocol} from "./interfaces/ILooksRareProtocol.sol";
import {IHypercert1155Token} from "./interfaces/IHypercert1155Token.sol";

// Shared errors
import {
    CallerInvalid,
    CurrencyInvalid,
    LengthsInvalid,
    MerkleProofInvalid,
    MerkleProofTooLarge,
    QuoteTypeInvalid
} from "./errors/SharedErrors.sol";
import {UnitAmountInvalid} from "./errors/HypercertErrors.sol";

// Direct dependencies
import {TransferSelectorNFT} from "./TransferSelectorNFT.sol";
import {BatchOrderTypehashRegistry} from "./BatchOrderTypehashRegistry.sol";

// Constants
import {MAX_CALLDATA_PROOF_LENGTH, ONE_HUNDRED_PERCENT_IN_BP} from "./constants/NumericConstants.sol";

// Enums
import {QuoteType} from "./enums/QuoteType.sol";
import {CollectionType} from "./enums/CollectionType.sol";

// Strategies
import {StrategyHypercertFractionOffer} from "./executionStrategies/StrategyHypercertFractionOffer.sol";

/**
 * @title LooksRareProtocol
 * @notice This contract is the core smart contract of the LooksRare protocol ("v2").
 *         It is the main entry point for users to initiate transactions with taker orders
 *         and manage the cancellation of maker orders, which exist off-chain.
 *                                                ~~~~~~
 *                                              ~~~~  ~~~~
 *                                             ~~~      ~~~
 *                                            ~~~        ~~~
 *                                           ~~~          ~~~
 *                      ~~~~~~~~~           ~~~            ~~~           ~~~~~~~~~
 *                     ~~~    ~~~~~~~~~   ~~~~              ~~~~   ~~~~~~~~~    ~~~
 *                     ~~~           ~~~~~~~                  ~~~~~~~           ~~~
 *                     ~~~-                      ~~~~~~~~                      ~~~~
 *                      ~~~                    ~~~~    ~~~~                    ~~~
 *                       ~~~         ~~~~~~~~~~~~        ~~~~~~~~~~~~         ~~~
 *                        ~~~      ~~~~~~~~~~~              ~~~~~~~~~~~      ~~~
 *                        ~~~      ~~~                              ~~~     ~~~
 *                         ~~~     ~~~          ~~~~~~~~~~          ~~~     ~~~
 *                      ~~~~~      ~~~      ~~~~~~      ~~~~~~      ~~~      ~~~~~
 *                 ~~~~~~~        ~~~      ~~~              ~~~      ~~~        ~~~~~~~
 *             ~~~~~~           ~~~~      ~~~                ~~~      ~~~~           ~~~~~~
 *           ~~~~             ~~~        ~~~                  ~~~        ~~~             ~~~~
 *          ~~~              ~~~         ~~~                  ~~~         ~~~              ~~~
 *           ~~~~             ~~~        ~~~                  ~~~        ~~~             ~~~~
 *             ~~~~~~           ~~~~      ~~~                ~~~      ~~~~~          ~~~~~~
 *                 ~~~~~~~        ~~~      ~~~              ~~~      ~~~        ~~~~~~~
 *                      ~~~~~      ~~~      ~~~~~~      ~~~~~~      ~~~      ~~~~~
 *                         ~~~     ~~~          ~~~~~~~~~~          ~~~     ~~~
 *                         ~~      ~~~                              ~~~     ~~~
 *                        ~~~      ~~~~~~~~~~~              ~~~~~~~~~~~      ~~~
 *                       ~~~         ~~~~~~~~~~~~        ~~~~~~~~~~~~         ~~~
 *                      ~~~                    ~~~~    ~~~~                    ~~~
 *                     ~~~~                      ~~~~~~~~                      ~~~~
 *                     ~~~           ~~~~~~~                  ~~~~~~~           ~~~
 *                     ~~~     ~~~~~~~~   ~~~~              ~~~~   ~~~~~~~~     ~~~
 *                      ~~~~~~~~~           ~~~            ~~~           ~~~~~~~~~
 *                                           ~~~          ~~~
 *                                            ~~~        ~~~
 *                                             ~~~      ~~~
 *                                              ~~~~  ~~~~
 *                                                ~~~~~~
 * @author LooksRare protocol team (👀,💎); bitbeckers
 */
contract LooksRareProtocol is
    ILooksRareProtocol,
    TransferSelectorNFT,
    LowLevelETHReturnETHIfAnyExceptOneWei,
    LowLevelWETH,
    LowLevelERC20Transfer,
    BatchOrderTypehashRegistry
{
    using OrderStructs for OrderStructs.Maker;

    /**
     * @notice Wrapped ETH.
     */
    address public immutable WETH;

    /**
     * @notice Current chainId.
     */
    uint256 public chainId;

    /**
     * @notice Current domain separator.
     */
    bytes32 public domainSeparator;

    /**
     * @notice This variable is used as the gas limit for a ETH transfer.
     *         If a standard ETH transfer fails within this gas limit, ETH will get wrapped to WETH
     *         and transferred to the initial recipient.
     */
    uint256 private _gasLimitETHTransfer = 2300;

    /**
     * @notice Constructor
     * @param _owner Owner address
     * @param _protocolFeeRecipient Protocol fee recipient address
     * @param _transferManager Transfer manager address
     * @param _weth Wrapped ETH address
     */
    constructor(address _owner, address _protocolFeeRecipient, address _transferManager, address _weth)
        TransferSelectorNFT(_owner, _protocolFeeRecipient, _transferManager)
    {
        _updateDomainSeparator();
        WETH = _weth;
    }

    /**
     * @inheritdoc ILooksRareProtocol
     */
    function executeTakerAsk(
        OrderStructs.Taker calldata takerAsk,
        OrderStructs.Maker calldata makerBid,
        bytes calldata makerSignature,
        OrderStructs.MerkleTree calldata merkleTree
    ) external nonReentrant {
        address currency = makerBid.currency;

        // Verify whether the currency is allowed and is not ETH (address(0))
        if (!isCurrencyAllowed[currency] || currency == address(0)) {
            revert CurrencyInvalid();
        }

        address signer = makerBid.signer;
        bytes32 orderHash = makerBid.hash();
        _verifyMerkleProofOrOrderHash(merkleTree, orderHash, makerSignature, signer);

        // Execute the transaction and fetch protocol fee amount
        uint256 totalProtocolFeeAmount = _executeTakerAsk(takerAsk, makerBid, orderHash);

        // Pay protocol fee (and affiliate fee if any)
        _payProtocolFeeAndAffiliateFee(currency, signer, totalProtocolFeeAmount);
    }

    /**
     * @inheritdoc ILooksRareProtocol
     */
    function executeTakerBid(
        OrderStructs.Taker calldata takerBid,
        OrderStructs.Maker calldata makerAsk,
        bytes calldata makerSignature,
        OrderStructs.MerkleTree calldata merkleTree
    ) external payable nonReentrant {
        address currency = makerAsk.currency;

        // Verify whether the currency is allowed for trading.
        if (!isCurrencyAllowed[currency]) {
            revert CurrencyInvalid();
        }

        bytes32 orderHash = makerAsk.hash();
        _verifyMerkleProofOrOrderHash(merkleTree, orderHash, makerSignature, makerAsk.signer);

        // Execute the transaction and fetch protocol fee amount
        uint256 totalProtocolFeeAmount = _executeTakerBid(takerBid, makerAsk, msg.sender, orderHash);

        // Pay protocol fee amount
        _payProtocolFeeAndAffiliateFee(currency, msg.sender, totalProtocolFeeAmount);

        // Return ETH if any
        _returnETHIfAnyWithOneWeiLeft();
    }

    /**
     * @inheritdoc ILooksRareProtocol
     */
    function executeMultipleTakerBids(
        OrderStructs.Taker[] calldata takerBids,
        OrderStructs.Maker[] calldata makerAsks,
        bytes[] calldata makerSignatures,
        OrderStructs.MerkleTree[] calldata merkleTrees,
        bool isAtomic
    ) external payable nonReentrant {
        uint256 length = takerBids.length;
        if (
            length == 0
                || (makerAsks.length ^ length) | (makerSignatures.length ^ length) | (merkleTrees.length ^ length) != 0
        ) {
            revert LengthsInvalid();
        }

        // Verify whether the currency at index = 0 is allowed for trading
        address currency = makerAsks[0].currency;
        if (!isCurrencyAllowed[currency]) {
            revert CurrencyInvalid();
        }

        {
            // Initialize protocol fee amount
            uint256 totalProtocolFeeAmount;

            // If atomic, it uses the executeTakerBid function.
            // If not atomic, it uses a catch/revert pattern with external function.
            if (isAtomic) {
                for (uint256 i; i < length;) {
                    OrderStructs.Maker calldata makerAsk = makerAsks[i];

                    // Verify the currency is the same
                    if (i != 0) {
                        if (makerAsk.currency != currency) {
                            revert CurrencyInvalid();
                        }
                    }

                    OrderStructs.Taker calldata takerBid = takerBids[i];
                    bytes32 orderHash = makerAsk.hash();

                    {
                        _verifyMerkleProofOrOrderHash(merkleTrees[i], orderHash, makerSignatures[i], makerAsk.signer);

                        // Execute the transaction and add protocol fee
                        totalProtocolFeeAmount += _executeTakerBid(takerBid, makerAsk, msg.sender, orderHash);

                        unchecked {
                            ++i;
                        }
                    }
                }
            } else {
                for (uint256 i; i < length;) {
                    OrderStructs.Maker calldata makerAsk = makerAsks[i];

                    // Verify the currency is the same
                    if (i != 0) {
                        if (makerAsk.currency != currency) {
                            revert CurrencyInvalid();
                        }
                    }

                    OrderStructs.Taker calldata takerBid = takerBids[i];
                    bytes32 orderHash = makerAsk.hash();

                    {
                        _verifyMerkleProofOrOrderHash(merkleTrees[i], orderHash, makerSignatures[i], makerAsk.signer);

                        try this.restrictedExecuteTakerBid(takerBid, makerAsk, msg.sender, orderHash) returns (
                            uint256 protocolFeeAmount
                        ) {
                            totalProtocolFeeAmount += protocolFeeAmount;
                        } catch {}

                        unchecked {
                            ++i;
                        }
                    }
                }
            }

            // Pay protocol fee (and affiliate fee if any)
            _payProtocolFeeAndAffiliateFee(currency, msg.sender, totalProtocolFeeAmount);
        }

        // Return ETH if any
        _returnETHIfAnyWithOneWeiLeft();
    }

    /**
     * @notice This function is used to do a non-atomic matching in the context of a batch taker bid.
     * @param takerBid Taker bid struct
     * @param makerAsk Maker ask struct
     * @param sender Sender address (i.e. the initial msg sender)
     * @param orderHash Hash of the maker ask order
     * @return protocolFeeAmount Protocol fee amount
     * @dev This function is only callable by this contract. It is used for non-atomic batch order matching.
     */
    function restrictedExecuteTakerBid(
        OrderStructs.Taker calldata takerBid,
        OrderStructs.Maker calldata makerAsk,
        address sender,
        bytes32 orderHash
    ) external returns (uint256 protocolFeeAmount) {
        if (msg.sender != address(this)) {
            revert CallerInvalid();
        }

        protocolFeeAmount = _executeTakerBid(takerBid, makerAsk, sender, orderHash);
    }

    /**
     * @notice This function allows the owner to update the domain separator (if possible).
     * @dev Only callable by owner. If there is a fork of the network with a new chainId,
     *      it allows the owner to reset the domain separator for the new chain id.
     */
    function updateDomainSeparator() external onlyOwner {
        if (block.chainid != chainId) {
            _updateDomainSeparator();
            emit NewDomainSeparator();
        } else {
            revert SameDomainSeparator();
        }
    }

    /**
     * @notice This function allows the owner to update the maximum ETH gas limit for a standard transfer.
     * @param newGasLimitETHTransfer New gas limit for ETH transfer
     * @dev Only callable by owner.
     */
    function updateETHGasLimitForTransfer(uint256 newGasLimitETHTransfer) external onlyOwner {
        if (newGasLimitETHTransfer < 2300) {
            revert NewGasLimitETHTransferTooLow();
        }

        _gasLimitETHTransfer = newGasLimitETHTransfer;

        emit NewGasLimitETHTransfer(newGasLimitETHTransfer);
    }

    /**
     * @notice This function is internal and is used to execute a taker ask (against a maker bid).
     * @param takerAsk Taker ask order struct
     * @param makerBid Maker bid order struct
     * @param orderHash Hash of the maker bid order
     * @return protocolFeeAmount Protocol fee amount
     */
    function _executeTakerAsk(
        OrderStructs.Taker calldata takerAsk,
        OrderStructs.Maker calldata makerBid,
        bytes32 orderHash
    ) internal returns (uint256) {
        if (makerBid.quoteType != QuoteType.Bid) {
            revert QuoteTypeInvalid();
        }

        address signer = makerBid.signer;
        {
            bytes32 userOrderNonceStatus = userOrderNonce[signer][makerBid.orderNonce];
            // Verify nonces
            if (
                userBidAskNonces[signer].bidNonce != makerBid.globalNonce
                    || userSubsetNonce[signer][makerBid.subsetNonce]
                    || (userOrderNonceStatus != bytes32(0) && userOrderNonceStatus != orderHash)
            ) {
                revert NoncesInvalid();
            }
        }

        (
            uint256[] memory itemIds,
            uint256[] memory amounts,
            address[2] memory recipients,
            uint256[3] memory feeAmounts,
            bool isNonceInvalidated
        ) = _executeStrategyForTakerOrder(takerAsk, makerBid, msg.sender);

        uint256 unitsHeldByItems;
        if (makerBid.collectionType == CollectionType.Hypercert) {
            unitsHeldByItems += _getUnitsHeldByHypercertFractions(makerBid.collection, itemIds);
        }

        // Order nonce status is updated
        _updateUserOrderNonce(isNonceInvalidated, signer, makerBid.orderNonce, orderHash);

        // Taker action goes first
        _executeTakerAskTakerAction(makerBid, takerAsk, msg.sender, signer, itemIds, amounts);

        if (makerBid.collectionType == CollectionType.Hypercert) {
            // If not a fractional sale
            if (
                strategyInfo[makerBid.strategyId].selector
                    != StrategyHypercertFractionOffer.executeHypercertFractionStrategyWithTakerBid.selector
                    && strategyInfo[makerBid.strategyId].selector
                        != StrategyHypercertFractionOffer.executeHypercertFractionStrategyWithTakerBidWithAllowlist.selector
            ) {
                if (_getUnitsHeldByHypercertFractions(makerBid.collection, itemIds) != unitsHeldByItems) {
                    revert UnitAmountInvalid();
                }
            }
        }

        // Maker action goes second
        _transferToAskRecipientAndCreatorIfAny(recipients, feeAmounts, makerBid.currency, signer);

        emit TakerAsk(
            NonceInvalidationParameters({
                orderHash: orderHash,
                orderNonce: makerBid.orderNonce,
                isNonceInvalidated: isNonceInvalidated
            }),
            msg.sender,
            signer,
            makerBid.strategyId,
            makerBid.currency,
            makerBid.collection,
            itemIds,
            amounts,
            recipients,
            feeAmounts
        );

        // It returns the protocol fee amount
        return feeAmounts[2];
    }

    /**
     * @notice This function is internal and is used to execute a taker bid (against a maker ask).
     * @param takerBid Taker bid order struct
     * @param makerAsk Maker ask order struct
     * @param sender Sender of the transaction (i.e. msg.sender)
     * @param orderHash Hash of the maker ask order
     * @return protocolFeeAmount Protocol fee amount
     */
    function _executeTakerBid(
        OrderStructs.Taker calldata takerBid,
        OrderStructs.Maker calldata makerAsk,
        address sender,
        bytes32 orderHash
    ) internal returns (uint256) {
        if (makerAsk.quoteType != QuoteType.Ask) {
            revert QuoteTypeInvalid();
        }

        {
            // Verify nonces
            bytes32 userOrderNonceStatus = userOrderNonce[makerAsk.signer][makerAsk.orderNonce];

            if (
                userBidAskNonces[makerAsk.signer].askNonce != makerAsk.globalNonce
                    || userSubsetNonce[makerAsk.signer][makerAsk.subsetNonce]
                    || (userOrderNonceStatus != bytes32(0) && userOrderNonceStatus != orderHash)
            ) {
                revert NoncesInvalid();
            }
        }

        (
            uint256[] memory itemIds,
            uint256[] memory amounts,
            address[2] memory recipients,
            uint256[3] memory feeAmounts,
            bool isNonceInvalidated
        ) = _executeStrategyForTakerOrder(takerBid, makerAsk, msg.sender);

        uint256 unitsHeldByItems;
        if (makerAsk.collectionType == CollectionType.Hypercert) {
            unitsHeldByItems += _getUnitsHeldByHypercertFractions(makerAsk.collection, itemIds);
        }

        // Order nonce status is updated
        _updateUserOrderNonce(isNonceInvalidated, makerAsk.signer, makerAsk.orderNonce, orderHash);

        // Taker action goes first
        _transferToAskRecipientAndCreatorIfAny(recipients, feeAmounts, makerAsk.currency, sender);

        if (makerAsk.collectionType == CollectionType.Hypercert) {
            // If not a fractional sale
            if (
                strategyInfo[makerAsk.strategyId].selector
                    != StrategyHypercertFractionOffer.executeHypercertFractionStrategyWithTakerBid.selector
                    && strategyInfo[makerAsk.strategyId].selector
                        != StrategyHypercertFractionOffer.executeHypercertFractionStrategyWithTakerBidWithAllowlist.selector
            ) {
                if (_getUnitsHeldByHypercertFractions(makerAsk.collection, itemIds) != unitsHeldByItems) {
                    revert UnitAmountInvalid();
                }
            }
        }

        // Maker action goes second
        _executeTakerBidMakerAction(makerAsk, takerBid, makerAsk.signer, sender, itemIds, amounts);

        emit TakerBid(
            NonceInvalidationParameters({
                orderHash: orderHash,
                orderNonce: makerAsk.orderNonce,
                isNonceInvalidated: isNonceInvalidated
            }),
            sender,
            takerBid.recipient == address(0) ? sender : takerBid.recipient,
            makerAsk.strategyId,
            makerAsk.currency,
            makerAsk.collection,
            itemIds,
            amounts,
            recipients,
            feeAmounts
        );

        // It returns the protocol fee amount
        return feeAmounts[2];
    }

    function _executeTakerAskTakerAction(
        OrderStructs.Maker calldata makerBid,
        OrderStructs.Taker calldata, /* takerAsk */
        address sender,
        address recipient,
        uint256[] memory itemIds,
        uint256[] memory amounts
    ) internal {
        if (makerBid.collectionType == CollectionType.Hypercert) {
            _transferHypercertFraction(
                makerBid.collection, makerBid.collectionType, makerBid.strategyId, sender, recipient, itemIds, amounts
            );
        } else {
            _transferNFT(makerBid.collection, makerBid.collectionType, sender, recipient, itemIds, amounts);
        }
    }

    function _executeTakerBidMakerAction(
        OrderStructs.Maker calldata makerAsk,
        OrderStructs.Taker calldata takerBid,
        address sender,
        address recipient,
        uint256[] memory itemIds,
        uint256[] memory amounts
    ) internal {
        if (makerAsk.collectionType == CollectionType.Hypercert) {
            _transferHypercertFraction(
                makerAsk.collection,
                makerAsk.collectionType,
                makerAsk.strategyId,
                sender,
                takerBid.recipient == address(0) ? recipient : takerBid.recipient,
                itemIds,
                amounts
            );
        } else {
            _transferNFT(
                makerAsk.collection,
                makerAsk.collectionType,
                sender,
                takerBid.recipient == address(0) ? recipient : takerBid.recipient,
                itemIds,
                amounts
            );
        }
    }

    /**
     * @notice This function is internal and is used to pay the protocol fee and affiliate fee (if any).
     * @param currency Currency address to transfer (address(0) is ETH)
     * @param bidUser Bid user address
     * @param totalProtocolFeeAmount Total protocol fee amount (denominated in the currency)
     */
    function _payProtocolFeeAndAffiliateFee(address currency, address bidUser, uint256 totalProtocolFeeAmount)
        internal
    {
        if (totalProtocolFeeAmount != 0) {
            // Transfer remaining protocol fee to the protocol fee recipient
            _transferFungibleTokens(currency, bidUser, protocolFeeRecipient, totalProtocolFeeAmount);
        }
    }

    /**
     * @notice This function is internal and is used to transfer fungible tokens.
     * @param currency Currency address
     * @param sender Sender address
     * @param recipient Recipient address
     * @param amount Amount (in fungible tokens)
     */
    function _transferFungibleTokens(address currency, address sender, address recipient, uint256 amount) internal {
        if (currency == address(0)) {
            _transferETHAndWrapIfFailWithGasLimit(WETH, recipient, amount, _gasLimitETHTransfer);
        } else {
            _executeERC20TransferFrom(currency, sender, recipient, amount);
        }
    }

    /**
     * @notice This function is private and used to transfer funds to
     *         (1) creator recipient (if any)
     *         (2) ask recipient.
     * @param recipients Recipient addresses
     * @param feeAmounts Fees
     * @param currency Currency address
     * @param bidUser Bid user address
     * @dev It does not send to the 0-th element in the array since it is the protocol fee,
     *      which is paid later in the execution flow.
     */
    function _transferToAskRecipientAndCreatorIfAny(
        address[2] memory recipients,
        uint256[3] memory feeAmounts,
        address currency,
        address bidUser
    ) private {
        // @dev There is no check for address(0) since the ask recipient can never be address(0)
        // If ask recipient is the maker --> the signer cannot be the null address
        // If ask is the taker --> either it is the sender address or
        // if the recipient (in TakerAsk) is set to address(0), it is adjusted to the original taker address
        uint256 sellerProceed = feeAmounts[0];
        if (sellerProceed != 0) {
            _transferFungibleTokens(currency, bidUser, recipients[0], sellerProceed);
        }

        // @dev There is no check for address(0), if the creator recipient is address(0), the fee is set to 0
        uint256 creatorFeeAmount = feeAmounts[1];
        if (creatorFeeAmount != 0) {
            _transferFungibleTokens(currency, bidUser, recipients[1], creatorFeeAmount);
        }
    }

    /**
     * @notice This function is private and used to compute the domain separator and store the current chain id.
     */
    function _updateDomainSeparator() private {
        domainSeparator = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256("LooksRareProtocol"),
                keccak256(bytes("2")),
                block.chainid,
                address(this)
            )
        );
        chainId = block.chainid;
    }

    /**
     * @notice This function is internal and is called during the execution of a transaction to decide
     *         how to map the user's order nonce.
     * @param isNonceInvalidated Whether the nonce is being invalidated
     * @param signer Signer address
     * @param orderNonce Maker user order nonce
     * @param orderHash Hash of the order struct
     * @dev If isNonceInvalidated is true, this function invalidates the user order nonce for future execution.
     *      If it is equal to false, this function maps the order hash for this user order nonce
     *      to prevent other order structs sharing the same order nonce to be executed.
     */
    function _updateUserOrderNonce(bool isNonceInvalidated, address signer, uint256 orderNonce, bytes32 orderHash)
        private
    {
        userOrderNonce[signer][orderNonce] = (isNonceInvalidated ? MAGIC_VALUE_ORDER_NONCE_EXECUTED : orderHash);
    }

    /**
     * @notice This function is private and used to verify the chain id, compute the digest, and verify the signature.
     * @dev If chainId is not equal to the cached chain id, it would revert.
     * @param computedHash Hash of order (maker bid or maker ask) or merkle root
     * @param makerSignature Signature of the maker
     * @param signer Signer address
     */
    function _computeDigestAndVerify(bytes32 computedHash, bytes calldata makerSignature, address signer)
        private
        view
    {
        if (chainId == block.chainid) {
            // \x19\x01 is the standard encoding prefix
            SignatureCheckerCalldata.verify(
                keccak256(abi.encodePacked("\x19\x01", domainSeparator, computedHash)), signer, makerSignature
            );
        } else {
            revert ChainIdInvalid();
        }
    }

    /**
     * @notice This function is private and called to verify whether the merkle proofs provided for the order hash
     *         are correct or verify the order hash if the order is not part of a merkle tree.
     * @param merkleTree Merkle tree
     * @param orderHash Order hash (can be maker bid hash or maker ask hash)
     * @param signature Maker order signature
     * @param signer Maker address
     * @dev It verifies (1) merkle proof (if necessary) (2) signature is from the expected signer
     */
    function _verifyMerkleProofOrOrderHash(
        OrderStructs.MerkleTree calldata merkleTree,
        bytes32 orderHash,
        bytes calldata signature,
        address signer
    ) private view {
        uint256 proofLength = merkleTree.proof.length;

        if (proofLength != 0) {
            if (proofLength > MAX_CALLDATA_PROOF_LENGTH) {
                revert MerkleProofTooLarge(proofLength);
            }

            if (!MerkleProofCalldataWithNodes.verifyCalldata(merkleTree.proof, merkleTree.root, orderHash)) {
                revert MerkleProofInvalid();
            }

            orderHash = hashBatchOrder(merkleTree.root, proofLength);
        }

        _computeDigestAndVerify(orderHash, signature, signer);
    }

    function _getUnitsHeldByHypercertFractions(address collection, uint256[] memory itemIds)
        public
        view
        returns (uint256 unitsHeldByItems)
    {
        for (uint256 i; i < itemIds.length;) {
            unitsHeldByItems += IHypercert1155Token(collection).unitsOf(itemIds[i]);

            unchecked {
                ++i;
            }
        }
    }
}
