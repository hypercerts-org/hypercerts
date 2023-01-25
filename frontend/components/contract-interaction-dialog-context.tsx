import React, { PropsWithChildren, useContext, useState } from "react";
import { Dialog, DialogTitle, Typography } from "@mui/material";

type StepDescriptions = Record<string, string>;

interface IContractInteractionModalProvider {
  showModal: (args: { stepDescriptions: StepDescriptions }) => void;
  setStep: (step: string) => void;
  hideModal: () => void;
}

const ContractInteractionDialogContext =
  React.createContext<IContractInteractionModalProvider>({
    showModal: () => {},
    setStep: () => {},
    hideModal: () => {},
  });

export const ContractInteractionDialogProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [showContractModal, setShowContractModal] = useState(false);
  const [stepDescriptions, setStepDescriptions] = useState<StepDescriptions>(
    {}
  );
  const [step, setStep] = useState<string>();

  const onShowModal = (args: { stepDescriptions: StepDescriptions }) => {
    setStepDescriptions(args.stepDescriptions);
    setShowContractModal(true);
  };

  const onCloseModal = () => {
    setStep(undefined);
    setStepDescriptions({});
    setShowContractModal(false);
  };

  return (
    <ContractInteractionDialogContext.Provider
      value={{
        setStep,
        showModal: onShowModal,
        hideModal: onCloseModal,
      }}
    >
      {children}
      <Dialog open={showContractModal} onClose={onCloseModal}>
        <DialogTitle>Contract interaction</DialogTitle>
        {Object.keys(stepDescriptions).map((key) => (
          <Typography
            key={key}
            fontWeight={key === step ? 700 : 400}
            color={key === step ? "green" : undefined}
          >
            {stepDescriptions[key]}
          </Typography>
        ))}
      </Dialog>
    </ContractInteractionDialogContext.Provider>
  );
};

export const useContractModal = () =>
  useContext(ContractInteractionDialogContext);
