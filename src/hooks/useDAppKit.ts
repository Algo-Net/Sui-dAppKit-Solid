/** biome-ignore-all lint/suspicious/noExplicitAny: The any values are correct in that DAppKit should allow any type. */

import type { DAppKit, RegisteredDAppKit } from "@mysten/dapp-kit-core";
import { useContext } from "solid-js";
import { DAppKitContext } from "src/components/DAppKitProvider";

export function useDAppKit<TDAppKit extends DAppKit<any> = RegisteredDAppKit>(dAppKit?: TDAppKit) {
  if (dAppKit) return dAppKit;

  const contextValue = useContext(DAppKitContext);

  if (!contextValue) {
    throw new Error("Could not find DAppKitContext. Ensure that you are using this within a DAppKitProvider");
  }

  return contextValue as TDAppKit;
}
