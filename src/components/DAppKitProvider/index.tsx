import { createContext, useContext } from "solid-js";
import type { ParentProps } from "solid-js";
import type { DefaultExpectedDppKit } from "@mysten/dapp-kit-core";

export const DAppKitContext = createContext<DefaultExpectedDppKit>();

export type DAppKitProviderProps = ParentProps<{
  dAppKit: DefaultExpectedDppKit;
}>;

export function DAppKitProvider(props: DAppKitProviderProps) {
  return (
    <DAppKitContext value={props.dAppKit}>{props.children}</DAppKitContext>
  );
}

export function useDappKitContext() {
  const context = useContext(DAppKitContext);

  return context;
}
