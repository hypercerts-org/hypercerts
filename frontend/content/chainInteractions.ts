export const burnInteractionLabels = {
  toastSuccess: (transactionHash: string) =>
    `Certificate ${transactionHash} successfully burned`,
  toastError: "Something went wrong while burning the certificate",
};

export const mintInteractionLabels = {
  toastSuccess: (transactionHash: string) =>
    `Certificate ${transactionHash} successfully minted`,
  toastError: "Something went wrong while minting the certificate",
};

export const mergeInteractionLabels = {
  toastSuccess: "HyperCert fractions successfully merged",
  toastError: "HyperCert fractions could not be merged",
};

export const splitInteractionLabels = {
  toastSuccess: "HyperCert fractions successfully split",
  toastError: "HyperCert fractions could not be split",
};
