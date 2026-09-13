import type { DAppKit, DAppKitCompatibleClient } from "@mysten/dapp-kit-core";
import { renderHook } from "@solidjs/testing-library";
import type { JSX } from "@solidjs/web/jsx-runtime";
import { DAppKitProvider } from "src/components/DAppKitProvider";
import { describe, expect, it, vi } from "vitest";
import { useDAppKit } from "./index";

const mockDappKit = {
  getState: vi.fn(),
  subscribe: vi.fn(),
  stores: {},
} as unknown as DAppKit<[], DAppKitCompatibleClient>;

describe("useDAppKit()", () => {
  it("successfully retrieves the dAppKit instance from the active provider context tree", () => {
    const wrapper = (props: { children: JSX.Element }) => (
      <DAppKitProvider dAppKit={mockDappKit}>{props.children}</DAppKitProvider>
    );

    const { result } = renderHook(() => useDAppKit(), { wrapper });

    expect(result).toBe(mockDappKit);
  });

  it("prioritizes and returns the explicitly passed dAppKit instance parameter", () => {
    const overrideDAppKit = { name: "OverrideInstance" } as unknown as DAppKit<[], DAppKitCompatibleClient>;

    const wrapper = (props: { children: JSX.Element }) => (
      <DAppKitProvider dAppKit={mockDappKit}>{props.children}</DAppKitProvider>
    );

    const { result } = renderHook(() => useDAppKit(overrideDAppKit), { wrapper });

    expect(result).toBe(overrideDAppKit);
  });

  it("throws a clear error message when executed outside a provider context", () => {
    expect(() => renderHook(() => useDAppKit())).toThrow(
      "Context must either be created with a default value or a value must be provided before accessing it.",
    );
  });
});
