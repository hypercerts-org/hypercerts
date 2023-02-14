// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

/// @author bitbeckers
library Errors {
    error AlreadyClaimed();
    error ArraySize();
    error DoesNotExist();
    error DuplicateEntry();
    error Invalid();
    error NotAllowed();
    error NotApprovedOrOwner();
    error TransfersNotAllowed();
    error TypeMismatch();
}
