// Waev Dashboard components
import MDInput from 'components/Elements/MDInput';

// Declaring props types for FormField
interface Props {
  label?: string;
  value?: string;
  [key: string]: any;
}

export function FormField ({ label = ' ', value, ...rest }: Props): JSX.Element {
  return (
    <MDInput
      variant="standard"
      label={label}
      value={value || ''}
      fullWidth
      InputLabelProps={{ shrink: true }}
      onChange={(e: any) => {}}
      {...rest}
    />
  );
}

export * from './FancyCheckbox';
export * from './FancyIconButton';
export * from './InputWithAction';
