import type { Meta, StoryObj } from "@storybook/react";
import Index from "./index";

const meta = {
  title: "Widgets/OrdersWidgets/OrdersTable",
  component: Index,
  decorators: [
    (Story) => (
      <div style={{ margin: "3em" }} className="w-[80vw] ">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Index>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
