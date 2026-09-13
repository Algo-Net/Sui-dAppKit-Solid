import type { DAppKit, DAppKitCompatibleClient } from "@mysten/dapp-kit-core";
import { render, screen } from "@solidjs/testing-library";
import { DAppKitProvider } from "src/components/DAppKitProvider";
import { describe, expect, it, vi } from "vitest";
import { ConnectButton } from "./index";

const mockDappKit = {
  getState: vi.fn(),
  subscribe: vi.fn(),
  stores: {},
} as unknown as DAppKit<[], DAppKitCompatibleClient>;

describe("<ConnectButton />", () => {
  it("renders the custom tag successfully inside the DOM structure", () => {
    render(() => (
      <DAppKitProvider dAppKit={mockDappKit}>
        <ConnectButton data-testid="wallet-trigger" />
      </DAppKitProvider>
    ));

    const element = screen.getByTestId("wallet-trigger");

    expect(element.tagName.toLowerCase()).toBe("mysten-dapp-kit-connect-button");
  });
});
