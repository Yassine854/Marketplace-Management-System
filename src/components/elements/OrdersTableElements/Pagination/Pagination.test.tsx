import Index from "./index";
import { defaultProps } from "./Pagination.defaultProps";
import { render } from "@testing-library/react";

it("Render", () => {
  render(<Index {...defaultProps} />);
});
