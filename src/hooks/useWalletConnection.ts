/** biome-ignore-all lint/suspicious/noExplicitAny: The any values are correct in that DAppKit should allow any type. */

import type { DAppKit, RegisteredDAppKit } from "@mysten/dapp-kit-core";
import { createSignal, onCleanup } from "solid-js";
import { useDappKitContext } from "src/components/DAppKitProvider";

export type UseWalletConnectionOptions<TDAppKit extends DAppKit<any>> = {
  dAppKit?: TDAppKit;
};

export function useWalletConnection<TDAppKit extends DAppKit<any> = RegisteredDAppKit>(
  options: UseWalletConnectionOptions<TDAppKit> = {},
) {
  const instance = options.dAppKit || useDappKitContext();

  const targetStore = instance.stores.$connection;

  const [connectionState, setConnectionState] = createSignal(targetStore.get());

  const unsubscribe = targetStore.subscribe((newValue) => {
    setConnectionState(newValue);
  });

  onCleanup(() => unsubscribe());

  return connectionState;
}
