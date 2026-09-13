/** biome-ignore-all lint/suspicious/noExplicitAny: The any values are placeholders for elements not relevant to the testing. */

import type { DAppKit } from "@mysten/dapp-kit-core";
import { renderHook } from "@solidjs/testing-library";
import { DAppKitProvider } from "src/components/DAppKitProvider";
import { describe, expect, it } from "vitest";
import { useWalletConnection } from "./useWalletConnection";

// Create a mock store helper that mimics a nanosore structure
function createMockStore(initialValue: any) {
  let currentValue = initialValue;
  const subscribers = new Set<(val: any) => void>();

  return {
    get: () => currentValue,
    subscribe: (callback: (val: any) => void) => {
      subscribers.add(callback);
      return () => subscribers.delete(callback);
    },
    emit: (newValue: any) => {
      currentValue = newValue;
      subscribers.forEach((cb) => {
        cb(newValue);
      });
    },
  };
}

describe("useWalletConnection()", () => {
  it("subscribes to the connection store and returns the initial state value", () => {
    const mockConnectionStore = createMockStore({
      status: "disconnected",
      wallet: null,
    });

    const mockDAppKit = {
      stores: { $connection: mockConnectionStore },
    } as unknown as DAppKit<any>;

    const wrapper = (props: { children: any }) => (
      <DAppKitProvider dAppKit={mockDAppKit}>{props.children}</DAppKitProvider>
    );

    const { result } = renderHook(() => useWalletConnection(), { wrapper });

    expect(result()).toEqual({ status: "disconnected", wallet: null });
  });

  it("updates dynamically when the underlying core store broadcasts a new state change", async () => {
    const mockConnectionStore = createMockStore({ status: "disconnected", wallet: null });

    const mockDAppKit = {
      stores: {
        $connection: mockConnectionStore,
      },
    } as unknown as DAppKit<any>;

    const wrapper = (props: { children: any }) => (
      <DAppKitProvider dAppKit={mockDAppKit}>{props.children}</DAppKitProvider>
    );

    const { result } = renderHook(() => useWalletConnection(), { wrapper });

    mockConnectionStore.emit({ status: "connected", wallet: { name: "Sui Wallet" } });

    // Allow event loop to turn once so the signal queue is completely flushed.
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(result()).toEqual({ status: "connected", wallet: { name: "Sui Wallet" } });
  });

  it("respects an explicitly pass dAppKit instance override rather than using the parent context", () => {
    const primaryStore = createMockStore({ status: "disconnected" });
    const overrideStore = createMockStore({ status: "connected" });

    const primaryDAppKit = { stores: { $connection: primaryStore } } as unknown as DAppKit<any>;
    const overrideDAppKit = { stores: { $connection: overrideStore } } as unknown as DAppKit<any>;

    const wrapper = (props: { children: any }) => (
      <DAppKitProvider dAppKit={primaryDAppKit}>{props.children}</DAppKitProvider>
    );

    const { result } = renderHook(() => useWalletConnection({ dAppKit: overrideDAppKit }), { wrapper });

    expect(result()).toEqual({ status: "connected" });
  });
});
