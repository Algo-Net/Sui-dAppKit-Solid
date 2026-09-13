/** biome-ignore-all lint/suspicious/noExplicitAny: The any values are placeholders for elements not relevant to the testing. */

import type { DefaultExpectedDppKit } from "@mysten/dapp-kit-core";
import { renderHook } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import { DAppKitProvider, useDappKitContext } from "./index.js";

// Create a globally accessible layout mock for the Mysten core object
const mockDAppKit = {
  getState: vi.fn(),
  subscribe: vi.fn(),
  setState: vi.fn(),
} as unknown as DefaultExpectedDppKit;

describe("<DAppKitProvider />", () => {
  it("renders child nodes without throwing compilation or runtime errors", () => {
    const wrapper = (props: { children: any }) => (
      <DAppKitProvider dAppKit={mockDAppKit}>
        <div data-testid="child-element">{props.children}</div>
      </DAppKitProvider>
    );

    const { result } = renderHook(() => true, { wrapper });
    expect(result).toBe(true);
  });
});

describe("useDappKitContext()", () => {
  it("sucessfully retrieves the provided dAppkit core instance when called inside a valid provider", () => {
    const wrapper = (props: { children: any }) => (
      <DAppKitProvider dAppKit={mockDAppKit}>{props.children}</DAppKitProvider>
    );

    const { result } = renderHook(() => useDappKitContext(), { wrapper });
    expect(result).toBe(mockDAppKit);
  });

  it("throws a strict runtime error when executed completely outside of an active provider", () => {
    expect(() => renderHook(() => useDappKitContext())).toThrow(/Context must either be created with a default value/);
  });
});
