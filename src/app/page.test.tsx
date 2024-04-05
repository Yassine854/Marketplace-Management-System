import { it } from "vitest";
import { render } from "@testing-library/react";
import Page from "./[locale]/page";

it("Render", () => {
  render(<Page params={{ locale: "en" }} />);
});
