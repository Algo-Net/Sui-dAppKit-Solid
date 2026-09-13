import type { DAppKit, DAppKitCompatibleClient } from "@mysten/dapp-kit-core";
import { renderHook } from "@solidjs/testing-library";
import type { JSX } from "@solidjs/web/jsx-runtime";
import { DAppKitProvider } from "src/components/DAppKitProvider";
import { describe, expect, it } from "vitest";
import { useCurrentClient } from "./useCurrentClient";

interface MockClient {
  endpoint: string;
}

function createMockStore(initialValue: MockClient) {
  let currentValue = initialValue;
  const subscribers = new Set<(val: MockClient) => void>();

  return {
    get: () => currentValue,
    subscribe: (callback: (val: MockClient) => void) => {
      subscribers.add(callback);
      return () => subscribers.delete(callback);
    },
    emit: (newValue: MockClient) => {
      currentValue = newValue;
      subscribers.forEach((callback) => {
        callback(newValue);
      });
    },
  };
}

describe("useCurrentClient()", () => {
  it("subscribes to the client store and returns the initial RPC client instance", () => {
    const mockClientInstance: MockClient = { endpoint: "https://sui.io" };

    const mockClientStore = createMockStore(mockClientInstance);

    const mockDAppKit = {
      stores: { $currentClient: mockClientStore },
    } as unknown as DAppKit<[], DAppKitCompatibleClient>;

    const wrapper = (props: { children: JSX.Element }) => (
      <DAppKitProvider dAppKit={mockDAppKit}>{props.children}</DAppKitProvider>
    );

    const { result } = renderHook(() => useCurrentClient(), { wrapper });

    expect(result()).toEqual(mockClientInstance);
  });

  it("updates dynamically when the underlying core store switches clients", async () => {
    const initialClient: MockClient = { endpoint: "https://sui.io" };
    const nextClient: MockClient = { endpoint: "https://testnet.sui.io" };

    const mockClientStore = createMockStore(initialClient);

    const mockDAppKit = {
      stores: { $currentClient: mockClientStore },
    } as unknown as DAppKit<[], DAppKitCompatibleClient>;

    const wrapper = (props: { children: JSX.Element }) => (
      <DAppKitProvider dAppKit={mockDAppKit}>{props.children}</DAppKitProvider>
    );

    const { result } = renderHook(() => useCurrentClient(), { wrapper });

    expect(result()).toEqual(initialClient);

    mockClientStore.emit(nextClient);

    // Allow event loop to turn once so the signal queue is completely finished.
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(result()).toEqual(nextClient);
  });
});
