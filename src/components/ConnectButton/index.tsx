import type { DAppKit, DAppKitCompatibleClient } from "@mysten/dapp-kit-core";
import { useDappKitContext } from "src/components/DAppKitProvider";

declare module "@solidjs/web" {
  namespace JSX {
    interface IntrinsicElements {
      "mysten-dapp-kit-connect-button": JSX.HTMLAttributes<HTMLElement> & {
        instance?: DAppKit<[], DAppKitCompatibleClient>;
      };
    }
  }
}

export type ConnectButtonProps = {
  dAppKit?: DAppKit<[], DAppKitCompatibleClient>;
};

export function ConnectButton(props: ConnectButtonProps) {
  const dAppKit = () => props.dAppKit || useDappKitContext();

  return <mysten-dapp-kit-connect-button {...props} instance={dAppKit()} />;
}
