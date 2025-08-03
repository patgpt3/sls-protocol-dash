// Waev Dashboard components
import { Dialog } from '@mui/material';
import { RenewToken } from './RenewToken';

interface RenewTokenModalProps {
  isOpen?: boolean;
  setIsOpen?: (bool: boolean) => void;
}

export function RenewTokenModal({ isOpen, setIsOpen }: RenewTokenModalProps): JSX.Element {
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth={'md'}
      sx={{
        '.MuiDialog-paper': {
          backgroundColor: 'transparent !important',
          padding: 3,
          boxShadow: '0',
        },
      }}
    >
      <RenewToken onSuccess={() => setIsOpen(false)} />
    </Dialog>
  );
}
