import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Index from "./index";
import { render } from "@testing-library/react";

jest.mock("next/navigation");

const pushMock = jest.fn();

(usePathname as jest.Mock).mockReturnValue("example.com");
(useRouter as jest.Mock).mockReturnValue({
  push: pushMock,
});

function setup(toString: string = ""): void {
  (useSearchParams as jest.Mock).mockReturnValue({
    toString: () => toString,
  });
  render(<Index />);
}

it("Render", () => {
  setup();
});
