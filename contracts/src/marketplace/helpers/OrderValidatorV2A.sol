// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// LooksRare unopinionated libraries
import {IERC165} from "@looksrare/contracts-libs/contracts/interfaces/generic/IERC165.sol";
import {IERC20} from "@looksrare/contracts-libs/contracts/interfaces/generic/IERC20.sol";
import {IERC721} from "@looksrare/contracts-libs/contracts/interfaces/generic/IERC721.sol";
import {IERC1155} from "@looksrare/contracts-libs/contracts/interfaces/generic/IERC1155.sol";
import {IERC1271} from "@looksrare/contracts-libs/contracts/interfaces/generic/IERC1271.sol";

// Libraries
import {OrderStructs} from "../libraries/OrderStructs.sol";
import {MerkleProofCalldataWithNodes} from "../libraries/OpenZeppelin/MerkleProofCalldataWithNodes.sol";

// Interfaces
import {ICreatorFeeManager} from "../interfaces/ICreatorFeeManager.sol";
import {IStrategy} from "../interfaces/IStrategy.sol";
import {IRoyaltyFeeRegistry} from "../interfaces/IRoyaltyFeeRegistry.sol";

// Shared errors
import {OrderInvalid, CollectionTypeInvalid} from "../errors/SharedErrors.sol";

// Other dependencies
import {LooksRareProtocol} from "../LooksRareProtocol.sol";
import {TransferManager} from "../TransferManager.sol";

// Constants
import "../constants/ValidationCodeConstants.sol";
import {MAX_CALLDATA_PROOF_LENGTH, ONE_HUNDRED_PERCENT_IN_BP} from "../constants/NumericConstants.sol";

// Enums
import {CollectionType} from "../enums/CollectionType.sol";
import {QuoteType} from "../enums/QuoteType.sol";

/**
 * @title OrderValidatorV2A
 * @notice This contract is used to check the validity of maker ask/bid orders in the LooksRareProtocol (v2).
 *         It performs checks for:
 *         1. Protocol allowlist issues (i.e. currency or strategy not allowed)
 *         2. Maker order-specific issues (e.g., order invalid due to format or other-strategy specific issues)
 *         3. Nonce related issues (e.g., nonce executed or cancelled)
 *         4. Signature related issues and merkle tree parameters
 *         5. Timestamp related issues (e.g., order expired)
 *         6. Asset-related issues for ERC20/ERC721/ERC1155/Hypercerts (approvals and balances)
 *         7. Collection-type suggestions
 *         8. Transfer manager related issues
 *         9. Creator fee related issues (e.g., creator fee too high, ERC2981 bundles)
 * @dev This version does not handle strategies with partial fills.
 * @author LooksRare protocol team (👀,💎); bitbeckers
 */
