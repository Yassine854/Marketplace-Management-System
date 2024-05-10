import type { Meta, StoryObj } from "@storybook/react";
import Index from "./index";
import { headCells } from "./headCells";
import { rows } from "./rows";

const meta = {
  title: "Components/Blocks/Table",
  component: Index,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Index>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { headCells, rows, isLoading: false } };

export const Loading: Story = { args: { headCells, rows, isLoading: true } };
