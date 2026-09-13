import type { DAppKit, DAppKitCompatibleClient, RegisteredDAppKit, UiWallet } from "@mysten/dapp-kit-core";
import { createSignal, onCleanup } from "solid-js";
import { useDappKitContext } from "src/components/DAppKitProvider";

export type UseWalletOptions<TDAppKit extends DAppKit<[], DAppKitCompatibleClient>> = {
  dAppKit?: TDAppKit;
};

export function useWAllets<TDAppKit extends DAppKit<[], DAppKitCompatibleClient> = RegisteredDAppKit>(
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
