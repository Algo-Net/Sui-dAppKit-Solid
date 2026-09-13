/** biome-ignore-all lint/suspicious/noExplicitAny: The any values are correct in that DAppKit should allow any type. */

import type { DAppKit, RegisteredDAppKit } from "@mysten/dapp-kit-core";
import { useWalletConnection } from "./useWalletConnection";

export type UseCurrentWalletOptions<TDAppKit extends DAppKit<any>> = {
  dAppKit?: TDAppKit;
};

export function useCurrentWallet<TDAppKit extends DAppKit<any> = RegisteredDAppKit>(
  options: UseCurrentWalletOptions<TDAppKit> = {},
) {
  const connection = useWalletConnection({ dAppKit: options.dAppKit });

  return () => connection().wallet;
}
