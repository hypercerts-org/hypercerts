import { useAccountLowerCase } from "../hooks/account";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import {
  useGetAllEligibility,
  useMintFractionAllowlistBatchSDK,
} from "../hooks/mintFractionAllowlistBatchSDK";

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

  const router = useRouter();
  const { data: claimIds } = useGetAllEligibility(address ?? "");
  const { write } = useMintFractionAllowlistBatchSDK({
    onComplete: () => {
      console.log("Minted all of them");
      // Store the current time
      window.localStorage.setItem(LOCALSTORAGE_KEY, `${Date.now()}`);
      router.reload();
    },
  });

  return (
    <Button
      disabled={!claimIds?.length || disabled}
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
