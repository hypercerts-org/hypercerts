export const errors = {
  noWalletConnectedError: "Connect wallet before viewing certificates",
  noCertificatesError: "No certificates found",
  noIpfsDataError: "Ipfs data could not be found",
};

export const labels = {
  burnButtonLabel: "Burn",
};

export const burnFractionModal = {
  confirm: {
    title: "Burn fraction",
    body: (value: number, percentage: string) =>
      `Confirm burning ${value} units (${percentage}) of`,
    closeButton: "Close",
    confirmButton: "Burn",
  },
  burning: {
    title: "Burning",
  },
  complete: {
    title: "Burned fraction successfully!",
    confirmButton: "Done",
  },
  error: {
    noWalletConnected: 'Connect a wallet before burning hypercerts'
  }
};
