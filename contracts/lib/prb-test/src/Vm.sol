// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

/// Cheatcodes are marked as view/pure/none using the following rules:
///
///   1. A call's observable behavior includes its return value, logs, reverts and state writes,
///   2. If it can influence a later call's observable behavior, it's neither view nor pure (it is modifying some
///   state be it the EVM, interpreter, filesystem, etc),
///   3. Otherwise, if it can be influenced by an earlier call, or if reading some state, it's view,
///   4. Otherwise, it's pure.

/// @notice An EVM interpreter written with testing and debugging in mind. This is usually either HEVM or REVM.
/// @dev This interface can be safely used in scripts running on a live network, so for example you don't accidentally
/// change the block timestamp and use a fake timestamp as a value somewhere.
interface VmSafe {
    struct FsMetadata {
        bool isDir;
        bool isSymlink;
        uint256 length;
        bool readOnly;
        uint256 modified;
        uint256 accessed;
        uint256 created;
    }

    struct Log {
        bytes32[] topics;
        bytes data;
        address emitter;
    }

    struct Rpc {
        string key;
        string url;
    }

    /// @dev Gets all accessed reads and write slot from a recording session, for a given address.
    function accesses(address) external returns (bytes32[] memory reads, bytes32[] memory writes);

    /// @dev Gets the address for a given private key.
    function addr(uint256 privateKey) external pure returns (address);

    /// @dev If the condition is false, discard this run's fuzz inputs and generate new ones.
    function assume(bool condition) external pure;

    /// @dev Using the address that calls the test contract, has the next call (at this call depth only) create a
    /// transaction that can later be signed and sent onchain.
    function broadcast() external;

    /// @dev Has the next call (at this call depth only) create a transaction with the address provided as
    /// the sender that can later be signed and sent onchain.
    function broadcast(address broadcaster) external;

    /// @dev Has the next call (at this call depth only) create a transaction with the private key provided as
    /// the sender that can later be signed and sent onchain
    function broadcast(uint256 privateKey) external;

    // Closes file for reading, resetting the offset and allowing to read it from beginning with readLine.
    function closeFile(string calldata path) external;

    /// @dev Derive a private key from a provided mnenomic string (or mnenomic file path) at the derivation
    /// path m/44'/60'/0'/0/{index}
    function deriveKey(string calldata mnemonic, uint32 index) external pure returns (uint256 privateKey);

    /// @dev Derive a private key from a provided mnenomic string (or mnenomic file path) at {derivationPath}{index}
    function deriveKey(
        string calldata mnemonic,
        string calldata derivationPath,
        uint32 index
    ) external pure returns (uint256 privateKey);

    /// @dev Reads environment variables
    function envAddress(string calldata name) external view returns (address value);

    function envBool(string calldata name) external view returns (bool value);

    function envBytes(string calldata name) external view returns (bytes memory value);

    function envBytes32(string calldata name) external view returns (bytes32 value);

    function envInt(string calldata name) external view returns (int256 value);

    function envString(string calldata name) external view returns (string memory value);

    function envUint(string calldata name) external view returns (uint256 value);

    /// @dev Reads environment variables as arrays.
    function envAddress(string calldata name, string calldata delim) external view returns (address[] memory values);

    function envBool(string calldata name, string calldata delim) external view returns (bool[] memory values);

    function envBytes(string calldata name, string calldata delim) external view returns (bytes[] memory values);

    function envBytes32(string calldata name, string calldata delim) external view returns (bytes32[] memory values);

    function envInt(string calldata name, string calldata delim) external view returns (int256[] memory values);

    function envString(string calldata name, string calldata delim) external view returns (string[] memory values);

    function envUint(string calldata name, string calldata delim) external view returns (uint256[] memory values);

    /// @dev Reads environment variables with a default value.
    function envOr(string calldata name, bool defaultValue) external returns (bool value);

    function envOr(string calldata name, uint256 defaultValue) external returns (uint256 value);

    function envOr(string calldata name, int256 defaultValue) external returns (int256 value);

    function envOr(string calldata name, address defaultValue) external returns (address value);

