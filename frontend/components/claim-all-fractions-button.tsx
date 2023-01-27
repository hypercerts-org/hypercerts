import { Button } from "@mui/material";
import {
  useGetAllEligibility,
  useMintFractionAllowlistBatch,
} from "../hooks/mintFractionAllowlistBatch";
import { useAccount } from "wagmi";

export const ClaimAllFractionsButton = ({
  text = "Claim all fractions",
  className,
}: {
  text: string;
  className?: string;
}) => {
  const { address } = useAccount();
  const { data: claimIds } = useGetAllEligibility(address || "");
  const { write } = useMintFractionAllowlistBatch({
    onComplete: () => {
      console.log("Minted all of them");
    },
  });
  return (
    <Button
      disabled={!claimIds?.length}
      className={className}
      onClick={() => write()}
      variant="outlined"
      size="small"
    >
      {text}
    </Button>
  );
};

export default ClaimAllFractionsButton;
