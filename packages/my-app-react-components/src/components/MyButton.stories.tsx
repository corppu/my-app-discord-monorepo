import type { Meta, StoryObj } from "@storybook/react-native-web-vite";

import { View } from "react-native";
import { fn } from "storybook/test";

import {
  MyButton,
  MyPrimaryButton,
  MySecondaryButton,
  MySubmitButton,
  MyCancelButton,
} from "./MyButton";
// Primary Button Story
export const PrimaryComponent: Story = {
  render: (args) => (
    <MyPrimaryButton ariaLabel={false} {...args}>
      Primary
    </MyPrimaryButton>
  ),
  args: {
    accessibilityLabel: "Primary button",
  },
};

// Secondary Button Story
export const SecondaryComponent: Story = {
  render: (args) => (
    <MySecondaryButton ariaLabel={false} {...args}>
      Secondary
    </MySecondaryButton>
  ),
  args: {
    accessibilityLabel: "Secondary button",
  },
};

// Submit Button Story
export const SubmitComponent: Story = {
  render: (args) => (
    <MySubmitButton ariaLabel={false} {...args}>
      Submit
    </MySubmitButton>
  ),
  args: {
    accessibilityLabel: "Submit button",
  },
};

// Cancel Button Story
export const CancelComponent: Story = {
  render: (args) => (
    <MyCancelButton ariaLabel={false} {...args}>
      Cancel
    </MyCancelButton>
  ),
  args: {
    accessibilityLabel: "Cancel button",
  },
};

const meta = {
  title: "Example/Button",
  component: MyButton,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, alignItems: "flex-start" }}>
        <Story />
      </View>
    ),
  ],
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // Use `fn` to spy on the onPress arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
  args: { onPress: fn() },
} satisfies Meta<typeof MyButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    primary: true,
    label: "Button",
  },
};

export const Secondary: Story = {
  args: {
    label: "Button",
  },
};

export const Large: Story = {
  args: {
    size: "large",
    label: "Button",
  },
};

export const Small: Story = {
  args: {
    size: "small",
    label: "Button",
  },
};
