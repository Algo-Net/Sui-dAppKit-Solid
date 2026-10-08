# Sui dAppKit Solid <a name="readme-top"></a>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#license)
[![NPM](https://img.shields.io/npm/v/@algonet/sui-dappkit-solid.svg)](https://www.npmjs.com/package/@algonet/sui-dappkit-solid)
[![SolidJS 2](https://img.shields.io/badge/SolidJS-2.0-blue.svg)](https://www.solidjs.com/)
[![SUI SDK](https://img.shields.io/badge/SUI_SDK-%5E2.0.0-brightgreen.svg)](https://github.com/MystenLabs/sui)

A [SolidJS 2](https://www.solidjs.com/) implementation of the Sui dApp kit, providing wallet connection and management utilities for building decentralized applications on the SUI blockchain. This library closely mirrors the structure and API of the official [`@mysten/dapp-kit-react`](https://www.npmjs.com/package/@mysten/dapp-kit-react) package but is purpose-built for SolidJS developers.

---

## ⚙️ Installation

```bash
pnpm add @algonet/sui-dappkit-solid
```

### Peer Dependencies

This library requires the following peer dependencies:

| Package                                                  | Version |
| -------------------------------------------------------- | ------- |
| [@mysten/sui](https://www.npmjs.com/package/@mysten/sui) | ^2.0.0  |
| [solid-js](https://www.npmjs.com/package/solid-js)       | ^2.0.0  |
| [tailwindcss](https://www.npmjs.com/package/tailwindcss) | ^4.0.0  |

---

## 🚀 Quick Start

### 1. Create your DAppKit instance

```tsx
import { createDAppKit } from "@algonet/sui-dapp-kit-solid";
import { SuiGrpcClient } from "@mysten/sui/grpc";

const network = 'testnet';

export const grpcClient = new SuiGrpcClient({
  network,
  baseUrl: "https://fullnode.testnet.sui.io:443",
});

const dAppKit = createDAppKit({
  networks: [network],
  createClient: () => grpcClient,
  autoConnect: true,
  defaultNetwork: network
});
```

<br>

### 2. Wrap your app with `DAppKitProvider`

```tsx
import { DAppKitProvider } from "@algonet/sui-dappkit-solid";

function App() {
  return (
    <DAppKitProvider dAppKit={dAppKit}>
      <YourComponents />
    </DAppKitProvider>
  );
}
```

<br>

### 3. Connect UI components

Import the pre-built UI components from the `ui` entry point:

```tsx
import { ConnectButton, ConnectModal } from "@algonet/sui-dappkit-solid/ui";

function YourUI() {
  return (
    <>
      <ConnectButton />
      <ConnectModal />
    </>
  );
}
```

<br>

### 4. Use hooks for wallet state

```tsx
import { useCurrentAccount, useWalletConnection } from "@algonet/sui-dappkit-solid";

function AccountDisplay() {
  const account = useCurrentAccount();
  const connection = useWalletConnection();

  return (
    <div>
      {account()?.address ?? "Not connected"}
      {/* Or access other properties like .wallet, .discoveredWallets */}
    </div>
  );
}
```

<br>

## Components

### `DAppKitProvider`

The context provider that supplies the DAppKit instance throughout your SolidJS component tree.

| Prop       | Type                    | Required | Description                                                   |
| ---------- | ----------------------- | -------- | ------------------------------------------------------------- |
| `dAppKit`  | `DefaultExpectedDppKit` | ✅ Yes    | The DAppKit instance created via `createDAppKit`              |
| `children` | `ParentProps`           | ✅ Yes    | Child components that will have access to the DAppKit context |

```tsx
type DAppKitProviderProps = ParentProps<{
  dAppKit: DefaultExpectedDppKit;
}>;
```

<br>

### `ConnectButton`

A pre-built button component that toggles wallet connection. Renders as a custom element `<mysten-dapp-kit-connect-button>`. The underlying DOM element is defined by the core package.

| Prop      | Type                                   | Required | Description                                    |
| --------- | -------------------------------------- | -------- | ---------------------------------------------- |
| `dAppKit` | `DAppKit<[], DAppKitCompatibleClient>` | ❌ No     | Optional override of the instance from context |

```tsx
type ConnectButtonProps = {
  dAppKit?: DAppKit<[], DAppKitCompatibleClient>;
};
```

<br>

### `ConnectModal`

A pre-built modal component for wallet discovery and connection. Renders as a custom element `<mysten-dapp-kit-connect-modal>`.

| Prop      | Type                                   | Required | Description                                    |
| --------- | -------------------------------------- | -------- | ---------------------------------------------- |
| `dAppKit` | `DAppKit<[], DAppKitCompatibleClient>` | ❌ No     | Optional override of the instance from context |

```tsx
type ConnectModalProps = {
  dAppKit?: DAppKit<[], DAppKitCompatibleClient>;
};
```

<br>

## Hooks

All hooks can optionally accept a `dAppKit` parameter to override the instance from context. They return SolidJS signals that reactively update when wallet state changes.

### `useDAppKit`

Returns the active DAppKit instance. Must be called within a `DAppKitProvider`.

```tsx
function useDAppKit<TDAppKit>(dAppKit?: TDAppKit): TDAppKit;
```

<br>

### `useCurrentAccount`

Returns a signal for the currently connected account address, or `null` if not connected.

```tsx
type UseCurrentAccountOptions<TDAppKit> = {
  dAppKit?: TDAppKit;
};

function useCurrentAccount(options?: UseCurrentAccountOptions<TDAppKit>): () => Account | null;
```

<br>

### `useCurrentWallet`

Returns a signal for the currently connected wallet.

```tsx
type UseCurrentWalletOptions<TDAppKit> = {
  dAppKit?: TDAppKit;
};

function useCurrentWallet(options?: UseCurrentWalletOptions<TDAppKit>): () => WalletInfo | null;
```

<br>

### `useCurrentClient`

Returns a signal for the current RPC client instance.

```tsx
type UseCurrentClientOptions<TDAppKit> = {
  dAppKit?: TDAppKit;
};

function useCurrentClient(options?: UseCurrentClientOptions<TDAppKit>): () => SuiClient | undefined;
```

<br>

### `useCurrentNetwork`

Returns a signal for the current network.

```tsx
type UseCurrentNetworkOptions<TDAppKit> = {
  dAppKit?: TDAppKit;
};

function useCurrentNetwork(options?: UseCurrentNetworkOptions<TDAppKit>): () => Network | undefined;
```

<br>

### `useWalletConnection`

Returns a signal for the full wallet connection state (account, wallet, discovered wallets, etc.).

```tsx
type UseWalletConnectionOptions<TDAppKit> = {
  dAppKit?: TDAppKit;
};

function useWalletConnection(options?: UseWalletConnectionOptions<TDAppKit>): () => Connection | null;
```

<br>

### `useWallets`

Returns a signal for the list of discovered wallets.

```tsx
type UseWalletOptions<TDAppKit> = {
  dAppKit?: TDAppKit;
};

function useWallets(options?: UseWalletOptions<TDAppKit>): () => readonly UiWallet[];
```

<br>

## Context

### `useDappKitContext`

Internal hook to access the DAppKit context directly. Useful when you need low-level access to the provider's context value.

```tsx
function useDappKitContext(): DefaultExpectedDppKit | undefined;
```

<br>

## Re-exports

This library re-exports everything from **`@mysten/dapp-kit-core`** as a convenience:

```tsx
export * from "@mysten/dapp-kit-core";
```

See the [dApp Kit Core docs](https://github.com/MystenLabs/ts-sdks/tree/main/packages/dapp-kit/packages/dapp-kit-core) for all core types and utilities.

<br>

## 📁 Project Structure

```
sui-dappkit-solid/
├── src/
│   ├── components/
│   │   ├── ConnectButton/     # Pre-built connect button component
│   │   ├── ConnectModal/      # Pre-built connect modal component
│   │   └── DAppKitProvider/   # Context provider & hook
│   ├── hooks/
│   │   ├── useCurrentAccount/     # Current account signal
│   │   ├── useCurrentClient/      # Current RPC client signal
│   │   ├── useCurrentNetwork/     # Current network signal
│   │   ├── useCurrentWallet/      # Current wallet info signal
│   │   ├── useDAppKit/            # DAppKit instance retrieval
│   │   ├── useWalletConnection/   # Connection state signal
│   │   └── useWallets/            # Discovered wallets list signal
│   ├── index.ts                # Main entry point (hooks + components)
│   ├── ui.ts                   # UI entries point (ConnectButton, ConnectModal, CSS)
│   ├── ui.css                  # Tailwind-based default styles
│   └── global.d.ts             # Type declarations
├── package.json
├── tsconfig.json               # TypeScript config (ES2022, strict)
├── vite.config.ts              # Vite lib build with Solid plugin + dts
├── vitest.config.ts            # Vitest test configuration
├── biome.json                  # Biome formatter / linter config
└── README.md
```

<br>

## 🛠 Development
### Prerequisites
- **[Node.js](https://nodejs.org/)** v26.4.0 (see `.nvmrc`)
- **[pnpm](https://pnpm.io/)** v10.33.2

<br>

### Setup
```bash
git clone https://github.com/Algo-Net/Sui-dAppKit-Solid.git
cd sui-dappkit-solid
pnpm install
```

<br>

### Scripts

| Script       | Description                                                 |
| ------------ | ----------------------------------------------------------- |
| `pnpm build` | Build the library with Vite (ESM) + TypeScript declarations |
| `pnpm test`  | Run the test suite with Vitest                              |
| `pnpm lint`  | Lint and format with Biome                                  |

<br>

### Building
The library is built with [Vite](https://vitejs.dev/) in library mode, producing:

- **`dist/index.js`** — Main entry (hooks + components)
- **`dist/ui.js`** — UI components entry
- **`dist/sui-dapp-kit-solid.css`** — Default stylesheet
- TypeScript declaration files (`.d.ts`) alongside each entry

```bash
pnpm build
```

<br>

### Running Tests

```bash
pnpm test
```

Tests are written with [Vitest](https://vitest.dev/) and render hooks/components using [`@solidjs/testing-library`](https://www.npmjs.com/package/@solidjs/testing-library).

<br>

## 🔧 Configuration
### Biome (Linter & Formatter)

This project uses [Biome](https://biomejs.dev/) for linting and formatting:

- **Line width:** 120 characters
- **Indentation:** 4 spaces
- **Quotes:** Double
- Includes import organization on save via assist actions

```bash
# Lint and auto-fix
pnpm lint
```

<br>

### TypeScript

- **Target:** ES2022
- **Module resolution:** Bundler strategy (`"bundler"`)
- **Strict mode:** Enabled
- **JSX:** Preserved (handled by the Solid compiler)
- **`jsxImportSource`:** `@solidjs/web`

<br>

## 🤝 Contributing

The scope of this project is to provide a SolidJS equivalent to the react implementation. Any additions, improvements or fixes that fall within this scope are welcome.

Please feel free to submit issues and pull requests.
