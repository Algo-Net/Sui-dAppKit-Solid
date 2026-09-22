import "@mysten/dapp-kit-core/web";

export * from "@mysten/dapp-kit-core";

export type { DAppKitProviderProps } from "src/components/DAppKitProvider";
export { DAppKitProvider, useDappKitContext } from "src/components/DAppKitProvider";

export { useCurrentAccount } from "src/hooks/useCurrentAccount";
export { useCurrentClient } from "src/hooks/useCurrentClient";
export { useCurrentNetwork } from "src/hooks/useCurrentNetwork";
export { useCurrentWallet } from "src/hooks/useCurrentWallet";
export { useDAppKit } from "src/hooks/useDAppKit";
export { useWalletConnection } from "src/hooks/useWalletConnection";
export { useWAllets } from "src/hooks/useWallets";
