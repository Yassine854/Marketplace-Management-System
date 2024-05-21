import type { Meta, StoryObj } from "@storybook/react";
import { defaultProps } from "./ItemsPerPageSelector.defaultProps";
import Index from "./index";
const meta = {
  title: "Elements/TableElements/ItemsPerPageSelector",
  component: Index,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Index>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { ...defaultProps } };
