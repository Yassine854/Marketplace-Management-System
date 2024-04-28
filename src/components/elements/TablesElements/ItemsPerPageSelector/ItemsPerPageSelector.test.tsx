import Index from "./index";
import { defaultProps } from "./ItemsPerPageSelector.defaultProps";
import { render } from "@testing-library/react";

it("Render", () => {
  render(<Index {...defaultProps} />);
});