    function envOr(string calldata name, bytes32 defaultValue) external returns (bytes32 value);

    function envOr(string calldata name, string calldata defaultValue) external returns (string memory value);

    function envOr(string calldata name, bytes calldata defaultValue) external returns (bytes memory value);

    /// @dev Reads environment variables as arrays with default value.
    function envOr(
        string calldata name,
        string calldata,
        bool[] calldata defaultValue
    ) external returns (bool[] memory value);

    function envOr(
        string calldata name,
        string calldata,
        uint256[] calldata defaultValue
    ) external returns (uint256[] memory value);

    function envOr(
        string calldata name,
        string calldata,
        int256[] calldata defaultValue
    ) external returns (int256[] memory value);

    function envOr(
        string calldata name,
        string calldata,
        address[] calldata defaultValue
    ) external returns (address[] memory value);

    function envOr(
        string calldata name,
        string calldata,
        bytes32[] calldata defaultValue
    ) external returns (bytes32[] memory value);

    function envOr(
        string calldata name,
        string calldata,
        string[] calldata defaultValue
    ) external returns (string[] memory value);

    function envOr(
        string calldata name,
        string calldata,
        bytes[] calldata defaultValue
    ) external returns (bytes[] memory value);

    /// @dev Performs a foreign function call via the terminal.
    function ffi(string[] calldata stringInputs) external returns (bytes memory result);

    /// @dev Get the metadata for a file/directory.
    function fsMetadata(string calldata fileOrDir) external returns (FsMetadata memory metadata);

    /// @dev Gets the code from an artifact file. Takes in the relative path to the json file.
    function getCode(string calldata artifactPath) external view returns (bytes memory bytecode);

    /// @dev Gets the _deployed_ bytecode from an artifact file. Takes in the relative path to the json file.
    function getDeployedCode(string calldata artifactPath) external view returns (bytes memory bytecode);

    /// @dev Gets the nonce of an account.
    function getNonce(address account) external view returns (uint64 nonce);

    /// @dev Gets all the recorded logs.
    function getRecordedLogs() external returns (Log[] memory logs);

    /// @dev Labels an address in call traces.
    function label(address addr, string calldata newLabel) external;

    /// @dev Loads a storage slot from an address.
    function load(address who, bytes32 slot) external view returns (bytes32 data);

    /// @dev Convert values from a string
    function parseBytes(string calldata value) external pure returns (bytes memory parsedValue);

    function parseAddress(string calldata value) external pure returns (address parsedValue);

    function parseBool(string calldata value) external pure returns (bool parsedValue);

    function parseBytes32(string calldata value) external pure returns (bytes32 parsedValue);

    function parseInt(string calldata value) external pure returns (int256 parsedValue);

    /// @dev In case the returned value is a JSON object, it's encoded as a ABI-encoded tuple. As JSON objects
    /// don't have the notion of ordered, but tuples do, they JSON object is encoded with it's fields ordered in
    /// ALPHABETICAL order. That means that in order to successfully decode the tuple, we need to define a tuple that
    /// encodes the fields in the same order, which is alphabetical. In the case of Solidity structs, they are encoded
    /// as tuples, with the attributes in the order in which they are defined.
    /// For example: json = { 'a': 1, 'b': 0xa4tb......3xs}
    /// a: uint256
    /// b: address
    /// To decode that json, we need to define a struct or a tuple as follows:
    /// struct json = { uint256 a; address b; }
    /// If we defined a json struct with the opposite order, meaning placing the address b first, it would try to
    /// decode the tuple in that order, and thus fail.
    /// ----
    /// Given a string of JSON, return it as ABI-encoded
    function parseJson(string calldata json) external pure returns (bytes memory abiEncodedData);

    function parseJson(string calldata json, string calldata key) external pure returns (bytes memory abiEncodedData);

    function parseUint(string calldata value) external pure returns (uint256 parsedValue);

    /// @dev Get the path of the current project root
    function projectRoot() external view returns (string memory rootPath);

    /// @dev Reads the entire content of file to string.
    function readFile(string calldata path) external view returns (string memory data);

