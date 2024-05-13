import type { Meta, StoryObj } from "@storybook/react";
import Index from "./index";
import { defaultProps } from "./TableRow.defaultProps";
const meta = {
  title: "Elements/TableElements/TableRow",
  component: Index,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Index>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: defaultProps };
