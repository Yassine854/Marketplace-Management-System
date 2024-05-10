import type { Meta, StoryObj } from "@storybook/react";
import Index from "./index";

const C = () => <div>Top Nav Bar</div>;
const meta = {
  title: "Components/Widgets/TopNavBar",
  component: C,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Index>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