    /// @dev Reads the entire content of file as binary. Path is relative to the project root.
    function readFileBinary(string calldata path) external view returns (bytes memory data);

    /// @dev Reads next line of file to string.
    function readLine(string calldata path) external view returns (string memory line);

    /// @dev Records all storage reads and writes.
    function record() external;

    /// @dev Record all the transaction logs.
    function recordLogs() external;

    /// @dev Adds a private key to the local Forge wallet and returns the address.
    function rememberKey(uint256 privateKey) external returns (address addr);

    //// @dev Returns the RPC url for the given alias.
    function rpcUrl(string calldata rpcAlias) external view returns (string memory json);

    //// @dev Returns all rpc urls and their aliases `[alias, url][]`.
    function rpcUrls() external view returns (string[2][] memory urls);

    /// @dev Returns all rpc urls and their aliases as structs.
    function rpcUrlStructs() external view returns (Rpc[] memory urls);

    /// @dev Serializes a key and value to a JSON object stored in-memory that can be later written to a file.
    /// It returns the stringified version of the specific JSON file up to that moment.
    function serializeBool(
        string calldata objectKey,
        string calldata valueKey,
        bool value
    ) external returns (string memory json);

    function serializeUint(
        string calldata objectKey,
        string calldata valueKey,
        uint256 value
    ) external returns (string memory json);

    function serializeInt(
        string calldata objectKey,
        string calldata valueKey,
        int256 value
    ) external returns (string memory json);

    function serializeAddress(
        string calldata objectKey,
        string calldata valueKey,
        address value
    ) external returns (string memory json);

    function serializeBytes32(
        string calldata objectKey,
        string calldata valueKey,
        bytes32 value
    ) external returns (string memory json);

    function serializeString(
        string calldata objectKey,
        string calldata valueKey,
        string calldata value
    ) external returns (string memory json);

    function serializeBytes(
        string calldata objectKey,
        string calldata valueKey,
        bytes calldata value
    ) external returns (string memory json);

    function serializeBool(
        string calldata objectKey,
        string calldata valueKey,
        bool[] calldata values
    ) external returns (string memory json);

    function serializeUint(
        string calldata objectKey,
        string calldata valueKey,
        uint256[] calldata values
    ) external returns (string memory json);

    function serializeInt(
        string calldata objectKey,
        string calldata valueKey,
        int256[] calldata values
    ) external returns (string memory json);

    function serializeAddress(
        string calldata objectKey,
        string calldata valueKey,
        address[] calldata values
    ) external returns (string memory json);

    function serializeBytes32(
        string calldata objectKey,
        string calldata valueKey,
        bytes32[] calldata values
    ) external returns (string memory json);

    function serializeString(
        string calldata objectKey,
        string calldata valueKey,
        string[] calldata values
    ) external returns (string memory json);

    function serializeBytes(
        string calldata objectKey,
        string calldata valueKey,
        bytes[] calldata values
    ) external returns (string memory json);

    /// @dev Sets environment variables.
    function setEnv(string calldata name, string calldata value) external;

    /// @dev Signs data.
    function sign(uint256 privateKey, bytes32 digest) external pure returns (uint8 v, bytes32 r, bytes32 s);

    /// @dev Using the address that calls the test contract, has all subsequent calls (at this call depth only)
    /// create transactions that can later be signed and sent onchain.
    function startBroadcast() external;

    /// @dev Has all subsequent calls (at this call depth only) create transactions that can later be signed and
    /// sent onchain.
    function startBroadcast(address broadcaster) external;

    /// @dev Has all subsequent calls (at this call depth only) create transactions with the private key provided that
    /// can later be signed and sent onchain
    function startBroadcast(uint256 privateKey) external;

    /// @dev Stops collecting onchain transactions.
    function stopBroadcast() external;

    /// @dev Convert values to a string.
    function toString(address value) external pure returns (string memory stringValue);

    function toString(bool value) external pure returns (string memory stringValue);

    function toString(bytes calldata value) external pure returns (string memory stringValue);

    function toString(bytes32 value) external pure returns (string memory stringValue);

