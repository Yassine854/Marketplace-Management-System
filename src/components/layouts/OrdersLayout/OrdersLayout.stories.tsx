import type { Meta, StoryObj } from "@storybook/react";
import Index from "./index";
const meta = {
  title: "Layouts/OrdersLayout",
  component: Index,
  decorators: [
    (Story) => (
      <div className="h-[80vh] w-[90vw]">
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
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
