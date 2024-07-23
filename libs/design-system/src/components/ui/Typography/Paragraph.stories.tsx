import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { Paragraph as ParagraphComponent } from "@/components/ui/Typography";

const meta: Meta<typeof ParagraphComponent> = {
  title: "Components/Typography/Parahraphs",
  component: ParagraphComponent,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { onClick: fn() },
};

type Story = StoryObj<typeof ParagraphComponent>;

export const Paragraph: Story = {
  args: {
    variant: "p",
    children: "Paragraph",
  },
};

export const ParagraphUI: Story = {
  args: {
    variant: "p_ui",
    children: "Paragraph UI",
  },
};

export const BodyMedium: Story = {
  args: {
    variant: "body_medium",
    children: "Body Medium",
  },
};

export const Blockquote: Story = {
  args: {
    variant: "blockquote",
    children: "Blockquote",
  },
};

export const TableHead: Story = {
  args: {
    variant: "table_head",
    children: "Table Head",
  },
};

export const Lead: Story = {
  args: {
    variant: "lead",
    children: "Lead",
  },
};

export const Large: Story = {
  args: {
    variant: "large",
    children: "Large",
  },
};

export const Subtle: Story = {
  args: {
    variant: "subtle",
    children: "Subtle",
  },
};

export const Emphasize: Story = {
  args: {
    variant: "emphasize",
    children: "Emphasize",
  },
};

export default meta;
