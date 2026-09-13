/** biome-ignore-all lint/suspicious/noExplicitAny: The any values are correct in that DAppKit should allow any type. */

import type { DAppKit, RegisteredDAppKit, UiWallet } from "@mysten/dapp-kit-core";
import { createSignal, onCleanup } from "solid-js";
import { useDappKitContext } from "src/components/DAppKitProvider";

export type UseWalletOptions<TDAppKit extends DAppKit<any>> = {
  dAppKit?: TDAppKit;
};

export function useWAllets<TDAppKit extends DAppKit<any> = RegisteredDAppKit>(
  options: UseWalletOptions<TDAppKit> = {},
) {
  const instance = options.dAppKit || useDappKitContext();

  const targetStore = instance.stores.$wallets;

  const [walletState, setWalletState] = createSignal<readonly UiWallet[]>(targetStore.get());

  const unsubscribe = targetStore.subscribe((newValue) => {
    setWalletState(newValue);
  });

  onCleanup(() => unsubscribe());

  return walletState;
}
