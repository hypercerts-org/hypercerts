import {
  AutotaskEvent,
  BlockTriggerEvent,
} from "@openzeppelin/defender-autotask-utils";
import { getNetworkConfigFromName } from "../networks";
import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";
import { ethers } from "ethers";
import { MissingDataError, NotImplementedError } from "../errors";

export async function handler(event: AutotaskEvent) {
  console.log(
    "Event: ",
    JSON.stringify(
      { ...event, secrets: "HIDDEN", credentials: "HIDDEN" },
      null,
      2,
    ),
  );
  const network = getNetworkConfigFromName(event.autotaskName);
  const { SUPABASE_URL, SUPABASE_SECRET_API_KEY } = event.secrets;
  const ALCHEMY_KEY = event.secrets[network.alchemyKeyEnvName];

  const client = createClient(SUPABASE_URL, SUPABASE_SECRET_API_KEY, {
    global: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      fetch: (...args) => fetch(...args),
    },
  });

  let provider;

  if (ALCHEMY_KEY) {
    provider = new ethers.providers.AlchemyProvider(
      network.networkKey,
      ALCHEMY_KEY,
    );
  } else if (network.rpc) {
    provider = new ethers.providers.JsonRpcProvider(network.rpc);
  } else {
    throw new Error("No provider available");
  }

  // Check data availability
  const body = event.request.body;
  if (!("type" in body) || body.type !== "BLOCK") {
    throw new NotImplementedError("Event body is not a BlockTriggerEvent");
  }
  const blockTriggerEvent = body as BlockTriggerEvent;
  const contractAddress = blockTriggerEvent.matchedAddresses[0];
  const fromAddress = blockTriggerEvent.transaction.from;
  const txnLogs = blockTriggerEvent.transaction.logs;
  const tx = await provider.getTransaction(blockTriggerEvent.hash);

  if (!contractAddress) {
    throw new MissingDataError(`body.matchedAddresses is missing`);
  } else if (!fromAddress) {
    throw new MissingDataError(`body.transaction.from is missing`);
  } else if (!txnLogs) {
    throw new MissingDataError(`body.transaction.logs is missing`);
  } else if (!tx) {
    throw new MissingDataError(`tx is missing`);
  }

  console.log("Contract address", contractAddress);
  console.log("From address", fromAddress);

  // TODO: Update contracts so we can use ABI from the @hypercerts-org/contracts package
  const contractInterface = new ethers.utils.Interface(HypercertExchangeABI);

  // Parse TransferSingle events
  const transferSingleEvents = txnLogs
    .map((l) => {
      //Ignore unknown events
      try {
        return contractInterface.parseLog(l);
      } catch (e) {
        console.log("Failed to parse log", l);
        return null;
      }
    })
    .filter((e) => e !== null && e.name === "TransferSingle");

  console.log(
    "TransferSingle Events: ",
    JSON.stringify(transferSingleEvents, null, 2),
  );

  if (transferSingleEvents.length !== 1) {
    throw new MissingDataError(
      `Unexpected saw ${transferSingleEvents.length} TransferSingle events`,
    );
  }

  // Get claimID
  const signerAddress = transferSingleEvents[0].args["from"] as string;
  const itemId = transferSingleEvents[0].args["id"] as string;
  console.log("Signer Address: ", signerAddress, "Fraction ID: ", itemId);

  // Parse TakerBid events
  const takerBidEvents = txnLogs
    .map((l) => {
      //Ignore unknown events
      try {
        return contractInterface.parseLog(l);
      } catch (e) {
        console.log("Failed to parse log", l);
        return null;
      }
    })
    .filter((e) => e !== null && e.name === "TakerBid");

  console.log("TakerBid Events: ", JSON.stringify(takerBidEvents, null, 2));

  if (takerBidEvents.length !== 1) {
    throw new MissingDataError(
      `Unexpected saw ${takerBidEvents.length} TakerBid events`,
    );
  }

  // Get claimID
  const orderNonce = takerBidEvents[0].args[
    "nonceInvalidationParameters"
  ][0] as string;
  console.log("Order nonce", orderNonce);

  // Remove from DB
  if (await tx.wait(5).then((receipt) => receipt.status === 1)) {
    const deleteResult = await client
      .from("marketplace-orders")
      .delete()
      .eq("signer", signerAddress)
      .eq("chain_id", network.chainId)
      .eq("orderNonce", orderNonce)
      .containedBy("itemIds", [itemId])
      .select();
    console.log("Deleted", deleteResult);

    if (!deleteResult) {
      throw new Error(
        `Could not remove from database. Delete result: ${JSON.stringify(
          deleteResult,
        )}`,
      );
    }
  }
}

const HypercertExchangeABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_protocolFeeRecipient",
        type: "address",
      },
      {
        internalType: "address",
        name: "_transferManager",
        type: "address",
      },
      {
        internalType: "address",
        name: "_weth",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "CallerInvalid",
    type: "error",
  },
  {
    inputs: [],
    name: "ChainIdInvalid",
    type: "error",
  },
  {
    inputs: [],
    name: "CreatorFeeBpTooHigh",
    type: "error",
  },
  {
    inputs: [],
    name: "CurrencyInvalid",
    type: "error",
  },
  {
    inputs: [],
    name: "ERC20TransferFromFail",
    type: "error",
  },
  {
    inputs: [],
    name: "LengthsInvalid",
    type: "error",
  },
  {
    inputs: [],
    name: "MerkleProofInvalid",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "length",
        type: "uint256",
      },
    ],
    name: "MerkleProofTooLarge",
    type: "error",
  },
  {
    inputs: [],
    name: "NewGasLimitETHTransferTooLow",
    type: "error",
  },
  {
    inputs: [],
    name: "NewProtocolFeeRecipientCannotBeNullAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "NoOngoingTransferInProgress",
    type: "error",
  },
  {
    inputs: [],
    name: "NoSelectorForStrategy",
    type: "error",
  },
  {
    inputs: [],
    name: "NoncesInvalid",
    type: "error",
  },
  {
    inputs: [],
    name: "NotAContract",
    type: "error",
  },
  {
    inputs: [],
    name: "NotOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "NotV2Strategy",
    type: "error",
  },
  {
    inputs: [],
    name: "NullSignerAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "OutsideOfTimeRange",
    type: "error",
  },
  {
    inputs: [],
    name: "QuoteTypeInvalid",
    type: "error",
  },
  {
    inputs: [],
    name: "ReentrancyFail",
    type: "error",
  },
  {
    inputs: [],
    name: "RenouncementNotInProgress",
    type: "error",
  },
  {
    inputs: [],
    name: "SameDomainSeparator",
    type: "error",
  },
  {
    inputs: [],
    name: "SignatureEOAInvalid",
    type: "error",
  },
  {
    inputs: [],
    name: "SignatureERC1271Invalid",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "length",
        type: "uint256",
      },
    ],
    name: "SignatureLengthInvalid",
    type: "error",
  },
  {
    inputs: [],
    name: "SignatureParameterSInvalid",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
    ],
    name: "SignatureParameterVInvalid",
    type: "error",
  },
  {
    inputs: [],
    name: "StrategyHasNoSelector",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "strategyId",
        type: "uint256",
      },
    ],
    name: "StrategyNotAvailable",
    type: "error",
  },
  {
    inputs: [],
    name: "StrategyNotUsed",
    type: "error",
  },
  {
    inputs: [],
    name: "StrategyProtocolFeeTooHigh",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferAlreadyInProgress",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferNotInProgress",
    type: "error",
  },
  {
    inputs: [],
    name: "UnsupportedCollectionType",
    type: "error",
  },
  {
    inputs: [],
    name: "WrongPotentialOwner",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [],
    name: "CancelOwnershipTransfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "currency",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isAllowed",
        type: "bool",
      },
    ],
    name: "CurrencyStatusUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "InitiateOwnershipRenouncement",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "potentialOwner",
        type: "address",
      },
    ],
    name: "InitiateOwnershipTransfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bidNonce",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "askNonce",
        type: "uint256",
      },
    ],
    name: "NewBidAskNonces",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "creatorFeeManager",
        type: "address",
      },
    ],
    name: "NewCreatorFeeManager",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "NewDomainSeparator",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "gasLimitETHTransfer",
        type: "uint256",
      },
    ],
    name: "NewGasLimitETHTransfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "maxCreatorFeeBp",
        type: "uint256",
      },
    ],
    name: "NewMaxCreatorFeeBp",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "NewOwner",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "protocolFeeRecipient",
        type: "address",
      },
    ],
    name: "NewProtocolFeeRecipient",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "strategyId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "standardProtocolFeeBp",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "minTotalFeeBp",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "maxProtocolFeeBp",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "bytes4",
        name: "selector",
        type: "bytes4",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isMakerBid",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "NewStrategy",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "orderNonces",
        type: "uint256[]",
      },
    ],
    name: "OrderNoncesCancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "strategyId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "standardProtocolFeeBp",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "minTotalFeeBp",
        type: "uint16",
      },
    ],
    name: "StrategyUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "subsetNonces",
        type: "uint256[]",
      },
    ],
    name: "SubsetNoncesCancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "orderHash",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "orderNonce",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isNonceInvalidated",
            type: "bool",
          },
        ],
        indexed: false,
        internalType: "struct ILooksRareProtocol.NonceInvalidationParameters",
        name: "nonceInvalidationParameters",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "address",
        name: "askUser",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "bidUser",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "strategyId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "currency",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "collection",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "itemIds",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "address[2]",
        name: "feeRecipients",
        type: "address[2]",
      },
      {
        indexed: false,
        internalType: "uint256[3]",
        name: "feeAmounts",
        type: "uint256[3]",
      },
    ],
    name: "TakerAsk",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "orderHash",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "orderNonce",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isNonceInvalidated",
            type: "bool",
          },
        ],
        indexed: false,
        internalType: "struct ILooksRareProtocol.NonceInvalidationParameters",
        name: "nonceInvalidationParameters",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "address",
        name: "bidUser",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "bidRecipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "strategyId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "currency",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "collection",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "itemIds",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "address[2]",
        name: "feeRecipients",
        type: "address[2]",
      },
      {
        indexed: false,
        internalType: "uint256[3]",
        name: "feeAmounts",
        type: "uint256[3]",
      },
    ],
    name: "TakerBid",
    type: "event",
  },
  {
    inputs: [],
    name: "MAGIC_VALUE_ORDER_NONCE_EXECUTED",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "WETH",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "standardProtocolFeeBp",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "minTotalFeeBp",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "maxProtocolFeeBp",
        type: "uint16",
      },
      {
        internalType: "bytes4",
        name: "selector",
        type: "bytes4",
      },
      {
        internalType: "bool",
        name: "isMakerBid",
        type: "bool",
      },
      {
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "addStrategy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "orderNonces",
        type: "uint256[]",
      },
    ],
    name: "cancelOrderNonces",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "cancelOwnershipTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "subsetNonces",
        type: "uint256[]",
      },
    ],
    name: "cancelSubsetNonces",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "chainId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "confirmOwnershipRenouncement",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "confirmOwnershipTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "creatorFeeManager",
    outputs: [
      {
        internalType: "contract ICreatorFeeManager",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "domainSeparator",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "recipient",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "additionalParameters",
            type: "bytes",
          },
        ],
        internalType: "struct OrderStructs.Taker[]",
        name: "takerBids",
        type: "tuple[]",
      },
      {
        components: [
          {
            internalType: "enum QuoteType",
            name: "quoteType",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "globalNonce",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "subsetNonce",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "orderNonce",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "strategyId",
            type: "uint256",
          },
          {
            internalType: "enum CollectionType",
            name: "collectionType",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "collection",
            type: "address",
          },
          {
            internalType: "address",
            name: "currency",
            type: "address",
          },
          {
            internalType: "address",
            name: "signer",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "startTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "itemIds",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "amounts",
            type: "uint256[]",
          },
          {
            internalType: "bytes",
            name: "additionalParameters",
            type: "bytes",
          },
        ],
        internalType: "struct OrderStructs.Maker[]",
        name: "makerAsks",
        type: "tuple[]",
      },
      {
        internalType: "bytes[]",
        name: "makerSignatures",
        type: "bytes[]",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "root",
            type: "bytes32",
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "value",
                type: "bytes32",
              },
              {
                internalType: "enum OrderStructs.MerkleTreeNodePosition",
                name: "position",
                type: "uint8",
              },
            ],
            internalType: "struct OrderStructs.MerkleTreeNode[]",
            name: "proof",
            type: "tuple[]",
          },
        ],
        internalType: "struct OrderStructs.MerkleTree[]",
        name: "merkleTrees",
        type: "tuple[]",
      },
      {
        internalType: "bool",
        name: "isAtomic",
        type: "bool",
      },
    ],
    name: "executeMultipleTakerBids",
    // @ts-ignore
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "recipient",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "additionalParameters",
            type: "bytes",
          },
        ],
        internalType: "struct OrderStructs.Taker",
        name: "takerAsk",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "enum QuoteType",
            name: "quoteType",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "globalNonce",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "subsetNonce",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "orderNonce",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "strategyId",
            type: "uint256",
          },
          {
            internalType: "enum CollectionType",
            name: "collectionType",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "collection",
            type: "address",
          },
          {
            internalType: "address",
            name: "currency",
            type: "address",
          },
          {
            internalType: "address",
            name: "signer",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "startTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "itemIds",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "amounts",
            type: "uint256[]",
          },
          {
            internalType: "bytes",
            name: "additionalParameters",
            type: "bytes",
          },
        ],
        internalType: "struct OrderStructs.Maker",
        name: "makerBid",
        type: "tuple",
      },
      {
        internalType: "bytes",
        name: "makerSignature",
        type: "bytes",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "root",
            type: "bytes32",
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "value",
                type: "bytes32",
              },
              {
                internalType: "enum OrderStructs.MerkleTreeNodePosition",
                name: "position",
                type: "uint8",
              },
            ],
            internalType: "struct OrderStructs.MerkleTreeNode[]",
            name: "proof",
            type: "tuple[]",
          },
        ],
        internalType: "struct OrderStructs.MerkleTree",
        name: "merkleTree",
        type: "tuple",
      },
    ],
    name: "executeTakerAsk",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "recipient",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "additionalParameters",
            type: "bytes",
          },
        ],
        internalType: "struct OrderStructs.Taker",
        name: "takerBid",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "enum QuoteType",
            name: "quoteType",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "globalNonce",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "subsetNonce",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "orderNonce",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "strategyId",
            type: "uint256",
          },
          {
            internalType: "enum CollectionType",
            name: "collectionType",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "collection",
            type: "address",
          },
          {
            internalType: "address",
            name: "currency",
            type: "address",
          },
          {
            internalType: "address",
            name: "signer",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "startTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "itemIds",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "amounts",
            type: "uint256[]",
          },
          {
            internalType: "bytes",
            name: "additionalParameters",
            type: "bytes",
          },
        ],
        internalType: "struct OrderStructs.Maker",
        name: "makerAsk",
        type: "tuple",
      },
      {
        internalType: "bytes",
        name: "makerSignature",
        type: "bytes",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "root",
            type: "bytes32",
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "value",
                type: "bytes32",
              },
              {
                internalType: "enum OrderStructs.MerkleTreeNodePosition",
                name: "position",
                type: "uint8",
              },
            ],
            internalType: "struct OrderStructs.MerkleTreeNode[]",
            name: "proof",
            type: "tuple[]",
          },
        ],
        internalType: "struct OrderStructs.MerkleTree",
        name: "merkleTree",
        type: "tuple",
      },
    ],
    name: "executeTakerBid",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "root",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "proofLength",
        type: "uint256",
      },
    ],
    name: "hashBatchOrder",
    outputs: [
      {
        internalType: "bytes32",
        name: "batchOrderHash",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "bid",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "ask",
        type: "bool",
      },
    ],
    name: "incrementBidAskNonces",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "initiateOwnershipRenouncement",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newPotentialOwner",
        type: "address",
      },
    ],
    name: "initiateOwnershipTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isCurrencyAllowed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxCreatorFeeBp",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ownershipStatus",
    outputs: [
      {
        internalType: "enum IOwnableTwoSteps.Status",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "potentialOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "protocolFeeRecipient",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "recipient",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "additionalParameters",
            type: "bytes",
          },
        ],
        internalType: "struct OrderStructs.Taker",
        name: "takerBid",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "enum QuoteType",
            name: "quoteType",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "globalNonce",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "subsetNonce",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "orderNonce",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "strategyId",
            type: "uint256",
          },
          {
            internalType: "enum CollectionType",
            name: "collectionType",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "collection",
            type: "address",
          },
          {
            internalType: "address",
            name: "currency",
            type: "address",
          },
          {
            internalType: "address",
            name: "signer",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "startTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "itemIds",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "amounts",
            type: "uint256[]",
          },
          {
            internalType: "bytes",
            name: "additionalParameters",
            type: "bytes",
          },
        ],
        internalType: "struct OrderStructs.Maker",
        name: "makerAsk",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "orderHash",
        type: "bytes32",
      },
    ],
    name: "restrictedExecuteTakerBid",
    outputs: [
      {
        internalType: "uint256",
        name: "protocolFeeAmount",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "strategyInfo",
    outputs: [
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
      {
        internalType: "uint16",
        name: "standardProtocolFeeBp",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "minTotalFeeBp",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "maxProtocolFeeBp",
        type: "uint16",
      },
      {
        internalType: "bytes4",
        name: "selector",
        type: "bytes4",
      },
      {
        internalType: "bool",
        name: "isMakerBid",
        type: "bool",
      },
      {
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "transferManager",
    outputs: [
      {
        internalType: "contract TransferManager",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newCreatorFeeManager",
        type: "address",
      },
    ],
    name: "updateCreatorFeeManager",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "currency",
        type: "address",
      },
      {
        internalType: "bool",
        name: "isAllowed",
        type: "bool",
      },
    ],
    name: "updateCurrencyStatus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "updateDomainSeparator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newGasLimitETHTransfer",
        type: "uint256",
      },
    ],
    name: "updateETHGasLimitForTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "newMaxCreatorFeeBp",
        type: "uint16",
      },
    ],
    name: "updateMaxCreatorFeeBp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newProtocolFeeRecipient",
        type: "address",
      },
    ],
    name: "updateProtocolFeeRecipient",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "strategyId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
      {
        internalType: "uint16",
        name: "newStandardProtocolFee",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "newMinTotalFee",
        type: "uint16",
      },
    ],
    name: "updateStrategy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "userBidAskNonces",
    outputs: [
      {
        internalType: "uint256",
        name: "bidNonce",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "askNonce",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "userOrderNonce",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "userSubsetNonce",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
