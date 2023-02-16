import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useAccountLowerCase } from "../hooks/account";
import {
  useGetAllEligibility,
  useMintFractionAllowlistBatch,
} from "../hooks/mintFractionAllowlistBatch";

const LOCALSTORAGE_KEY = "claimAllFractionsTime";
const DELAY = 5 * 60 * 1000; // 5 minutes

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
      // Store the current time
      window.localStorage.setItem(LOCALSTORAGE_KEY, `${Date.now()}`);
      router.reload();
    },
  });

  // Check if we need to wait (been less than DELAY since last claim)
  const lastClaimStr = localStorage.getItem(LOCALSTORAGE_KEY);
  const needToWait = lastClaimStr
    ? Date.now() < parseInt(lastClaimStr) + DELAY
    : false;

  return (
    <Button
      disabled={!claimIds?.length || needToWait}
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
