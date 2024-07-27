import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Heading } from "@ds/components/ui/Typography";

const meta: Meta<typeof Heading> = {
  title: "Components/Typography/Headings",
  component: Heading,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { onClick: fn() },
};

type Story = StoryObj<typeof Heading>;

export const H1: Story = {
  args: {
    variant: "h1",
    children: "heading 1",
    className: "zd-text-primary",
  },
};

export const H2: Story = {
  args: {
    variant: "h2",
    children: "heading 2",
  },
};

export const H3: Story = {
  args: {
    variant: "h3",
    children: "heading 3",
  },
};

export const H4: Story = {
  args: {
    variant: "h4",
    children: "heading 4",
  },
};

export default meta;