    function toString(int256 value) external pure returns (string memory stringValue);

    function toString(uint256 value) external pure returns (string memory stringValue);

    /// @dev Writes data to file, creating a file if it does not exist, and entirely replacing its contents if it does.
    function writeFile(string calldata path, string calldata data) external;

    /// @dev Writes binary data to a file, creating a file if it does not exist, and entirely replacing its contents if
    /// it does. Path is relative to the project root.
    function writeFileBinary(string calldata path, bytes calldata data) external;

    /// @dev Writes line to file, creating a file if it does not exist.
    function writeLine(string calldata path, string calldata data) external;

    /// @dev Write a serialized JSON object to a file. If the file exists, it will be overwritten.
    function writeJson(string calldata json, string calldata path) external;

    /// @dev Write a serialized JSON object to an **existing** JSON file, replacing a value with key = <value_key>
    /// This is useful to replace a specific value of a JSON file, without having to parse the entire thing
    function writeJson(string calldata json, string calldata path, string calldata valueKey) external;
}

/// @notice An EVM interpreter written with testing and debugging in mind. This is usually either HEVM or REVM.
/// @dev This interface contains cheatcodes that are potentially unsafe on a live network.
interface Vm is VmSafe {
    //// @dev Returns the identifier of the currently active fork. Reverts if no fork is currently active.
    function activeFork() external returns (uint256 forkId);

    /// @dev In forking mode, explicitly grant the given address cheatcode access
    function allowCheatcodes(address account) external;

    /// @dev Sets block.chainid.
    function chainId(uint256 newChainId) external;

    /// @dev Clears all mocked calls.
    function clearMockedCalls() external;

    /// @dev Sets block.coinbase
    function coinbase(address newCoinbase) external;

    /// @dev Creates a new fork with the given endpoint and block number and returns the identifier of the fork.
    function createFork(string calldata endpoint, uint256 blockNumber) external returns (uint256);

    /// @dev Creates a new fork with the given endpoint and the _latest_ block and returns the identifier of the fork.
    function createFork(string calldata endpoint) external returns (uint256);

    /// @dev Creates _and_ also selects a new fork with the given endpoint and the latest block and returns the
    /// identifier of the fork.
    function createSelectFork(string calldata endpoint) external returns (uint256);

    /// @dev Creates _and_ also selects a new fork with the given endpoint and block number and returns the identifier
    /// of the fork.
    function createSelectFork(string calldata endpoint, uint256 blockNumber) external returns (uint256);

    /// @dev Creates _and_ also selects new fork with the given endpoint and at the block the given transaction was
    /// mined in, replays all transaction mined in the block before the transaction, returns the identifier of the fork
    function createSelectFork(string calldata endpoint, bytes32 txHash) external returns (uint256 forkId);

    /// @dev Sets an address' balance.
    function deal(address who, uint256 newBalance) external;

    /// @dev Sets block.difficulty
    function difficulty(uint256 newDifficulty) external;

    /// @dev Sets an address' code.
    function etch(address who, bytes calldata newCode) external;

    /// @dev Expects a call to an address with the specified calldata.
    /// Calldata can be either a strict or a partial match.
    function expectCall(address callee, bytes calldata data) external;

    /// @dev Expects a call to an address with the specified msg.value and calldata.
    function expectCall(address callee, uint256 msgValue, bytes calldata data) external;

    /// @dev Prepare an expected log with (bool checkTopic1, bool checkTopic2, bool checkTopic3, bool checkData).
    /// Call this function, then emit an event, then call a function. Internally after the call, we check if logs
    /// were emitted in the expected order with the expected topics and data (as specified by the booleans).
    function expectEmit(bool checkTopic1, bool checkTopic2, bool checkTopic3, bool checkData) external;

    function expectEmit(bool checkTopic1, bool checkTopic2, bool checkTopic3, bool checkData, address emitter) external;

    /// @dev Expects an error on next call.
    function expectRevert(bytes calldata revertData) external;

    function expectRevert(bytes4 revertData) external;

    function expectRevert() external;

    /// @dev Sets block.basefee.
    function fee(uint256 newBasefee) external;

