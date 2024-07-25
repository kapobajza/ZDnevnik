import type { Meta, StoryObj } from "@storybook/react";

import { LoginPage } from "./Login.page";

const meta: Meta<typeof LoginPage> = {
  title: "Pages/Login",
  component: LoginPage,
  tags: ["autodocs"],
};

type Story = StoryObj<typeof LoginPage>;

export const Default: Story = {};

export default meta;