contract OrderValidatorV2A {
    using OrderStructs for OrderStructs.Maker;

    /**
     * @notice ERC721 potential interfaceId.
     */
    bytes4 public constant ERC721_INTERFACE_ID_1 = 0x5b5e139f;

    /**
     * @notice ERC721 potential interfaceId.
     */
    bytes4 public constant ERC721_INTERFACE_ID_2 = 0x80ac58cd;

    /**
     * @notice ERC1155 interfaceId.
     */
    bytes4 public constant ERC1155_INTERFACE_ID = 0xd9b67a26;

    /**
     * @notice Hypercert interfaceId
     */
    bytes4 public constant HYPERCERT_INTERFACE_ID = 0xda69bafa;

    /**
     * @notice Magic value nonce returned if executed (or cancelled).
     */
    bytes32 public constant MAGIC_VALUE_ORDER_NONCE_EXECUTED = keccak256("ORDER_NONCE_EXECUTED");

    /**
     * @notice Number of distinct criteria groups checked to evaluate the validity of an order.
     */
    uint256 public constant CRITERIA_GROUPS = 9;

    /**
     * @notice LooksRareProtocol domain separator.
     */
    bytes32 public domainSeparator;

    /**
     * @notice Maximum creator fee (in basis point).
     */
    uint256 public maxCreatorFeeBp;

    /**
     * @notice CreatorFeeManager.
     */
    ICreatorFeeManager public creatorFeeManager;

    /**
     * @notice LooksRareProtocol.
     */
    LooksRareProtocol public looksRareProtocol;

    /**
     * @notice TransferManager
     */
    TransferManager public transferManager;

    /**
     * @notice Constructor
     * @param _looksRareProtocol LooksRare protocol address
     * @dev It derives automatically other external variables such as the creator fee manager and domain separator.
     */
    constructor(address _looksRareProtocol) {
        looksRareProtocol = LooksRareProtocol(_looksRareProtocol);
        transferManager = looksRareProtocol.transferManager();

        _deriveProtocolParameters();
    }

    /**
     * @notice Derive protocol parameters. Anyone can call this function.
     * @dev It allows adjusting if the domain separator or creator fee manager address were to change.
     */
    function deriveProtocolParameters() external {
        _deriveProtocolParameters();
    }

    /**
     * @notice This function verifies the validity of an array of maker orders.
     * @param makerOrders Array of maker orders
     * @param signatures Array of signatures
     * @param merkleTrees Array of merkle trees
     * @return validationCodes Arrays of validation codes
     */
    function checkMultipleMakerOrderValidities(
        OrderStructs.Maker[] calldata makerOrders,
        bytes[] calldata signatures,
        OrderStructs.MerkleTree[] calldata merkleTrees
    ) external view returns (uint256[9][] memory validationCodes) {
        uint256 length = makerOrders.length;

        validationCodes = new uint256[CRITERIA_GROUPS][](length);

        for (uint256 i; i < length;) {
            validationCodes[i] = checkMakerOrderValidity(makerOrders[i], signatures[i], merkleTrees[i]);
            unchecked {
                ++i;
            }
        }
    }

    /**
     * @notice This function verifies the validity of a maker order.
     * @param makerOrder Maker struct
     * @param signature Signature
     * @param merkleTree Merkle tree
     * @return validationCodes Array of validation codes
     */
    function checkMakerOrderValidity(
        OrderStructs.Maker calldata makerOrder,
        bytes calldata signature,
        OrderStructs.MerkleTree calldata merkleTree
    ) public view returns (uint256[9] memory validationCodes) {
        bytes32 orderHash = makerOrder.hash();

        validationCodes[0] =
            _checkValidityCurrencyAndStrategy(makerOrder.quoteType, makerOrder.currency, makerOrder.strategyId);

        // It will exit here if the strategy does not exist.
        // However, if the strategy is implemented but invalid (except if wrong quote type),
        // it can continue the validation process.
        if (validationCodes[0] == STRATEGY_NOT_IMPLEMENTED || validationCodes[0] == STRATEGY_INVALID_QUOTE_TYPE) {
            return validationCodes;
        }

        uint256 validationCode1;
        uint256[] memory itemIds;
        uint256[] memory amounts;
        uint256 price;

        if (makerOrder.quoteType == QuoteType.Ask) {
            (validationCode1, itemIds, amounts, price) = _checkValidityMakerAskItemIdsAndAmountsAndPrice(makerOrder);
        } else {
            (validationCode1, itemIds,, price) = _checkValidityMakerBidItemIdsAndAmountsAndPrice(makerOrder);
        }

        validationCodes[1] = validationCode1;

        validationCodes[2] = _checkValidityNonces(
            makerOrder.quoteType,
            makerOrder.signer,
            makerOrder.globalNonce,
            makerOrder.orderNonce,
            makerOrder.subsetNonce,
            orderHash
        );

        validationCodes[3] = _checkValidityMerkleProofAndOrderHash(merkleTree, orderHash, signature, makerOrder.signer);
        validationCodes[4] = _checkValidityTimestamps(makerOrder.startTime, makerOrder.endTime);

        validationCodes[3] = _checkValidityMerkleProofAndOrderHash(merkleTree, orderHash, signature, makerOrder.signer);
        validationCodes[4] = _checkValidityTimestamps(makerOrder.startTime, makerOrder.endTime);

        if (makerOrder.quoteType == QuoteType.Bid) {
            validationCodes[5] = _checkValidityMakerBidERC20Assets(makerOrder.currency, makerOrder.signer, price);
        } else {
            validationCodes[5] = _checkValidityMakerAskNFTAssets(
                makerOrder.collection, makerOrder.collectionType, makerOrder.signer, itemIds, amounts
            );
        }

        validationCodes[6] = _checkIfPotentialInvalidCollectionTypes(makerOrder.collection, makerOrder.collectionType);

        if (makerOrder.quoteType == QuoteType.Bid) {
            validationCodes[7] = ORDER_EXPECTED_TO_BE_VALID;
        } else {
            validationCodes[7] = _checkValidityTransferManagerApprovals(makerOrder.signer);
        }

        validationCodes[8] = _checkValidityCreatorFee(makerOrder.collection, price, itemIds);
    }

    /**
     * @notice This function is private and is used to adjust the protocol parameters.
     */
    function _deriveProtocolParameters() private {
        domainSeparator = looksRareProtocol.domainSeparator();
        creatorFeeManager = looksRareProtocol.creatorFeeManager();
        maxCreatorFeeBp = looksRareProtocol.maxCreatorFeeBp();
    }

    /**
     * @notice This function is private and verifies the validity of nonces for maker order.
     * @param makerSigner Address of the maker signer
     * @param globalNonce Global nonce
     * @param orderNonce Order nonce
     * @param subsetNonce Subset nonce
     * @param orderHash Order hash
     * @return validationCode Validation code
     */
    function _checkValidityNonces(
        QuoteType quoteType,
        address makerSigner,
        uint256 globalNonce,
        uint256 orderNonce,
        uint256 subsetNonce,
        bytes32 orderHash
    ) private view returns (uint256 validationCode) {
        // 1. Check subset nonce
        if (looksRareProtocol.userSubsetNonce(makerSigner, subsetNonce)) {
            return USER_SUBSET_NONCE_CANCELLED;
        }

        // 2. Check order nonce
        bytes32 orderNonceStatus = looksRareProtocol.userOrderNonce(makerSigner, orderNonce);

        if (orderNonceStatus == MAGIC_VALUE_ORDER_NONCE_EXECUTED) {
            return USER_ORDER_NONCE_EXECUTED_OR_CANCELLED;
        }

        if (orderNonceStatus != bytes32(0) && orderNonceStatus != orderHash) {
            return USER_ORDER_NONCE_IN_EXECUTION_WITH_OTHER_HASH;
        }

        // 3. Check global nonces
        (uint256 globalBidNonce, uint256 globalAskNonce) = looksRareProtocol.userBidAskNonces(makerSigner);

        if (quoteType == QuoteType.Bid && globalNonce != globalBidNonce) {
            return INVALID_USER_GLOBAL_BID_NONCE;
        }
        if (quoteType == QuoteType.Ask && globalNonce != globalAskNonce) {
            return INVALID_USER_GLOBAL_ASK_NONCE;
        }
    }

    /**
     * @notice This function is private and verifies the validity of the currency and strategy.
     * @param quoteType Quote type
     * @param currency Address of the currency
     * @param strategyId Strategy id
     * @return validationCode Validation code
     */
    function _checkValidityCurrencyAndStrategy(QuoteType quoteType, address currency, uint256 strategyId)
        private
        view
        returns (uint256 validationCode)
    {
        // 1. Verify whether the currency is allowed
        if (!looksRareProtocol.isCurrencyAllowed(currency)) {
            return CURRENCY_NOT_ALLOWED;
        }

        if (currency == address(0) && quoteType == QuoteType.Bid) {
            return CURRENCY_NOT_ALLOWED;
        }

        // 2. Verify whether the strategy is valid
        (bool strategyIsActive,,,,, bool strategyIsMakerBid, address strategyImplementation) =
            looksRareProtocol.strategyInfo(strategyId);

        if (strategyId != 0 && strategyImplementation == address(0)) {
            return STRATEGY_NOT_IMPLEMENTED;
        }

        if (strategyId != 0) {
            if (
                (strategyIsMakerBid && quoteType != QuoteType.Bid)
                    || (!strategyIsMakerBid && quoteType != QuoteType.Ask)
            ) {
                return STRATEGY_INVALID_QUOTE_TYPE;
            }
        }

        if (!strategyIsActive) {
            return STRATEGY_NOT_ACTIVE;
        }
    }

    /**
     * @notice This function verifies the validity for order timestamps.
     * @param startTime Start time
     * @param endTime End time
     * @return validationCode Validation code
     */
    function _checkValidityTimestamps(uint256 startTime, uint256 endTime)
        private
        view
        returns (uint256 validationCode)
    {
        // @dev It is possible for startTime to be equal to endTime.
        // If so, the execution only succeeds when the startTime = endTime = block.timestamp.
        // For order invalidation, if the call succeeds, it is already too late for later execution since the
        // next block will have a greater timestamp than the current one.
        if (startTime >= endTime) {
            return START_TIME_GREATER_THAN_END_TIME;
        }

        if (endTime <= block.timestamp) {
            return TOO_LATE_TO_EXECUTE_ORDER;
        }
        if (startTime >= block.timestamp + 5 minutes) {
            return TOO_EARLY_TO_EXECUTE_ORDER;
        }
    }

    /**
     * @notice This function is private and checks if the collection type may be potentially invalid.
     * @param collection Address of the collection
     * @param collectionType Collection type in the maker order
     * @return validationCode Validation code
     * @dev This function may return false positives.
     *      (i.e. collections that are tradable but do not implement the proper interfaceId).
     *      If ERC165 is not implemented, it will revert.
     */
    function _checkIfPotentialInvalidCollectionTypes(address collection, CollectionType collectionType)
        private
        view
        returns (uint256 validationCode)
    {
        if (collectionType == CollectionType.ERC721) {
            bool isERC721 = IERC165(collection).supportsInterface(ERC721_INTERFACE_ID_1)
                || IERC165(collection).supportsInterface(ERC721_INTERFACE_ID_2);

            if (!isERC721) {
                return POTENTIAL_INVALID_COLLECTION_TYPE_SHOULD_BE_ERC721;
            }
        } else if (collectionType == CollectionType.ERC1155) {
            if (!IERC165(collection).supportsInterface(ERC1155_INTERFACE_ID)) {
                return POTENTIAL_INVALID_COLLECTION_TYPE_SHOULD_BE_ERC1155;
            }
        } else if (collectionType == CollectionType.Hypercert) {
            if (!IERC165(collection).supportsInterface(HYPERCERT_INTERFACE_ID)) {
                return POTENTIAL_INVALID_COLLECTION_TYPE_SHOULD_BE_HYPERCERT;
            }
        }
    }

    /**
     * @notice This function verifies that (1) ERC20 approvals
     *         and (2) balances are sufficient to process the maker bid order.
     * @param currency Currency address
     * @param user User address
     * @param price Price (defined by the maker order)
     * @return validationCode Validation code
     */
    function _checkValidityMakerBidERC20Assets(address currency, address user, uint256 price)
        private
        view
        returns (uint256 validationCode)
    {
        if (currency != address(0)) {
            if (IERC20(currency).balanceOf(user) < price) {
                return ERC20_BALANCE_INFERIOR_TO_PRICE;
            }

            if (IERC20(currency).allowance(user, address(looksRareProtocol)) < price) {
                return ERC20_APPROVAL_INFERIOR_TO_PRICE;
            }
        }
    }

    /**
     * @notice This function verifies the validity of NFT assets (approvals, balances, and others).
     * @param collection Collection address
     * @param collectionType Collection type
     * @param user User address
     * @param itemIds Array of item ids
     * @param amounts Array of amounts
     * @return validationCode Validation code
     */
    function _checkValidityMakerAskNFTAssets(
        address collection,
        CollectionType collectionType,
        address user,
        uint256[] memory itemIds,
        uint256[] memory amounts
    ) private view returns (uint256 validationCode) {
        validationCode = _checkIfItemIdsDiffer(itemIds);

        if (validationCode != ORDER_EXPECTED_TO_BE_VALID) {
            return validationCode;
        }

        if (collectionType == CollectionType.ERC721) {
            validationCode = _checkValidityERC721AndEquivalents(collection, user, itemIds);
        } else if (collectionType == CollectionType.ERC1155) {
            validationCode = _checkValidityERC1155(collection, user, itemIds, amounts);
        } else if (collectionType == CollectionType.Hypercert) {
            validationCode = _checkValidityHypercert(collection, user, itemIds);
        }
    }

    /**
     * @notice This function verifies the validity of (1) ERC721 approvals
     *         and (2) balances to process the maker ask order.
     * @param collection Collection address
     * @param user User address
     * @param itemIds Array of item ids
     * @return validationCode Validation code
     */
    function _checkValidityERC721AndEquivalents(address collection, address user, uint256[] memory itemIds)
        private
        view
        returns (uint256 validationCode)
    {
        // 1. Verify itemId is owned by user and catch revertion if ERC721 ownerOf fails
        uint256 length = itemIds.length;

        bool success;
        bytes memory data;

        for (uint256 i; i < length;) {
            (success, data) = collection.staticcall(abi.encodeCall(IERC721.ownerOf, (itemIds[i])));

            if (!success) {
                return ERC721_ITEM_ID_DOES_NOT_EXIST;
            }

            if (abi.decode(data, (address)) != user) {
                return ERC721_ITEM_ID_NOT_IN_BALANCE;
            }

            unchecked {
                ++i;
            }
        }

        // 2. Verify if collection is approved by transfer manager
        (success, data) =
            collection.staticcall(abi.encodeCall(IERC721.isApprovedForAll, (user, address(transferManager))));

        bool isApprovedAll;
        if (success) {
            isApprovedAll = abi.decode(data, (bool));
        }

        if (!isApprovedAll) {
            for (uint256 i; i < length;) {
                // 3. If collection is not approved by transfer manager, try to see if it is approved individually
                (success, data) = collection.staticcall(abi.encodeCall(IERC721.getApproved, (itemIds[i])));

                address approvedAddress;

                if (success) {
                    approvedAddress = abi.decode(data, (address));
                }

                if (approvedAddress != address(transferManager)) {
                    return ERC721_NO_APPROVAL_FOR_ALL_OR_ITEM_ID;
                }

                unchecked {
                    ++i;
                }
            }
        }
    }

    /**
     * @notice This function verifies the validity of (1) ERC1155 approvals
     *         (2) and balances to process the maker ask order.
     * @param collection Collection address
     * @param user User address
     * @param itemIds Array of item ids
     * @param amounts Array of amounts
     * @return validationCode Validation code
     */
    function _checkValidityERC1155(address collection, address user, uint256[] memory itemIds, uint256[] memory amounts)
        private
        view
        returns (uint256 validationCode)
    {
        // 1. Verify each itemId is owned by user and catch revertion if ERC1155 ownerOf fails
        address[] memory users = new address[](1);
        users[0] = user;

        uint256 length = itemIds.length;

        // 1.1 Use balanceOfBatch
        (bool success, bytes memory data) =
            collection.staticcall(abi.encodeCall(IERC1155.balanceOfBatch, (users, itemIds)));

        if (success) {
            uint256[] memory balances = abi.decode(data, (uint256[]));
            for (uint256 i; i < length;) {
                if (balances[i] < amounts[i]) {
                    return ERC1155_BALANCE_OF_ITEM_ID_INFERIOR_TO_AMOUNT;
                }
                unchecked {
                    ++i;
                }
            }
        } else {
            // 1.2 If the balanceOfBatch does not work, use loop with balanceOf function
            for (uint256 i; i < length;) {
                (success, data) = collection.staticcall(abi.encodeCall(IERC1155.balanceOf, (user, itemIds[i])));

                if (!success) {
                    return ERC1155_BALANCE_OF_DOES_NOT_EXIST;
                }

                if (abi.decode(data, (uint256)) < amounts[i]) {
                    return ERC1155_BALANCE_OF_ITEM_ID_INFERIOR_TO_AMOUNT;
                }

                unchecked {
                    ++i;
                }
            }
        }

        // 2. Verify if collection is approved by transfer manager
        (success, data) =
            collection.staticcall(abi.encodeCall(IERC1155.isApprovedForAll, (user, address(transferManager))));

        if (!success) {
            return ERC1155_IS_APPROVED_FOR_ALL_DOES_NOT_EXIST;
        }

        if (!abi.decode(data, (bool))) {
            return ERC1155_NO_APPROVAL_FOR_ALL;
        }
    }

    /**
     * @notice This function verifies the validity of (1) Hypercerts + 1155 approvals
     *         (2) and balances to process the maker ask order.
     * @param collection Collection address
     * @param user User address
     * @param itemIds Array of fraction ids
     * @return validationCode Validation code
     */
    function _checkValidityHypercert(address collection, address user, uint256[] memory itemIds)
        private
        view
        returns (uint256 validationCode)
    {
        // 1. Verify each itemId is owned by user and catch revertion if ownerOf fails
        address[] memory users = new address[](1);
        users[0] = user;

        uint256 length = itemIds.length;

        bool success;
        bytes memory data;

        for (uint256 i; i < length;) {
            (success, data) = collection.staticcall(abi.encodeCall(IERC721.ownerOf, (itemIds[i])));

            if (!success) {
                return HYPERCERT_OWNER_OF_DOES_NOT_EXIST;
            }

            if (abi.decode(data, (address)) != user) return HYPERCERT_FRACTION_NOT_HELD_BY_USER;

            unchecked {
                ++i;
            }
        }

        // 2. Verify if collection is approved by transfer manager
        (success, data) =
            collection.staticcall(abi.encodeCall(IERC1155.isApprovedForAll, (user, address(transferManager))));

        if (!success) {
            return ERC1155_IS_APPROVED_FOR_ALL_DOES_NOT_EXIST;
        }

        if (!abi.decode(data, (bool))) {
            return ERC1155_NO_APPROVAL_FOR_ALL;
        }
    }

    /**
     * @notice This function verifies the validity of a Merkle proof and the order hash.
     * @param merkleTree Merkle tree struct
     * @param orderHash Order hash
     * @param signature Signature
     * @param signer Signer address
     * @return validationCode Validation code
     */
    function _checkValidityMerkleProofAndOrderHash(
        OrderStructs.MerkleTree calldata merkleTree,
        bytes32 orderHash,
        bytes calldata signature,
        address signer
    ) private view returns (uint256 validationCode) {
        if (merkleTree.proof.length != 0) {
            if (merkleTree.proof.length > MAX_CALLDATA_PROOF_LENGTH) {
                return MERKLE_PROOF_PROOF_TOO_LARGE;
            }

            if (!MerkleProofCalldataWithNodes.verifyCalldata(merkleTree.proof, merkleTree.root, orderHash)) {
                return ORDER_HASH_PROOF_NOT_IN_MERKLE_TREE;
            }

            bytes32 batchOrderHash = looksRareProtocol.hashBatchOrder(merkleTree.root, merkleTree.proof.length);

            return _computeDigestAndVerify(batchOrderHash, signature, signer);
        } else {
            return _computeDigestAndVerify(orderHash, signature, signer);
        }
    }

    /**
     * @notice Check the validity of creator fee
     * @param collection Collection address
     * @param itemIds Item ids
     * @return validationCode Validation code
     */
    function _checkValidityCreatorFee(address collection, uint256 price, uint256[] memory itemIds)
        private
        view
        returns (uint256 validationCode)
    {
        if (address(creatorFeeManager) != address(0)) {
            (bool status, bytes memory data) = address(creatorFeeManager).staticcall(
                abi.encodeCall(ICreatorFeeManager.viewCreatorFeeInfo, (collection, price, itemIds))
            );

            // The only path possible (to revert) in the fee manager is the bundle being not supported.
            if (!status) {
                return BUNDLE_ERC2981_NOT_SUPPORTED;
            }

            (address creator, uint256 creatorFeeAmount) = abi.decode(data, (address, uint256));

            if (creator != address(0)) {
                if (creatorFeeAmount * ONE_HUNDRED_PERCENT_IN_BP > (price * uint256(maxCreatorFeeBp))) {
                    return CREATOR_FEE_TOO_HIGH;
                }
            }
        }
    }

    /**
     * @notice This function computes the digest and verify the signature.
     * @param computedHash Hash of order or merkle root
     * @param makerSignature Signature of the maker
     * @param signer Signer address
     * @return validationCode Validation code
     */
    function _computeDigestAndVerify(bytes32 computedHash, bytes calldata makerSignature, address signer)
        private
        view
        returns (uint256 validationCode)
    {
        return _validateSignature(
            keccak256(abi.encodePacked("\x19\x01", domainSeparator, computedHash)), makerSignature, signer
        );
    }

    /**
     * @notice This function checks the validity of the signature.
     * @param hash Message hash
     * @param signature A 64 or 65 bytes signature
     * @param signer Signer address
     * @return validationCode Validation code
     */
    function _validateSignature(bytes32 hash, bytes calldata signature, address signer)
        private
        view
        returns (uint256 validationCode)
    {
        // Logic if EOA
        if (signer.code.length == 0) {
            bytes32 r;
            bytes32 s;
            uint8 v;

            if (signature.length == 64) {
                bytes32 vs;
                assembly {
                    r := calldataload(signature.offset)
                    vs := calldataload(add(signature.offset, 0x20))
                    s := and(vs, 0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff)
                    v := add(shr(255, vs), 27)
                }
            } else if (signature.length == 65) {
                assembly {
                    r := calldataload(signature.offset)
                    s := calldataload(add(signature.offset, 0x20))
                    v := byte(0, calldataload(add(signature.offset, 0x40)))
                }
            } else {
                return INVALID_SIGNATURE_LENGTH;
            }

            if (uint256(s) > 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0) {
                return INVALID_S_PARAMETER_EOA;
            }

            if (v != 27 && v != 28) {
                return INVALID_V_PARAMETER_EOA;
            }

            address recoveredSigner = ecrecover(hash, v, r, s);

            if (recoveredSigner == address(0)) {
                return NULL_SIGNER_EOA;
            }

            if (signer != recoveredSigner) {
                return INVALID_SIGNER_EOA;
            }
        } else {
            // Logic if ERC1271
            (bool success, bytes memory data) =
                signer.staticcall(abi.encodeCall(IERC1271.isValidSignature, (hash, signature)));

            if (!success) {
                return MISSING_IS_VALID_SIGNATURE_FUNCTION_EIP1271;
            }

            if (abi.decode(data, (bytes4)) != IERC1271.isValidSignature.selector) {
                return SIGNATURE_INVALID_EIP1271;
            }
        }
    }

    /**
     * @dev This function checks if transfer manager approvals are not revoked by user, nor by the owner
     * @param user Address of the user
     * @return validationCode Validation code
     */
    function _checkValidityTransferManagerApprovals(address user) private view returns (uint256 validationCode) {
        if (!transferManager.hasUserApprovedOperator(user, address(looksRareProtocol))) {
            return NO_TRANSFER_MANAGER_APPROVAL_BY_USER_FOR_EXCHANGE;
        }

        if (!transferManager.isOperatorAllowed(address(looksRareProtocol))) {
            return TRANSFER_MANAGER_APPROVAL_REVOKED_BY_OWNER_FOR_EXCHANGE;
        }
    }

    function _checkValidityMakerAskItemIdsAndAmountsAndPrice(OrderStructs.Maker memory makerAsk)
        private
        view
        returns (uint256 validationCode, uint256[] memory itemIds, uint256[] memory amounts, uint256 price)
    {
        if (makerAsk.strategyId == 0) {
            itemIds = makerAsk.itemIds;
            amounts = makerAsk.amounts;
            price = makerAsk.price;

            validationCode =
                _getOrderValidationCodeForStandardStrategy(makerAsk.collectionType, itemIds.length, amounts);
        } else {
            itemIds = makerAsk.itemIds;
            amounts = makerAsk.amounts;
            // @dev It should ideally be adjusted by real price
            price = makerAsk.price;

            (,,,, bytes4 strategySelector,, address strategyImplementation) =
                looksRareProtocol.strategyInfo(makerAsk.strategyId);

            (bool isValid, bytes4 errorSelector) =
                IStrategy(strategyImplementation).isMakerOrderValid(makerAsk, strategySelector);

            validationCode = _getOrderValidationCodeForNonStandardStrategies(isValid, errorSelector);
        }
    }

    function _checkValidityMakerBidItemIdsAndAmountsAndPrice(OrderStructs.Maker memory makerBid)
        private
        view
        returns (uint256 validationCode, uint256[] memory itemIds, uint256[] memory amounts, uint256 price)
    {
        if (makerBid.strategyId == 0) {
            itemIds = makerBid.itemIds;
            amounts = makerBid.amounts;
            price = makerBid.price;

            validationCode =
                _getOrderValidationCodeForStandardStrategy(makerBid.collectionType, itemIds.length, amounts);
        } else {
            // @dev It should ideally be adjusted by real price
            //      amounts and itemIds are not used since most non-native maker bids won't target a single item
            price = makerBid.price;

            (,,,, bytes4 strategySelector,, address strategyImplementation) =
                looksRareProtocol.strategyInfo(makerBid.strategyId);

            (bool isValid, bytes4 errorSelector) =
                IStrategy(strategyImplementation).isMakerOrderValid(makerBid, strategySelector);

            validationCode = _getOrderValidationCodeForNonStandardStrategies(isValid, errorSelector);
        }
    }

    /**
     * @notice This function checks if the same itemId is repeated
     *         in an array of item ids.
     * @param itemIds Array of item ids
     * @dev This is for bundles.
     *      For example, if itemIds = [1,2,1], it will return SAME_ITEM_ID_IN_BUNDLE.
     * @return validationCode Validation code
     */
    function _checkIfItemIdsDiffer(uint256[] memory itemIds) private pure returns (uint256 validationCode) {
        uint256 length = itemIds.length;

        // Only check if length of array is greater than 1
        if (length > 1) {
            for (uint256 i = 0; i < length - 1;) {
                for (uint256 j = i + 1; j < length;) {
                    if (itemIds[i] == itemIds[j]) {
                        return SAME_ITEM_ID_IN_BUNDLE;
                    }

                    unchecked {
                        ++j;
                    }
                }

                unchecked {
                    ++i;
                }
            }
        }
    }

    function _getOrderValidationCodeForStandardStrategy(
        CollectionType collectionType,
        uint256 expectedLength,
        uint256[] memory amounts
    ) private pure returns (uint256 validationCode) {
        if (expectedLength == 0 || (amounts.length != expectedLength)) {
            validationCode = MAKER_ORDER_INVALID_STANDARD_SALE;
        } else {
            for (uint256 i; i < expectedLength;) {
                uint256 amount = amounts[i];

                if (amount == 0) {
                    validationCode = MAKER_ORDER_INVALID_STANDARD_SALE;
                }

                if (collectionType == CollectionType.ERC721 && amount != 1) {
                    validationCode = MAKER_ORDER_INVALID_STANDARD_SALE;
                }

                unchecked {
                    ++i;
                }
            }
        }
    }

    function _getOrderValidationCodeForNonStandardStrategies(bool isValid, bytes4 errorSelector)
        private
        pure
        returns (uint256 validationCode)
    {
        if (isValid) {
            validationCode = ORDER_EXPECTED_TO_BE_VALID;
        } else {
            if (errorSelector == OrderInvalid.selector) {
                validationCode = MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE;
            } else if (errorSelector == CollectionTypeInvalid.selector) {
                validationCode = MAKER_ORDER_PERMANENTLY_INVALID_NON_STANDARD_SALE;
            } else {
                validationCode = MAKER_ORDER_TEMPORARILY_INVALID_NON_STANDARD_SALE;
            }
        }
    }
}
