import { useAccount } from "wagmi";

/**
 * Addresses come with uppercase from the hook. We use lowercase everywhere else
 **/
export function useAccountLowerCase() {
  const data = useAccount();
  return {
    ...data,
    address: data.address?.toLowerCase(),
  };
}
