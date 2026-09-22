import type { DAppKit, DAppKitCompatibleClient } from "@mysten/dapp-kit-core";
import { useDappKitContext } from "../DAppKitProvider";

declare module "@solidjs/web" {
  namespace JSX {
    interface IntrinsicElements {
      "mysten-dapp-kit-connect-modal": JSX.HTMLAttributes<HTMLElement> & {
        instance?: DAppKit<[], DAppKitCompatibleClient>;
        "prop:instance"?: DAppKit<[], DAppKitCompatibleClient>;
      };
    }
  }
}

export type ConnectModalProps = {
  dAppKit?: DAppKit<[], DAppKitCompatibleClient>;
};

export function ConnectModal(props: ConnectModalProps) {
  const dAppKit = () => props.dAppKit || useDappKitContext();

  return <mysten-dapp-kit-connect-modal {...props} prop:instance={dAppKit()} />;
}