    /// @dev Returns true if the account is marked as persistent.
    function isPersistent(address account) external view returns (bool persistent);

    /// @dev Marks that the account(s) should use persistent storage across fork swaps in a multifork setup.
    // Meaning, changes made to the state of this account will be kept when switching forks
    function makePersistent(address account) external;

    function makePersistent(address account0, address account1) external;

    function makePersistent(address account0, address account1, address account2) external;

    function makePersistent(address[] calldata accounts) external;

    /// @dev Mocks a call to an address, returning specified data.
    /// Calldata can either be strict or a partial match, e.g. if you only pass a Solidity selector to the expected
    /// calldata, then the entire Solidity function will be mocked.
    function mockCall(address callee, bytes calldata data, bytes calldata returnData) external;

    /// @dev Mocks a call to an address with a specific msg.value, returning specified data.
    /// Calldata match takes precedence over msg.value in case of ambiguity.
    function mockCall(address callee, uint256 msgValue, bytes calldata data, bytes calldata returnData) external;

    /// @dev Sets the *next* call's msg.sender to be the input address.
    function prank(address msgSender) external;

    /// @dev Sets the *next* call's msg.sender to be the input address, and the tx.origin to be the second input.
    function prank(address msgSender, address txOrigin) external;

    /// @dev Removes file. This cheatcode will revert in the following situations, but is not limited to just
    /// these cases:
    ///   - Path points to a directory.
    ///   - The file doesn't exist.
    ///   - The user lacks permissions to remove the file.
    function removeFile(string calldata path) external;

    /// @dev Revert the state of the evm to a previous snapshot.
    /// Takes the snapshot id to revert to.
    /// This deletes the snapshot and all snapshots taken after the given snapshot id.
    function revertTo(uint256 snapshotId) external returns (bool result);

    /// @dev Revokes persistent status from the address, previously added via `makePersistent`
    function revokePersistent(address account) external;

    function revokePersistent(address[] calldata accounts) external;

    /// @dev Sets block.height.
    function roll(uint256 newHeight) external;

    /// @dev Updates the currently active fork to given block number. This is similar to `roll` but for the
    /// currently active fork.
    function rollFork(uint256 forkId) external;

    /// @dev Updates the given fork to given block number.
    function rollFork(uint256 forkId, uint256 blockNumber) external;

    /// @dev Updates the currently active fork to given transaction
    /// this will `rollFork` with the number of the block the transaction was mined in and replays all transaction
    /// mined before it in the block
    function rollFork(bytes32 txHash) external;

    /// @dev Updates the given fork to block number of the given transaction and replays all transaction mined before
    /// it in the block
    function rollFork(uint256 forkId, bytes32 txHash) external;

    /// @dev Takes a fork identifier created by `createFork` and sets the corresponding forked state as active.
    function selectFork(uint256 forkId) external;

    /// @dev Sets the nonce of an account; must be higher than the current nonce of the account.
    function setNonce(address account, uint64 newNonce) external;

    /// @dev Snapshot the current state of the EVM.
    /// Returns the id of the snapshot that was created.
    /// To revert a snapshot use `revertTo`.
    function snapshot() external returns (uint256 snapshotId);

    /// @dev Sets all subsequent calls' msg.sender to be the input address until `stopPrank` is called.
    function startPrank(address msgSender) external;

    /// @dev Sets all subsequent calls' msg.sender to be the input address until `stopPrank` is called, and
    /// the tx.origin to be the second input.
    function startPrank(address msgSender, address txOrigin) external;

    /// @dev Resets subsequent calls' msg.sender to be `address(this)`.
    function stopPrank() external;

    /// @dev Stores a value to an address' storage slot, (who, slot, value).
    function store(address who, bytes32 slot, bytes32 value) external;

    /// @dev Fetches the given transaction from the active fork and executes it on the current state
    function transact(bytes32 txHash) external;

    /// @dev Fetches the given transaction from the given fork and executes it on the current state
    function transact(uint256 forkId, bytes32 txHash) external;

    /// @dev Sets block.timestamp.
    function warp(uint256 timestamp) external;
}
