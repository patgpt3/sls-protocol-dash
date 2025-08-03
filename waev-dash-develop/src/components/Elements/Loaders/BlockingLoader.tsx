import { Dialog, DialogContent, DialogContentText } from '@mui/material';
import { MDBox, MDTypography, WaevAvatarIcon } from 'components';
import { pulseKeyframes, dotDotDotFrames, defineMessages, useIntl } from 'utils';

const messages = defineMessages({
  text: {
    id: 'BlockingLoader.text',
    defaultMessage: 'Working',
  },
});

export const BlockingLoader = () => {
  const intl = useIntl();

  return (
    <Dialog
      open={true}
      onClose={() => {}}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{
        '&>div>div': {
          backgroundColor: 'transparent ',
          overflow: 'hidden',
          boxShadow: 'none',
        },
      }}
    >
      <DialogContent
        sx={{
          animation: `1.5s infinite ${pulseKeyframes()}`,
        }}
      >
        <DialogContentText id="alert-dialog-description" component={'span'}>
          <WaevAvatarIcon
            alt="profile-image"
            size="xxl"
            shadow="sm"
            bgColor="info"
            isAnimating={true}
            sx={{
              backgroundColor: '#9c27b0',
              transform: '200%',
              width: '9.5vw',
              height: '9.5vw',
            }}
          />
        </DialogContentText>
      </DialogContent>
      <MDBox>
        <MDTypography
          variant="h6"
          display="flex"
          position="relative"
          textAlign="center"
          sx={{
            mt: '3vh',
            fontSize: '2vw',
            justifyContent: 'center',
          }}
        >
          {intl.formatMessage(messages.text)}
          <MDBox>
            <MDTypography
              variant="h6"
              textAlign="left"
              position="absolute"
              sx={{
                fontSize: '2vw',
                '&::before': {
                  animation: `1.5s infinite ${dotDotDotFrames()}`,
                  content: '""',
                },
              }}
            />
          </MDBox>
        </MDTypography>
      </MDBox>
    </Dialog>
  );
};
