import React, { PropsWithChildren, useContext, useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContentText,
  Step,
  StepLabel,
  Stepper,
  DialogContent,
} from "@mui/material";

type StepDescriptions = Record<string, string>;

interface IContractInteractionModalProvider {
  showModal: (args: { stepDescriptions: StepDescriptions }) => void;
  setStep: (step: string) => void;
  hideModal: () => void;
}

const ContractInteractionDialogContext =
  React.createContext<IContractInteractionModalProvider>({
    showModal: () => {}, // eslint-disable-line
    setStep: () => {}, // eslint-disable-line
    hideModal: () => {}, // eslint-disable-line
  });

export const ContractInteractionDialogProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [showContractModal, setShowContractModal] = useState(false);
  const [stepDescriptions, setStepDescriptions] = useState<StepDescriptions>(
    {},
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
      <Dialog
        open={showContractModal}
        onClose={() => {
          console.log("Manual closing of dialog disabled");
        }}
        disableEscapeKeyDown={true}
        fullWidth={true}
      >
        <DialogTitle>Contract interaction</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Please keep this tab open until completion
          </DialogContentText>
        </DialogContent>

        <Box sx={{ px: 3, pb: 3 }}>
          <Stepper
            orientation="vertical"
            activeStep={step ? Object.keys(stepDescriptions).indexOf(step) : 0}
          >
            {Object.keys(stepDescriptions).map((key) => (
              <Step key={key} classes={{}}>
                <StepLabel>{stepDescriptions[key]}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Dialog>
    </ContractInteractionDialogContext.Provider>
  );
};

export const useContractModal = () =>
  useContext(ContractInteractionDialogContext);
