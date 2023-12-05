// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/**
 * @title INonceManager
 * @author LooksRare protocol team (👀,💎)
 */
interface INonceManager {
    /**
     * @notice This struct contains the global bid and ask nonces of a user.
     * @param bidNonce Bid nonce
     * @param askNonce Ask nonce
     */
    struct UserBidAskNonces {
        uint256 bidNonce;
        uint256 askNonce;
    }

    /**
     * @notice It is emitted when there is an update of the global bid/ask nonces for a user.
     * @param user Address of the user
     * @param bidNonce New bid nonce
     * @param askNonce New ask nonce
     */
    event NewBidAskNonces(address user, uint256 bidNonce, uint256 askNonce);

    /**
     * @notice It is emitted when order nonces are cancelled for a user.
     * @param user Address of the user
     * @param orderNonces Array of order nonces cancelled
     */
    event OrderNoncesCancelled(address user, uint256[] orderNonces);

    /**
     * @notice It is emitted when subset nonces are cancelled for a user.
     * @param user Address of the user
     * @param subsetNonces Array of subset nonces cancelled
     */
    event SubsetNoncesCancelled(address user, uint256[] subsetNonces);
}
