import type { DAppKit, DAppKitCompatibleClient, RegisteredDAppKit } from "@mysten/dapp-kit-core";
import { createSignal, onSettled } from "solid-js";
import { useDappKitContext } from "src/components/DAppKitProvider";

export type UseCurrentClientOptions<TDAppKit extends DAppKit<[], DAppKitCompatibleClient>> = {
  dAppKit?: TDAppKit;
};

export function useCurrentClient<TDAppKit extends DAppKit<[], DAppKitCompatibleClient> = RegisteredDAppKit>(
  options: UseCurrentClientOptions<TDAppKit> = {},
) {
  const instance = options.dAppKit || useDappKitContext();

  const targetStore = instance.stores.$currentClient;

  const [currentClientState, setCurrentClientState] = createSignal(targetStore.get());

  onSettled(() => {
    const unsubscribe = targetStore.subscribe((newValue) => {
      setCurrentClientState(newValue);
    });

    return unsubscribe;
  });

  return currentClientState;
}
