import type { DAppKit, DAppKitCompatibleClient } from "@mysten/dapp-kit-core";
import { renderHook } from "@solidjs/testing-library";
import type { JSX } from "@solidjs/web/jsx-runtime";
import { DAppKitProvider } from "src/components/DAppKitProvider";
import { describe, expect, it } from "vitest";
import { useCurrentWallet } from "./useCurrentWallet";

interface MockState {
  status: string;
  wallet?: { name: string } | null;
}

function createMockStore(initialValue: MockState) {
  let currentValue = initialValue;
  const subscribers = new Set<(val: MockState) => void>();

  return {
    get: () => currentValue,
    subscribe: (callback: (val: MockState) => void) => {
      subscribers.add(callback);
      return () => subscribers.delete(callback);
    },
    emit: (newValue: MockState) => {
      currentValue = newValue;
      subscribers.forEach((callback) => {
        callback(newValue);
      });
    },
  };
}

describe("useCurrentWallet()", () => {
  it("returns the initial wallet metadata state matching the active connection store", () => {
    const mockConnectionStore = createMockStore({ status: "disconnected", wallet: null });

    const mockDAppKit = {
      stores: { $connection: mockConnectionStore },
    } as unknown as DAppKit<[], DAppKitCompatibleClient>;

    const wrapper = (props: { children: JSX.Element }) => (
      <DAppKitProvider dAppKit={mockDAppKit}>{props.children}</DAppKitProvider>
    );

    const { result } = renderHook(() => useCurrentWallet(), { wrapper });

    expect(result()).toBeNull();
  });

  it("reactively updates its returned value when a wallet extension links up", async () => {
    const mockConnectionStore = createMockStore({ status: "disconnected", wallet: null });

    const mockDAppKit = {
      stores: { $connection: mockConnectionStore },
    } as unknown as DAppKit<[], DAppKitCompatibleClient>;

    const wrapper = (props: { children: JSX.Element }) => (
      <DAppKitProvider dAppKit={mockDAppKit}>{props.children}</DAppKitProvider>
    );

    const { result } = renderHook(() => useCurrentWallet(), { wrapper });

    mockConnectionStore.emit({ status: "connected", wallet: { name: "Slush Wallet" } });

    // Allow event loop to turn once so the signal queue is completely finished.
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(result()).toEqual({ name: "Slush Wallet" });
  });
});
