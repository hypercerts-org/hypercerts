export const splitFractionModal = {
  define: {
    title: "Split Fraction",
    body: (fractionUnits: string, totalUnits: string) =>
      `This fraction consists of ${fractionUnits}, out of ${totalUnits} for the entire HyperCert. The combined value of the new fractions should be equal to the original value.`,
    valueTooHigh: "Combined value is too high",
    valueTooLow: "Combined value is too low",
    notOneValue: "You need at least two fractions",
    notANumber: "Incorrect value",
    noNegativeValues: "No negative values allowed",
    ready: "You are ready to split",

    inputLabel: "Fractions (one per line)",
    inputHelpText:
      "One fraction per line. Integers only. The sum of all fractions has to be at least 2",
    closeButton: "Close",
    confirmButton: "Split",
  },
  splitting: {
    title: "Splitting",
  },
  complete: {
    title: "Split fraction successfully!",
    confirmButton: "Done",
  },
  error: {
    noWalletConnected: "To split hypercerts, a wallet needs to be connected",
  },
};
