import React from "react";
import type { AccessibilityProps } from "react-native";
import { Platform } from "react-native";
import styled from "styled-components/native";

const StyledButton = styled.TouchableOpacity`
  background-color: #0056b3;
  padding: 14px 28px;
  border-radius: 4px;
  align-items: center;
  outline-width: 2px;
  outline-color: #fff;
  outline-style: solid;
  ${Platform.OS === "web" &&
  `
      cursor: pointer;
      transition: background 0.2s;
      &:hover, &:focus {
        background-color: #003a75;
        outline: 2px solid #222;
        outline-offset: 2px;
      }
      &:active {
        background-color: #00264d;
      }
    `}
`;

const PrimaryButton = styled(StyledButton)`
  background-color: #0056b3;
  &:disabled {
    background-color: #b3c6e0;
  }
`;

const SecondaryButton = styled(StyledButton)`
  background-color: #e0e0e0;
  border: 2px solid #0056b3;
  &:disabled {
    background-color: #f5f5f5;
    border-color: #b3c6e0;
  }
`;

const SubmitButton = styled(StyledButton)`
  background-color: #007a1f;
  &:hover,
  &:focus {
    background-color: #005c17;
  }
  &:disabled {
    background-color: #b3e0c6;
  }
`;

const CancelButton = styled(StyledButton)`
  background-color: #b30000;
  &:hover,
  &:focus {
    background-color: #7a0000;
  }
  &:disabled {
    background-color: #e0b3b3;
  }
`;

const StyledButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.5px;
`;

const SecondaryButtonText = styled(StyledButtonText)`
  color: #0056b3;
`;

type MyCommonButtonProps = React.PropsWithChildren<{
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  ariaLabel?: string | false;
  disabled?: boolean;
  /** Is the button primary */
  primary?: boolean;
  /** What background color to use */
  backgroundColor?: string;
  /** How large should the button be? */
  size?: "small" | "medium" | "large";
}> &
  AccessibilityProps;

type MyButtonProps = React.PropsWithChildren<{
  label?: string;
}> &
  MyCommonButtonProps;

export const MyButton: React.FC<MyButtonProps> = (props) => {
  const { primary, size = "medium", label, children } = props;

  // Size styles
  let fontSize = 18;
  if (size === "small") {
    fontSize = 14;
  } else if (size === "large") {
    fontSize = 22;
  }

  // Choose button type
  const ButtonComponent = primary ? PrimaryButton : SecondaryButton;

  // Use correct text color for secondary button
  const TextComponent =
    ButtonComponent === SecondaryButton
      ? SecondaryButtonText
      : StyledButtonText;
  return (
    <ButtonComponent
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel}
      accessibilityHint={props.accessibilityHint}
      disabled={props.disabled}
      activeOpacity={0.85}
      {...props}
    >
      <TextComponent style={{ fontSize }}>{label || children}</TextComponent>
    </ButtonComponent>
  );
};

export const MyPrimaryButton: React.FC<MyCommonButtonProps> = (props) => {
  const { ariaLabel, accessibilityLabel, ...rest } = props;
  const a11yLabel =
    ariaLabel === false
      ? undefined
      : typeof ariaLabel === "string"
        ? ariaLabel
        : accessibilityLabel;
  const webProps =
    Platform.OS === "web" && a11yLabel ? { "aria-label": a11yLabel } : {};
  return (
    <PrimaryButton
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      accessibilityHint={props.accessibilityHint}
      disabled={props.disabled}
      activeOpacity={0.85}
      {...webProps}
      {...rest}
    >
      <StyledButtonText>{props.children}</StyledButtonText>
    </PrimaryButton>
  );
};

export const MySecondaryButton: React.FC<MyCommonButtonProps> = (props) => {
  const { ariaLabel, accessibilityLabel, ...rest } = props;
  const a11yLabel =
    ariaLabel === false
      ? undefined
      : typeof ariaLabel === "string"
        ? ariaLabel
        : accessibilityLabel;
  const webProps =
    Platform.OS === "web" && a11yLabel ? { "aria-label": a11yLabel } : {};
  return (
    <SecondaryButton
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      accessibilityHint={props.accessibilityHint}
      disabled={props.disabled}
      activeOpacity={0.85}
      {...webProps}
      {...rest}
    >
      <SecondaryButtonText>{props.children}</SecondaryButtonText>
    </SecondaryButton>
  );
};

export const MySubmitButton: React.FC<MyCommonButtonProps> = (props) => {
  const { ariaLabel, accessibilityLabel, ...rest } = props;
  const a11yLabel =
    ariaLabel === false
      ? undefined
      : typeof ariaLabel === "string"
        ? ariaLabel
        : accessibilityLabel;
  const webProps =
    Platform.OS === "web" && a11yLabel ? { "aria-label": a11yLabel } : {};
  return (
    <SubmitButton
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      accessibilityHint={props.accessibilityHint}
      disabled={props.disabled}
      activeOpacity={0.85}
      {...webProps}
      {...rest}
    >
      <StyledButtonText>{props.children}</StyledButtonText>
    </SubmitButton>
  );
};

export const MyCancelButton: React.FC<MyCommonButtonProps> = (props) => {
  const { ariaLabel, accessibilityLabel, ...rest } = props;
  const a11yLabel =
    ariaLabel === false
      ? undefined
      : typeof ariaLabel === "string"
        ? ariaLabel
        : accessibilityLabel;
  const webProps =
    Platform.OS === "web" && a11yLabel ? { "aria-label": a11yLabel } : {};
  return (
    <CancelButton
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      accessibilityHint={props.accessibilityHint}
      disabled={props.disabled}
      activeOpacity={0.85}
      {...webProps}
      {...rest}
    >
      <StyledButtonText>{props.children}</StyledButtonText>
    </CancelButton>
  );
};
