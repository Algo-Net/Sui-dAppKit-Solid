import type { DAppKit, DAppKitCompatibleClient, RegisteredDAppKit } from "@mysten/dapp-kit-core";
import { useWalletConnection } from "src/hooks/useWalletConnection";

export type UseCurrentAccountOptions<TDAppKit extends DAppKit<[], DAppKitCompatibleClient>> = {
  dAppKit?: TDAppKit;
};

export function useCurrentAccount<TDAppKit extends DAppKit<[], DAppKitCompatibleClient> = RegisteredDAppKit>(
  options: UseCurrentAccountOptions<TDAppKit> = {},
) {
  const connection = useWalletConnection({ dAppKit: options.dAppKit });

  return () => connection().account;
}
