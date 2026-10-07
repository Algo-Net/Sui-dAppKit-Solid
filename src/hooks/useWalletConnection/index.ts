import type { DAppKit, DAppKitCompatibleClient, RegisteredDAppKit } from "@mysten/dapp-kit-core";
import { createSignal, onSettled } from "solid-js";
import { useDappKitContext } from "src/components/DAppKitProvider";

export type UseWalletConnectionOptions<TDAppKit extends DAppKit<[], DAppKitCompatibleClient>> = {
  dAppKit?: TDAppKit;
};

export function useWalletConnection<TDAppKit extends DAppKit<[], DAppKitCompatibleClient> = RegisteredDAppKit>(
  options: UseWalletConnectionOptions<TDAppKit> = {},
) {
  const instance = options.dAppKit || useDappKitContext();

  const targetStore = instance.stores.$connection;

  const [connectionState, setConnectionState] = createSignal(targetStore.get());

  onSettled(() => {
    const unsubscribe = targetStore.subscribe((newValue) => {
      setConnectionState(newValue);
    });

    return unsubscribe;
  });

  return connectionState;
}
