import type { DAppKit, DAppKitCompatibleClient } from "@mysten/dapp-kit-core";
import { renderHook } from "@solidjs/testing-library";
import type { JSX } from "@solidjs/web/jsx-runtime";
import { DAppKitProvider } from "src/components/DAppKitProvider";
import { describe, expect, it } from "vitest";
import { useWAllets } from "./useWallets";

interface MockState {
  name: string;
}

// Create a mock store helper that mimics a nanostore structure
function createMockStore(initialValue: MockState[]) {
  let currentValue = initialValue;
  const subscribers = new Set<(val: MockState[]) => void>();

  return {
    get: () => currentValue,
    subscribe: (callback: (val: MockState[]) => void) => {
      subscribers.add(callback);
      return () => subscribers.delete(callback);
    },
    emit: (newValue: MockState[]) => {
      currentValue = newValue;
      subscribers.forEach((callback) => {
        callback(newValue);
      });
    },
  };
}

describe("useWallets()", () => {
  it("subscribes to the wallets store and returns the initial wallet array", () => {
    const mockWalletStore = createMockStore([{ name: "Slush Wallet" }]);

    const mockDAppKit = { stores: { $wallets: mockWalletStore } } as unknown as DAppKit<[], DAppKitCompatibleClient>;

    const wrapper = (props: { children: JSX.Element }) => (
      <DAppKitProvider dAppKit={mockDAppKit}>{props.children}</DAppKitProvider>
    );

    const { result } = renderHook(() => useWAllets(), { wrapper });

    expect(result()).toEqual([{ name: "Slush Wallet" }]);
  });

  it(" updates dynamically when the underlying core store broadcasts a new wallet list change", async () => {
    const mockWalletStore = createMockStore([{ name: "Slush Wallet" }]);

    const mockDAppKit = { stores: { $wallets: mockWalletStore } } as unknown as DAppKit<[], DAppKitCompatibleClient>;

    const wrapper = (props: { children: JSX.Element }) => (
      <DAppKitProvider dAppKit={mockDAppKit}>{props.children}</DAppKitProvider>
    );

    const { result } = renderHook(() => useWAllets(), { wrapper });

    mockWalletStore.emit([{ name: "Slush Wallet" }, { name: "EVE Vault" }]);

    // Allow event loop to turn once so the signal queue is completely finished.
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(result()).toEqual([{ name: "Slush Wallet" }, { name: "EVE Vault" }]);
  });

  it("respects an explicitly passed dAppKit instance override rathr than using the parent context", () => {
    const primaryStore = createMockStore([{ name: "Primary Wallet" }]);
    const overrideStore = createMockStore([{ name: "Override Wallet" }]);

    const primaryDAppKit = { stores: { $wallets: primaryStore } } as unknown as DAppKit<[], DAppKitCompatibleClient>;
    const overrideDAppKit = { stores: { $wallets: overrideStore } } as unknown as DAppKit<[], DAppKitCompatibleClient>;

    const wrapper = (props: { children: JSX.Element }) => (
      <DAppKitProvider dAppKit={primaryDAppKit}>{props.children}</DAppKitProvider>
    );

    const { result } = renderHook(() => useWAllets({ dAppKit: overrideDAppKit }), { wrapper });

    expect(result()).toEqual([{ name: "Override Wallet" }]);
  });
});
