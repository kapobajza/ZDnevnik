import type { Meta, StoryObj } from "@storybook/react";

import { AlertDestructive as AlertDestructiveComponent } from "./AlertDestructive";

const meta: Meta<typeof AlertDestructiveComponent> = {
  title: "Components/Alert",
  component: AlertDestructiveComponent,
  tags: ["autodocs"],
};

type Story = StoryObj<typeof AlertDestructiveComponent>;

export const AlertDestructive: Story = {
  args: {
    children: "Destructive Alert",
  },
};

export default meta;
