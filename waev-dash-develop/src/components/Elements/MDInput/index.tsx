import { FC, forwardRef } from 'react';

// @mui material components
import { OutlinedTextFieldProps, StandardTextFieldProps } from '@mui/material';

// Custom styles for MDInput
import MDInputRoot from 'components/Elements/MDInput/MDInputRoot';

// Declaring props types for MDInput
interface Props extends Omit<OutlinedTextFieldProps | StandardTextFieldProps, 'variant'> {
  variant?: 'standard' | 'outlined' | 'filled';
  error?: boolean;
  success?: boolean;
  disabled?: boolean;
  autoComplete?: string;
}

const MDInput: FC<Props | any> = forwardRef<HTMLInputElement, Props>(
  ({ error, success, disabled, autoComplete, variant, ...rest }, ref) => (
    <MDInputRoot
      inputProps={{
        autoComplete,
      }}
      {...rest}
      ref={ref}
      ownerState={{ error, success, disabled, variant }}
    />
  )
);

// Declaring default props for MDInput
MDInput.defaultProps = {
  error: false,
  success: false,
  disabled: false,
  autoComplete: 'off',
};

export default MDInput;
