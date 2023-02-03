export const burnInteractionLabels = {
  toastSuccess: (transactionHash: string) =>
    `Certificate ${transactionHash} successfully burned`,
  toastError: "Something went wrong while burning the certificate",
};

export const mintInteractionLabels = {
  toastSuccess: `Certificate successfully minted`,
  toastFractionSuccess: "Successfully minted your share of the hypcert",
  toastBatchSuccess: "Successfully minted all available fractions",
  toastError: "Something went wrong while minting the certificate",
  toastRejected: "User rejected the contract interaction",
};

export const mergeInteractionLabels = {
  toastSuccess: "HyperCert fractions successfully merged",
  toastError: "HyperCert fractions could not be merged",
};

export const splitInteractionLabels = {
  toastSuccess: "HyperCert fractions successfully split",
  toastError: "HyperCert fractions could not be split",
};
