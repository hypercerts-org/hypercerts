import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { MockProvider, deployMockContract } from "ethereum-waffle";
import { BigNumber, ContractReceipt, ContractTransaction, ethers } from "ethers";

import { HypercertMetadata, HypercertMinterABI } from "../src/index.js";
import {
  AllowlistEntry,
  DuplicateEvaluation,
  HypercertEvaluationSchema,
  SimpleTextEvaluation,
} from "../src/types/index.js";
import { formatHypercertData } from "../src/utils/formatter.js";

export type TestDataType = Parameters<typeof formatHypercertData>[0];

/**
 * Builds allowlist and merkle tree
 * @param overrides contains the size and a valid ethereum address that should be present once in the allowlist
 */
const getAllowlist = (overrides?: { size?: number; address?: `0x${string}` }) => {
  //generate allowlist array based on possible overrides
  const size = overrides?.size || 10;
  let allowlist: AllowlistEntry[] = new Array();
  for (let i = 0; i < size; i++) {
    const address = ethers.Wallet.createRandom().address;

    allowlist.push({ address, units: "1" });
  }

  if (overrides?.address) {
    allowlist[0].address = overrides.address;
  }
  //add a valid address once to the allowlist

  const mappedAllowlist = allowlist.map((entry) => [entry.address.toString(), entry.units.toString()]);

  const merkleTree = StandardMerkleTree.of(mappedAllowlist, ["address", "uint256"]);

  const totalUnits = allowlist.reduce((acc, entry) => acc.add(entry.units), BigNumber.from(0));

  return { allowlist, merkleTree, totalUnits };
};

const getRawInputData = (overrides?: Partial<TestDataType>): Partial<TestDataType> => {
  const testData = {
    name: "test name",
    description: "test description",
    image: "some test image",
    contributors: ["0x111", "0x22"],
    external_url: "https://example.com",
    impactScope: ["test impact scope"],
    impactTimeframeEnd: Math.floor(new Date().getTime()) / 1000,
    impactTimeframeStart: Math.floor(new Date().getTime()) / 1000,
    workScope: ["test work scope"],
    workTimeframeStart: Math.floor(new Date().getTime()) / 1000,
    workTimeframeEnd: Math.floor(new Date().getTime()) / 1000,
    properties: [{ trait_type: "test trait type", value: "aaa" }],
    rights: ["test right 1", "test right 2"],
    version: "0.0.1",
  };

  return { ...testData, ...overrides };
};

const getFormattedMetadata = (overrides?: Partial<TestDataType>): HypercertMetadata => {
  const rawData = getRawInputData(overrides) as TestDataType;
  const { data: formattedData } = formatHypercertData(rawData);
  return formattedData as HypercertMetadata;
};

const mockContractResponse = (): Promise<ContractTransaction> => {
  // mock transaction receipt
  const receipt: ContractReceipt = {
    to: "0x0",
    from: "0x0",
    contractAddress: "0x0",
    transactionIndex: 0,
    gasUsed: BigNumber.from(0),
    logsBloom: "0x0",
    blockHash: "0x0",
    transactionHash: "0x0",
    logs: [],
    blockNumber: 0,
    confirmations: 0,
    cumulativeGasUsed: BigNumber.from(0),
    effectiveGasPrice: BigNumber.from(0),
    byzantium: true,
    type: 0,
    status: 1,
  };

  const transaction: ContractTransaction = {
    gasLimit: BigNumber.from(0),
    data: "0x0",
    value: BigNumber.from(0),
    chainId: 1337,
    hash: "0x0",
    confirmations: 1,
    from: "0x0",
    nonce: 0,
    wait: () => Promise.resolve(receipt),
  };

  return Promise.resolve(transaction);
};

const getEvaluationData = (overrides?: Partial<HypercertEvaluationSchema>): HypercertEvaluationSchema => {
  let mockData: HypercertEvaluationSchema = {
    creator: "0x17ec8597ff92C3F44523bDc65BF0f1bE632917ff",
    evaluationData: {
      type: "duplicate",
      duplicateHypercerts: [
        {
          chainId: "0x1",
          contract: "0x822F17A9A5EeCFd66dBAFf7946a8071C265D1d07",
          claimId: "1",
        },
        {
          chainId: "0x1",
          contract: "0x822F17A9A5EeCFd66dBAFf7946a8071C265D1d07",
          claimId: "2",
        },
      ],
      realHypercert: {
        chainId: "0x1",
        contract: "0x822F17A9A5EeCFd66dBAFf7946a8071C265D1d07",
        claimId: "3",
      },
      explanation: "These hypercerts are duplicates",
    },
    evaluationSource: {
      type: "EAS",
      chainId: "0x1",
      contract: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e",
      uid: "0x1234567890abcdef",
    },
  };

  return { ...mockData, ...overrides };
};

const getDuplicateEvaluationData = (overrides?: Partial<DuplicateEvaluation>): DuplicateEvaluation => {
  let mockData: DuplicateEvaluation = {
    type: "duplicate",
    duplicateHypercerts: [
      {
        chainId: "0x1",
        contract: "0x822F17A9A5EeCFd66dBAFf7946a8071C265D1d07",
        claimId: "1",
      },
      {
        chainId: "0x1",
        contract: "0x822F17A9A5EeCFd66dBAFf7946a8071C265D1d07",
        claimId: "2",
      },
    ],
    realHypercert: {
      chainId: "0x1",
      contract: "0x822F17A9A5EeCFd66dBAFf7946a8071C265D1d07",
      claimId: "3",
    },
    explanation: "These hypercerts are duplicates",
  };

  return { ...mockData, ...overrides };
};

const getSimpleTextEvaluationData = (overrides?: Partial<SimpleTextEvaluation>): SimpleTextEvaluation => {
  let mockData: SimpleTextEvaluation = {
    type: "simpleText",
    text: "This is a simple text evaluation",
    hypercert: {
      chainId: "0x1",
      contract: "0x822F17A9A5EeCFd66dBAFf7946a8071C265D1d07",
      claimId: "3",
    },
  };

  return { ...mockData, ...overrides };
};

export {
  getAllowlist,
  getFormattedMetadata,
  getRawInputData,
  mockContractResponse,
  getEvaluationData,
  getDuplicateEvaluationData,
  getSimpleTextEvaluationData,
};
