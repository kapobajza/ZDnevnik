import type { Meta, StoryObj } from "@storybook/react";

import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
};

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    type: "text",
    placeholder: "Input",
  },
};

export const InputWithError: Story = {
  args: {
    type: "text",
    placeholder: "Input",
    error: "Field is required",
  },
};

export default meta;
