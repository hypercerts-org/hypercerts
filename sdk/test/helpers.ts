import { BigNumber, ContractReceipt, ContractTransaction } from "ethers";

import { formatHypercertData } from "../src/utils/formatter.js";

export type TestDataType = Parameters<typeof formatHypercertData>[0];

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

export { getRawInputData, mockContractResponse };
