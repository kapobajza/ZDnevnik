import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { Span } from "@/components/ui/Typography";

const meta: Meta<typeof Span> = {
  title: "Components/Typography/Spans",
  component: Span,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { onClick: fn() },
};

type Story = StoryObj<typeof Span>;

export const Small: Story = {
  args: {
    variant: "small",
    children: "Small",
  },
};

export const InlineCode: Story = {
  args: {
    variant: "inline_code",
    children: "Inline Code",
  },
};

export const TableItem: Story = {
  args: {
    variant: "table_item",
    children: "Table Item",
  },
};

export default meta;
