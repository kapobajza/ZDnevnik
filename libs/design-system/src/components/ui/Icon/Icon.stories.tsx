import type { Meta, StoryObj } from "@storybook/react";

import { Icon } from "./Icon";

const meta: Meta<typeof Icon> = {
  component: Icon,
  title: "Components/Icon",
  tags: ["autodocs"],
};

type Story = StoryObj<typeof Icon>;

export const AllIcons: Story = {
  args: {
    name: "Alert",
  },
};

export default meta;
