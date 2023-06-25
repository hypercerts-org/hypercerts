import { useAccountLowerCase } from "../hooks/account";
import {
  useGetAllEligibility,
  useMintFractionAllowlistBatch,
} from "../hooks/mintFractionAllowlistBatch";
import { Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import useCheckWriteable from "../hooks/checkWriteable";

const LOCALSTORAGE_KEY = "claimAllFractionsTime";
const DELAY = 5 * 60 * 1000; // 5 minutes
export const claimedRecently = () => {
  // Check if we need to wait (been less than DELAY since last claim)
  const lastClaimStr = localStorage.getItem(LOCALSTORAGE_KEY);
  const needToWait = lastClaimStr
    ? Date.now() < parseInt(lastClaimStr) + DELAY
    : false;
  return needToWait;
};

export const ClaimAllFractionsButton = ({
  className,
  text = "Claim all fractions",
  disabled,
}: {
  className?: string;
  text: string;
  disabled?: boolean;
}) => {
  const { address } = useAccountLowerCase();
  const { checkWriteable, writeable } = useCheckWriteable();

  const router = useRouter();
  const { data: claimIds } = useGetAllEligibility(address ?? "");
  const { write, txPending } = useMintFractionAllowlistBatch({
    onComplete: () => {
      console.log("Minted all of them");
      // Store the current time
      window.localStorage.setItem(LOCALSTORAGE_KEY, `${Date.now()}`);
      router.reload();
    },
  });

  const handleClaim = async () => {
    const writeable = await checkWriteable();
    if (writeable) {
      write();
    }
  };

  return (
    <Button
      disabled={!writeable || !claimIds?.length || disabled || txPending}
      className={className}
      onClick={() => handleClaim()}
      variant="outlined"
      size="small"
      startIcon={txPending ? <CircularProgress size="1rem" /> : undefined}
    >
      {text}
    </Button>
  );
};

export default ClaimAllFractionsButton;
