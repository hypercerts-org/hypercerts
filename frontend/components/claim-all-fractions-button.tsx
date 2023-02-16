import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useAccountLowerCase } from "../hooks/account";
import {
  useGetAllEligibility,
  useMintFractionAllowlistBatch,
} from "../hooks/mintFractionAllowlistBatch";

export const ClaimAllFractionsButton = ({
  text = "Claim all fractions",
  className,
}: {
  text: string;
  className?: string;
}) => {
  const { address } = useAccountLowerCase();

  const router = useRouter();
  const { data: claimIds } = useGetAllEligibility(address ?? "");
  const { write } = useMintFractionAllowlistBatch({
    onComplete: () => {
      console.log("Minted all of them");
      router.reload();
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
