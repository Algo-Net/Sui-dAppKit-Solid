import type { DAppKit, DAppKitCompatibleClient, RegisteredDAppKit } from "@mysten/dapp-kit-core";
import { useWalletConnection } from "src/hooks/useWalletConnection";

export type UseCurrentWalletOptions<TDAppKit extends DAppKit<[], DAppKitCompatibleClient>> = {
  dAppKit?: TDAppKit;
};

export function useCurrentWallet<TDAppKit extends DAppKit<[], DAppKitCompatibleClient> = RegisteredDAppKit>(
  options: UseCurrentWalletOptions<TDAppKit> = {},
) {
  const connection = useWalletConnection({ dAppKit: options.dAppKit });

  return () => connection().wallet;
}
