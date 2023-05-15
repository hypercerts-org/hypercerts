import { BigNumber, ContractReceipt, ContractTransaction, ethers } from "ethers";

import { Allowlist, AllowlistEntry, HypercertMetadata } from "../src/index.js";
import { formatHypercertData } from "../src/utils/formatter.js";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

export type TestDataType = Parameters<typeof formatHypercertData>[0];

const getAllowlist = ({
  size = 10,
  units = 100,
  address,
}: {
  size?: number;
  units?: number;
  address?: string;
}): { allowlist: Allowlist; merkleTree: StandardMerkleTree<ethers.BigNumberish[]> } => {
  const allowlist: Allowlist = [];
  for (let i = 0; i < size; i++) {
    const allowListEntry: AllowlistEntry = {
      address: ethers.Wallet.createRandom().address,
      units: BigNumber.from(units),
    };
    allowlist.push(allowListEntry);
  }

  if (address) {
    allowlist[0].address = address;
  }

  const merkleTree = StandardMerkleTree.of(
    allowlist.map((p) => [p.address, p.units]),
    ["address", "uint256"],
  );
  return { allowlist, merkleTree };
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

export { getAllowlist, getFormattedMetadata, getRawInputData, mockContractResponse };
