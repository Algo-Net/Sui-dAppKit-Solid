import type { DAppKit, DAppKitCompatibleClient } from "@mysten/dapp-kit-core";
import { renderHook } from "@solidjs/testing-library";
import type { JSX } from "@solidjs/web/jsx-runtime";
import { DAppKitProvider } from "src/components/DAppKitProvider";
import { describe, expect, it } from "vitest";
import { useCurrentNetwork } from "./index";

function createMockStore(initialValue: string) {
  let currentValue = initialValue;
  const subscribers = new Set<(val: string) => void>();

  return {
    get: () => currentValue,
    subscribe: (callback: (val: string) => void) => {
      subscribers.add(callback);
      return () => subscribers.delete(callback);
    },
    emit: (newValue: string) => {
      currentValue = newValue;
      subscribers.forEach((callback) => {
        callback(newValue);
      });
    },
  };
}

describe("useCurrentNetwork()", () => {
  it("subscribes to the network store and returns the initial network variable value", () => {
    const mockNetworkStore = createMockStore("sui:mainnet");

    const mockDAppKit = {
      stores: { $currentNetwork: mockNetworkStore },
    } as unknown as DAppKit<[], DAppKitCompatibleClient>;

    const wrapper = (props: { children: JSX.Element }) => (
      <DAppKitProvider dAppKit={mockDAppKit}>{props.children}</DAppKitProvider>
    );

    const { result } = renderHook(() => useCurrentNetwork(), { wrapper });

    expect(result()).toBe("sui:mainnet");
  });

  it("updates dynamically when the underlying core store switches networks", async () => {
    const mockNetworkStore = createMockStore("sui::mainnet");

    const mockDAppKit = {
      stores: { $currentNetwork: mockNetworkStore },
    } as unknown as DAppKit<[], DAppKitCompatibleClient>;

    const wrapper = (props: { children: JSX.Element }) => (
      <DAppKitProvider dAppKit={mockDAppKit}>{props.children}</DAppKitProvider>
    );

    const { result } = renderHook(() => useCurrentNetwork(), { wrapper });

    mockNetworkStore.emit("sui:testnet");

    // Allow event loop to turn once so the signal queue is completely finished.
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(result()).toBe("sui:testnet");
  });
});
