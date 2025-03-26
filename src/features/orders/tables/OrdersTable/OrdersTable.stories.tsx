import type { Meta, StoryObj } from "@storybook/react";
import Index from "./index";

const meta = {
  title: "Widgets/OrdersWidgets/OrdersTable",
  component: Index,
  decorators: [
    (Story) => (
      <div>
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

export const Primary: Story = {
  args: {
    orders: [
      {
        status: "pending",
        id: "1",
        kamiounId: "k1",
        state: "new",
        total: 100,
        createdAt: Date.now(),
        customerId: "c1",
        customerFirstname: "John",
        customerLastname: "Doe",
        deliveryAgentId: "d1",
        items: [],
        deliveryAgentName: "Agent Name",
        deliveryDate: Date.now(),
        deliveryStatus: "in transit",
        source: "online",
      },
    ],
  },
};
