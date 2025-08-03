import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import colors from 'assets/theme/base/colors';
const { light, gradients } = colors;

interface ContentModalProps {
  isOpen: boolean;
  setIsOpen: (value: any) => void;
  isSetUndefined?: boolean;
  title?: string;
  description?: string;

  primaryText: string;
  onPrimaryClick: () => void;
  secondaryText?: string;
  onSecondaryClick?: () => void;
  children?: JSX.Element;
}

export function ContentModal({
  isOpen,
  setIsOpen,
  isSetUndefined,
  title,
  description,
  primaryText,
  onPrimaryClick,
  secondaryText,
  onSecondaryClick,
  children,
}: ContentModalProps) {
  const handleClose = () => {
    setIsOpen(isSetUndefined ? undefined : false);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ '&>div>div': { minWidth: '45%' } }}
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{ backgroundColor: gradients.dark.main, textAlign: 'center' }}
      >
        {title}
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: gradients.dark.main, textAlign: 'center' }}>
        <DialogContentText id="alert-dialog-description" sx={{ mb: 2 }}>
          {description}
        </DialogContentText>
        {children}
      </DialogContent>
      <DialogActions sx={{ backgroundColor: gradients.dark.main }}>
        {onSecondaryClick && (
          <Button
            onClick={onSecondaryClick}
            autoFocus
            variant="outlined"
            sx={{
              mr: 'auto',
              color: `${light.main} !important`,
              '&:hover': {
                borderColor: `${light.main} !important`,
                backgroundColor: gradients.info.state,
                color: `${light.main} !important`,
              },
            }}
          >
            {secondaryText || 'Cancel'}
          </Button>
        )}
        <Button
          onClick={onPrimaryClick}
          variant="outlined"
          sx={{
            ml: 'auto',
            color: `${light.main} !important`,
            '&:hover': {
              borderColor: `${light.main} !important`,
              backgroundColor: gradients.info.state,
              color: `${light.main} !important`,
            },
          }}
        >
          {primaryText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
