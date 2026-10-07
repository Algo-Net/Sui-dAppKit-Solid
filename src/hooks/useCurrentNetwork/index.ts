import type { DAppKit, DAppKitCompatibleClient, RegisteredDAppKit } from "@mysten/dapp-kit-core";
import { createSignal, onSettled } from "solid-js";
import { useDappKitContext } from "src/components/DAppKitProvider";

export type UseCurrentNetworkOptions<TDAppKit extends DAppKit<[], DAppKitCompatibleClient>> = {
  dAppKit?: TDAppKit;
};

export function useCurrentNetwork<TDAppKit extends DAppKit<[], DAppKitCompatibleClient> = RegisteredDAppKit>(
  options: UseCurrentNetworkOptions<TDAppKit> = {},
) {
  const instance = options.dAppKit || useDappKitContext();

  const targetStore = instance.stores.$currentNetwork;

  const [currentNetworkState, setCurrentNetworkState] = createSignal(targetStore.get());

  onSettled(() => {
    const unsubscribe = targetStore.subscribe((newValue) => {
      setCurrentNetworkState(newValue);
    });

    return unsubscribe;
  });

  return currentNetworkState;
}
