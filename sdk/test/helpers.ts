import { faker } from "@faker-js/faker";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

import { HypercertMetadata } from "../src";
import { AllowlistEntry, DuplicateEvaluation, HypercertEvaluationSchema, SimpleTextEvaluation } from "../src/types";
import { formatHypercertData } from "../src/utils/formatter";
import { Chain, foundry } from "viem/chains";
import { PublicClient, WalletClient, createPublicClient, createTestClient, createWalletClient, http } from "viem";
import * as HypercertMinter from "./resources/HypercertMinter.json";
import mockMetadata from "./res/mockMetadata";
import mockData from "./res/mockData";

const mockCorrectMetadataCid = "testCIDMETAfkreigdm2flneb4khd7eixodagst5nrndptgezrjux7gohxcngjn67x6u";
const mockCorrectDataCid = "testCIDDATAfkreigdm2flneb4khd7eixodagst5nrndptgezrjux7gohxcngjn67x6u";
const mockSomeDataCid = "someCIDDATAfkreigdm2flneb4khd7eixodagst5nrndptgezrjux7gohxcngjn67x6u";

export const mockDataSets = {
  hypercertMetadata: {
    cid: mockCorrectMetadataCid,
    data: mockMetadata,
  },
  hypercertData: {
    cid: mockCorrectDataCid,
    data: mockMetadata.hypercert,
  },
  someData: {
    cid: mockSomeDataCid,
    data: mockData,
  },
};

export const pool = Number(process.env.VITEST_POOL_ID ?? 1);
export const anvil = {
  ...foundry, // We are using a mainnet fork for testing.
  id: 11155111,
  rpcUrls: {
    // These rpc urls are automatically used in the transports.
    default: {
      // Note how we append the worker id to the local rpc urls.
      http: [`http://127.0.0.1:8545/${pool}`],
      webSocket: [`ws://127.0.0.1:8545/${pool}`],
    },
    public: {
      // Note how we append the worker id to the local rpc urls.
      http: [`http://127.0.0.1:8545/${pool}`],
      webSocket: [`ws://127.0.0.1:8545/${pool}`],
    },
  },
} as const satisfies Chain;

export const testClient = createTestClient({
  chain: anvil,
  mode: "anvil",
  transport: http(),
});

export const publicClient: PublicClient = createPublicClient({
  chain: anvil,
  batch: {
    multicall: true,
  },
  transport: http(),
});

export const walletClient: WalletClient = createWalletClient({
  chain: anvil,
  transport: http(),
  account: faker.finance.ethereumAddress() as `0x${string}`,
});

export const HypercertMinterByteCode = HypercertMinter.bytecode as `0x${string}`;

export type TestDataType = Parameters<typeof formatHypercertData>[0];

/**
 * Builds allowlist and merkle tree
 * @param overrides contains the size and a valid ethereum address that should be present once in the allowlist
 */
const getAllowlist = ({
  size = 10,
  units = 1n,
  address,
}: {
  size?: number;
  address?: `0x${string}`;
  units?: bigint;
} = {}) => {
  //generate allowlist array based on possible overrides
  const allowlist: AllowlistEntry[] = [];
  for (let i = 0; i < size; i++) {
    const _address = faker.finance.ethereumAddress();

    allowlist.push({ address: _address, units });
  }

  if (address) {
    allowlist[0].address = address;
  }
  //add a valid address once to the allowlist

  const mappedAllowlist = allowlist.map((entry) => [entry.address.toString(), entry.units.toString()]);

  const merkleTree = StandardMerkleTree.of(mappedAllowlist, ["address", "uint256"]);

  const totalUnits = allowlist.reduce((acc, entry) => acc + BigInt(entry.units), 0n);

  return { allowlist, merkleTree, totalUnits };
};

const getRawInputData = (overrides?: Partial<TestDataType>): TestDataType => {
  const now = new Date().getTime() / 1000;

  const testData = {
    name: "test name",
    description: "test description",
    image: "some test image",
    contributors: ["0x111", "0x22"],
    external_url: "https://example.com",
    impactScope: ["test impact scope"],
    impactTimeframeStart: now - 1000,
    impactTimeframeEnd: now,
    workScope: ["test work scope"],
    workTimeframeStart: now - 1000,
    workTimeframeEnd: now,
    properties: [{ trait_type: "test trait type", value: "aaa" }],
    rights: ["test right 1", "test right 2"],
    version: "0.0.1",
  };

  return { ...testData, ...overrides } as TestDataType;
};

const getFormattedMetadata = (overrides?: Partial<TestDataType>): HypercertMetadata => {
  const rawData = getRawInputData(overrides);
  const { data: formattedData } = formatHypercertData(rawData);
  if (!formattedData) throw new Error("Could not format metadata");
  return formattedData as HypercertMetadata;
};

const getEvaluationData = (overrides?: Partial<HypercertEvaluationSchema>): HypercertEvaluationSchema => {
  const mockData: HypercertEvaluationSchema = {
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
      type: "IPFS",
      cid: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e",
    },
  };

  return { ...mockData, ...overrides };
};

const getDuplicateEvaluationData = (overrides?: Partial<DuplicateEvaluation>): DuplicateEvaluation => {
  const mockData: DuplicateEvaluation = {
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
  const mockData: SimpleTextEvaluation = {
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
  getEvaluationData,
  getDuplicateEvaluationData,
  getSimpleTextEvaluationData,
};
